import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jean@ecole.mg' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @ApiProperty({ example: 'MonMotDePasse123!' })
  @IsString()
  @MinLength(8, { message: 'Mot de passe trop court' })
  password: string;
  
  // ✅ CORRECT: pas de champ rememberMe
}