import { Document } from 'mongoose';
export type EnseignantDocument = Enseignant & Document;
export declare class Enseignant {
    matricule: string;
    nom: string;
    tauxHoraire: number;
    nombreHeures: number;
}
export declare const EnseignantSchema: import("mongoose").Schema<Enseignant, import("mongoose").Model<Enseignant, any, any, any, any, any, Enseignant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Enseignant, Document<unknown, {}, Enseignant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Enseignant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    matricule?: import("mongoose").SchemaDefinitionProperty<string, Enseignant, Document<unknown, {}, Enseignant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Enseignant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nom?: import("mongoose").SchemaDefinitionProperty<string, Enseignant, Document<unknown, {}, Enseignant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Enseignant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tauxHoraire?: import("mongoose").SchemaDefinitionProperty<number, Enseignant, Document<unknown, {}, Enseignant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Enseignant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nombreHeures?: import("mongoose").SchemaDefinitionProperty<number, Enseignant, Document<unknown, {}, Enseignant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Enseignant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Enseignant>;
