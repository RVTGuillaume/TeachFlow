import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enseignant, EnseignantDocument } from './schemas/enseignant.schema';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

@Injectable()
export class EnseignantsService {
  constructor(
    @InjectModel(Enseignant.name)
    private enseignantModel: Model<EnseignantDocument>,
  ) {}

  async create(dto: CreateEnseignantDto) {
    const exists = await this.enseignantModel.findOne({ matricule: dto.matricule });
    if (exists) {
      throw new ConflictException(`Le matricule ${dto.matricule} existe déjà`);
    }
    const enseignant = await this.enseignantModel.create(dto);
    return {
      message: 'Insertion réussie',
      data: enseignant,
    };
  }

  async findAll() {
    const data = await this.enseignantModel.find().sort({ nom: 1 });
    return { message: 'Liste des enseignants', data };
  }

  async findOne(id: string) {
    const enseignant = await this.enseignantModel.findById(id);
    if (!enseignant) {
      throw new NotFoundException('Enseignant introuvable');
    }
    return { data: enseignant };
  }

  async update(id: string, dto: UpdateEnseignantDto) {
    const enseignant = await this.enseignantModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );
    if (!enseignant) {
      throw new NotFoundException('Enseignant introuvable');
    }
    return {
      message: 'Modification réussie',
      data: enseignant,
    };
  }

  async remove(id: string) {
    const enseignant = await this.enseignantModel.findByIdAndDelete(id);
    if (!enseignant) {
      throw new NotFoundException('Enseignant introuvable');
    }
    return { message: 'Suppression réussie' };
  }
}