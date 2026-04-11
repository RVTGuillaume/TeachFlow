import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EnseignantsService } from './enseignants.service';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Enseignants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enseignants')
export class EnseignantsController {
  constructor(private readonly enseignantsService: EnseignantsService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un enseignant' })
  create(@Body() dto: CreateEnseignantDto) {
    return this.enseignantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les enseignants' })
  findAll() {
    return this.enseignantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un enseignant' })
  findOne(@Param('id') id: string) {
    return this.enseignantsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un enseignant' })
  update(@Param('id') id: string, @Body() dto: UpdateEnseignantDto) {
    return this.enseignantsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un enseignant' })
  remove(@Param('id') id: string) {
    return this.enseignantsService.remove(id);
  }
}