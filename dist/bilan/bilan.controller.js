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
exports.BilanController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bilan_service_1 = require("./bilan.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BilanController = class BilanController {
    bilanService;
    constructor(bilanService) {
        this.bilanService = bilanService;
    }
    getBilan() {
        return this.bilanService.getBilan();
    }
};
exports.BilanController = BilanController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le bilan des prestations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BilanController.prototype, "getBilan", null);
exports.BilanController = BilanController = __decorate([
    (0, swagger_1.ApiTags)('Bilan'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bilan'),
    __metadata("design:paramtypes", [bilan_service_1.BilanService])
], BilanController);
//# sourceMappingURL=bilan.controller.js.map