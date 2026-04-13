"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnseignantsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enseignant_schema_1 = require("./schemas/enseignant.schema");
let EnseignantsService = class EnseignantsService {
    enseignantModel;
    constructor(enseignantModel) {
        this.enseignantModel = enseignantModel;
    }
    async create(dto) {
        const exists = await this.enseignantModel.findOne({ matricule: dto.matricule });
        if (exists) {
            throw new common_1.ConflictException(`Le matricule ${dto.matricule} existe déjà`);
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
    async findOne(id) {
        const enseignant = await this.enseignantModel.findById(id);
        if (!enseignant) {
            throw new common_1.NotFoundException('Enseignant introuvable');
        }
        return { data: enseignant };
    }
    async update(id, dto) {
        const enseignant = await this.enseignantModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true });
        if (!enseignant) {
            throw new common_1.NotFoundException('Enseignant introuvable');
        }
        return {
            message: 'Modification réussie',
            data: enseignant,
        };
    }
    async remove(id) {
        const enseignant = await this.enseignantModel.findByIdAndDelete(id);
        if (!enseignant) {
            throw new common_1.NotFoundException('Enseignant introuvable');
        }
        return { message: 'Suppression réussie' };
    }
};
exports.EnseignantsService = EnseignantsService;
exports.EnseignantsService = EnseignantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(enseignant_schema_1.Enseignant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EnseignantsService);
//# sourceMappingURL=enseignants.service.js.map