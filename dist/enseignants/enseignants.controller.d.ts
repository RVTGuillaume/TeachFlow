import { EnseignantsService } from './enseignants.service';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';
export declare class EnseignantsController {
    private readonly enseignantsService;
    constructor(enseignantsService: EnseignantsService);
    create(dto: CreateEnseignantDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/enseignant.schema").EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/enseignant.schema").Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/enseignant.schema").EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/enseignant.schema").Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/enseignant.schema").EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/enseignant.schema").Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateEnseignantDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/enseignant.schema").EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/enseignant.schema").Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
