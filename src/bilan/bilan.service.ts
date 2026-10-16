import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enseignant, EnseignantDocument } from '../enseignants/schemas/enseignant.schema';

@Injectable()
export class BilanService {
  constructor(
    @InjectModel(Enseignant.name)
    private enseignantModel: Model<EnseignantDocument>,
  ) {}

  async getBilan() {
    const enseignants = await this.enseignantModel.find();

    if (enseignants.length === 0) {
      return {
        message: 'Aucun enseignant enregistré',
        data: {
          total: 0,
          prestationTotale: 0,
          prestationMinimale: null,
          prestationMaximale: null,
          enseignants: [],
        },
      };
    }

    const avecPrestation = enseignants.map((e) => ({
      _id: e._id,
      matricule: e.matricule,
      nom: e.nom,
      tauxHoraire: e.tauxHoraire,
      nombreHeures: e.nombreHeures,
      prestation: e.tauxHoraire * e.nombreHeures,
    }));

    const prestations = avecPrestation.map((e) => e.prestation);
    const prestationTotale = prestations.reduce((a, b) => a + b, 0);
    const prestationMinimale = Math.min(...prestations);
    const prestationMaximale = Math.max(...prestations);

    const enseignantMin = avecPrestation.find(
      (e) => e.prestation === prestationMinimale,
    );
    const enseignantMax = avecPrestation.find(
      (e) => e.prestation === prestationMaximale,
    );

    return {
      message: 'Bilan des prestations',
      data: {
        total: enseignants.length,
        prestationTotale,
        prestationMinimale,
        prestationMaximale,
        enseignantMin,
        enseignantMax,
        enseignants: avecPrestation,
      },
    };
  }
}