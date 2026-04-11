import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class AskDto {
  @ApiProperty({ example: 'Explique la gestion des enseignants' })
  @IsString()
  @MinLength(2)
  prompt: string;
}

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Poser une question à l IA (multi-modèles)' })
  ask(@Body() body: AskDto) {
    return this.aiService.ask(body.prompt);
  }
}