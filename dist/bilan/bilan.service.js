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
exports.BilanService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enseignant_schema_1 = require("../enseignants/schemas/enseignant.schema");
let BilanService = class BilanService {
    enseignantModel;
    constructor(enseignantModel) {
        this.enseignantModel = enseignantModel;
    }
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
        const enseignantMin = avecPrestation.find((e) => e.prestation === prestationMinimale);
        const enseignantMax = avecPrestation.find((e) => e.prestation === prestationMaximale);
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
};
exports.BilanService = BilanService;
exports.BilanService = BilanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(enseignant_schema_1.Enseignant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BilanService);
//# sourceMappingURL=bilan.service.js.map