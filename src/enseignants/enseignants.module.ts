import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnseignantsController } from './enseignants.controller';
import { EnseignantsService } from './enseignants.service';
import { Enseignant, EnseignantSchema } from './schemas/enseignant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Enseignant.name, schema: EnseignantSchema },
    ]),
  ],
  controllers: [EnseignantsController],
  providers: [EnseignantsService],
  exports: [EnseignantsService, MongooseModule],
})
export class EnseignantsModule {}