import { PartialType } from '@nestjs/mapped-types'; // Use mapped-types for partial updates
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Perfil de usuário inválido' })
  role?: UserRole;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @Matches(/^(?!.*(\d)\1{10})\d{11}$/, {
    message:
      'O número de telefone deve conter 11 dígitos e não pode ser uma sequência repetida',
  })
  phone?: string;

  @IsOptional()
  address?: string;
}
