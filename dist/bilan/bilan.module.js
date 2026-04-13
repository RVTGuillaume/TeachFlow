"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BilanModule = void 0;
const common_1 = require("@nestjs/common");
const bilan_controller_1 = require("./bilan.controller");
const bilan_service_1 = require("./bilan.service");
const enseignants_module_1 = require("../enseignants/enseignants.module");
let BilanModule = class BilanModule {
};
exports.BilanModule = BilanModule;
exports.BilanModule = BilanModule = __decorate([
    (0, common_1.Module)({
        imports: [enseignants_module_1.EnseignantsModule],
        controllers: [bilan_controller_1.BilanController],
        providers: [bilan_service_1.BilanService],
    })
], BilanModule);
//# sourceMappingURL=bilan.module.js.map