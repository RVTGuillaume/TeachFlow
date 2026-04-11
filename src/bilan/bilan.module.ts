import { Module } from '@nestjs/common';
import { BilanController } from './bilan.controller';
import { BilanService } from './bilan.service';
import { EnseignantsModule } from '../enseignants/enseignants.module';

@Module({
  imports: [EnseignantsModule],
  controllers: [BilanController],
  providers: [BilanService],
})
export class BilanModule {}