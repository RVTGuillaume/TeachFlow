import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnseignantDocument = Enseignant & Document;

@Schema({ timestamps: true, collection: 'enseignants' })
export class Enseignant {
  @Prop({ required: true, trim: true })
  matricule: string;

  @Prop({ required: true, trim: true })
  nom: string;

  @Prop({ required: true, min: 0 })
  tauxHoraire: number;

  @Prop({ required: true, min: 0 })
  nombreHeures: number;
}

export const EnseignantSchema = SchemaFactory.createForClass(Enseignant);

EnseignantSchema.virtual('prestation').get(function () {
  return this.tauxHoraire * this.nombreHeures;
});

EnseignantSchema.set('toJSON', { virtuals: true });
EnseignantSchema.set('toObject', { virtuals: true });