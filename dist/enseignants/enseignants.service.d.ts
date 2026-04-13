import { Model } from 'mongoose';
import { Enseignant, EnseignantDocument } from './schemas/enseignant.schema';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';
export declare class EnseignantsService {
    private enseignantModel;
    constructor(enseignantModel: Model<EnseignantDocument>);
    create(dto: CreateEnseignantDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        data: import("mongoose").Document<unknown, {}, EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateEnseignantDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, EnseignantDocument, {}, import("mongoose").DefaultSchemaOptions> & Enseignant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
