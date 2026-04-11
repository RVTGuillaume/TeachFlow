import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BilanService } from './bilan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bilan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bilan')
export class BilanController {
  constructor(private readonly bilanService: BilanService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir le bilan des prestations' })
  getBilan() {
    return this.bilanService.getBilan();
  }
}