import {
  Controller, Post, Get, Body,
  UseGuards, Request, Res, HttpCode,
} from '@nestjs/common';
import type { Response } from 'express'; // ✅ CHANGÉ: import type
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Se connecter' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    // ❌ SUPPRIMÉ: toute la logique rememberMe et refreshToken
    // ✅ Retourne uniquement le token et les infos utilisateur
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Se déconnecter' })
  async logout(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    // ✅ Supprime le cookie si jamais il existe (pour nettoyer)
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return this.authService.logout(req.user._id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Voir son profil' })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user._id);
  }
}