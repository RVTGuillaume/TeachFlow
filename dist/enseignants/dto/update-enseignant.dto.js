"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEnseignantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_enseignant_dto_1 = require("./create-enseignant.dto");
class UpdateEnseignantDto extends (0, mapped_types_1.PartialType)(create_enseignant_dto_1.CreateEnseignantDto) {
}
exports.UpdateEnseignantDto = UpdateEnseignantDto;
//# sourceMappingURL=update-enseignant.dto.js.map