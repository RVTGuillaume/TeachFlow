// backend/src/ai/ai.controller.ts
import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';



class AskDto {
  @ApiProperty({ example: 'Quel est le total des prestations ?' })
  @IsString()
  @MinLength(1)
  prompt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  context?: string;
}

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  @ApiOperation({ summary: "Poser une question à l'IA" })
  ask(
    @Body() body: AskDto,
    @Headers('x-session-id') sessionId?: string,
  ) {
    return this.aiService.ask(body.prompt, body.context, sessionId || 'default-session');
  }

  @Post('clear')
  @ApiOperation({ summary: "Réinitialiser la mémoire conversationnelle" })
  clearMemory(@Headers('x-session-id') sessionId?: string) {
    this.aiService.clearMemory(sessionId || 'default-session');
    return { message: 'Mémoire réinitialisée' };
  }
}