import { IsString, IsNumber, Min, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnseignantDto {
  @ApiProperty({ example: 'ENS001', description: 'Matricule unique' })
  @IsString()
  @MinLength(3, { message: 'Le matricule doit contenir au moins 3 caractères' })
  @MaxLength(20, { message: 'Le matricule ne peut pas dépasser 20 caractères' })
  matricule: string;

  @ApiProperty({ example: 'Jean Dupont', description: 'Nom complet' })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  nom: string;

  @ApiProperty({ example: 5000, description: 'Taux horaire en Ariary' })
  @IsNumber({}, { message: 'Le taux horaire doit être un nombre' })
  @Min(0, { message: 'Le taux horaire ne peut pas être négatif' })
  tauxHoraire: number;

  @ApiProperty({ example: 40, description: 'Nombre d heures effectuées' })
  @IsNumber({}, { message: 'Le nombre d heures doit être un nombre' })
  @Min(0, { message: 'Le nombre d heures ne peut pas être négatif' })
  nombreHeures: number;
}