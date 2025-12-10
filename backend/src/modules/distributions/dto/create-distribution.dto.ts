import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDistributionDto {
  @ApiProperty({
    example: '18ae3d51-7136-4806-9bab-bf5f61e5848c',
    description: 'ID do usuário beneficiário',
  })
  @IsNotEmpty({ message: 'O ID do beneficiário é obrigatório' })
  @IsUUID('4', { message: 'ID do beneficiário inválido' })
  beneficiaryId: string;

  @ApiProperty({
    example: 'e9be3eed-b704-4c2f-8bcd-3619e175c3a5',
    description: 'ID do usuário funcionário que realizou a distribuição',
  })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  @IsUUID('4', { message: 'ID do funcionário inválido' })
  employeeId: string;

  @ApiProperty({
    example: 'fc5705c7-1940-47bc-923f-3a6471cc6c6a',
    description: 'ID do item distribuído',
  })
  @IsNotEmpty({ message: 'O ID do item é obrigatório' })
  @IsUUID('4', { message: 'ID do item inválido' })
  itemId: string;

  @ApiPropertyOptional({
    example: 'Entregue na data X',
    description: 'Observações sobre a distribuição',
  })
  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string' })
  observations?: string;
}
