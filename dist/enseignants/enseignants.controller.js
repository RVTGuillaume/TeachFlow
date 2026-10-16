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
exports.EnseignantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enseignants_service_1 = require("./enseignants.service");
const create_enseignant_dto_1 = require("./dto/create-enseignant.dto");
const update_enseignant_dto_1 = require("./dto/update-enseignant.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EnseignantsController = class EnseignantsController {
    enseignantsService;
    constructor(enseignantsService) {
        this.enseignantsService = enseignantsService;
    }
    create(dto) {
        return this.enseignantsService.create(dto);
    }
    findAll() {
        return this.enseignantsService.findAll();
    }
    findOne(id) {
        return this.enseignantsService.findOne(id);
    }
    update(id, dto) {
        return this.enseignantsService.update(id, dto);
    }
    remove(id) {
        return this.enseignantsService.remove(id);
    }
};
exports.EnseignantsController = EnseignantsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un enseignant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enseignant_dto_1.CreateEnseignantDto]),
    __metadata("design:returntype", void 0)
], EnseignantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les enseignants' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnseignantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Voir un enseignant' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnseignantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un enseignant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_enseignant_dto_1.UpdateEnseignantDto]),
    __metadata("design:returntype", void 0)
], EnseignantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un enseignant' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnseignantsController.prototype, "remove", null);
exports.EnseignantsController = EnseignantsController = __decorate([
    (0, swagger_1.ApiTags)('Enseignants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('enseignants'),
    __metadata("design:paramtypes", [enseignants_service_1.EnseignantsService])
], EnseignantsController);
//# sourceMappingURL=enseignants.controller.js.map