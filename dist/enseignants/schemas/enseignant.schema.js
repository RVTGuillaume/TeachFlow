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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnseignantSchema = exports.Enseignant = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Enseignant = class Enseignant {
    matricule;
    nom;
    tauxHoraire;
    nombreHeures;
};
exports.Enseignant = Enseignant;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Enseignant.prototype, "matricule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Enseignant.prototype, "nom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Enseignant.prototype, "tauxHoraire", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Enseignant.prototype, "nombreHeures", void 0);
exports.Enseignant = Enseignant = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'enseignants' })
], Enseignant);
exports.EnseignantSchema = mongoose_1.SchemaFactory.createForClass(Enseignant);
exports.EnseignantSchema.virtual('prestation').get(function () {
    return this.tauxHoraire * this.nombreHeures;
});
exports.EnseignantSchema.set('toJSON', { virtuals: true });
exports.EnseignantSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=enseignant.schema.js.map