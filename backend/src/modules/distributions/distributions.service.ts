// src/modules/distributions/distributions.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Distribution } from './entities/distribution.entity';
import { CreateDistributionDto } from './dto/create-distribution.dto';
import { UpdateDistributionDto } from './dto/update-distribution.dto';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { InventoryService } from '../inventory/inventory.service';
import { User, UserRole } from '../users/entities/user.entity';
import { Item, ItemStatus } from '../items/entities/item.entity';
import { PageOptionsDto } from '../../common/pagination/dto/page-options.dto';
import { PageDto } from '../../common/pagination/dto/page.dto';
import { PageMetaDto } from '../../common/pagination/dto/page-meta.dto';

@Injectable()
export class DistributionsService {
  constructor(
    @InjectRepository(Distribution)
    private distributionsRepository: Repository<Distribution>,
    private usersService: UsersService,
    private itemsService: ItemsService,
    private inventoryService: InventoryService,
  ) {}

async create(
  createDistributionDto: CreateDistributionDto,
  currentUser: User,
): Promise<Distribution> {

  const beneficiary = await this.usersService.findOne(
    createDistributionDto.beneficiaryId,
  );
  if (beneficiary.role !== UserRole.BENEFICIARIO) {
    throw new ConflictException(
      `Usuário com ID ${createDistributionDto.beneficiaryId} não é um beneficiário.`,
    );
  }

  // Verificar se o funcionário existe e é um funcionário
  const employee = await this.usersService.findOne(
    createDistributionDto.employeeId,
  );
  if (
    employee.role !== UserRole.FUNCIONARIO &&
    employee.role !== UserRole.ADMIN
  ) {
    throw new ConflictException(
      `Usuário com ID ${createDistributionDto.employeeId} não é um funcionário ou admin.`,
    );
  }

  // Buscar o item e verificar se está disponível
  const item = await this.itemsService.findOne(createDistributionDto.itemId);

  // Verificar se o item está reservado
  if (item.status !== ItemStatus.RESERVADO) {
    throw new ConflictException(
      `Item com ID ${createDistributionDto.itemId} não está reservado para distribuição.`,
    );
  }

  // Atualizar o status do item para DISTRIBUIDO
  await this.itemsService.update(
    createDistributionDto.itemId,
    { status: ItemStatus.DISTRIBUIDO },
    currentUser,
  );

  const distribution = this.distributionsRepository.create({
    beneficiary,
    beneficiaryId: beneficiary.id,
    employee,
    employeeId: employee.id,
    items: [item], // ✅ Array com 1 item - mantém compatível com ManyToMany
    observations: createDistributionDto.observations,
  });

  return this.distributionsRepository.save(distribution);
}

  // Método antigo sem paginação, mantido para compatibilidade
  async findAll(): Promise<Distribution[]> {
    return this.distributionsRepository.find();
  }

  // Novo método com paginação
  async findAllPaginated(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Distribution>> {
    const queryBuilder = this.distributionsRepository
      .createQueryBuilder('distribution')
      .leftJoinAndSelect('distribution.beneficiary', 'beneficiary')
      .leftJoinAndSelect('distribution.employee', 'employee')
      .leftJoinAndSelect('distribution.items', 'items')
      .orderBy('distribution.date', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const distributions = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(distributions, pageMetaDto);
  }

  async findOne(id: string): Promise<Distribution> {
    const distribution = await this.distributionsRepository.findOne({
      where: { id },
    });
    if (!distribution) {
      throw new NotFoundException(`Distribuição com ID ${id} não encontrada`);
    }
    return distribution;
  }

  // Modificado para suportar paginação
  async findByBeneficiary(
    beneficiaryId: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<Distribution[] | PageDto<Distribution>> {
    // Se não houver pageOptionsDto, retorna sem paginação (para compatibilidade)
    if (!pageOptionsDto) {
      return this.distributionsRepository.find({ where: { beneficiaryId } });
    }

    // Com paginação
    const queryBuilder = this.distributionsRepository
      .createQueryBuilder('distribution')
      .leftJoinAndSelect('distribution.beneficiary', 'beneficiary')
      .leftJoinAndSelect('distribution.employee', 'employee')
      .leftJoinAndSelect('distribution.items', 'items')
      .where('distribution.beneficiaryId = :beneficiaryId', { beneficiaryId })
      .orderBy('distribution.date', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const distributions = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(distributions, pageMetaDto);
  }

  async update(
    id: string,
    updateDistributionDto: UpdateDistributionDto,
    currentUser: User,
  ): Promise<Distribution> {
    // Apenas Admin ou Funcionário podem atualizar distribuições
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.role !== UserRole.FUNCIONARIO
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar distribuições.',
      );
    }

    const distribution = await this.findOne(id);

    // Atualizar apenas as observações é permitido
    // Outras alterações (como beneficiário, funcionário ou itens) podem exigir regras de negócio mais complexas
    if (updateDistributionDto.observations) {
      distribution.observations = updateDistributionDto.observations;
    }

    // Implementar lógica adicional para outras atualizações se necessário
    // Por exemplo, adicionar ou remover itens da distribuição exigiria atualizar o inventário

    return this.distributionsRepository.save(distribution);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    // Apenas Admin pode remover distribuições
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Você não tem permissão para remover distribuições.',
      );
    }

    const distribution = await this.findOne(id);

    // Implementar lógica para reverter as alterações no inventário e nos itens
    // Por exemplo, devolver os itens ao inventário e alterar o status de volta para DISPONIVEL

    await this.distributionsRepository.remove(distribution);
  }
}
