import { BilanService } from './bilan.service';
export declare class BilanController {
    private readonly bilanService;
    constructor(bilanService: BilanService);
    getBilan(): Promise<{
        message: string;
        data: {
            total: number;
            prestationTotale: number;
            prestationMinimale: null;
            prestationMaximale: null;
            enseignants: never[];
            enseignantMin?: undefined;
            enseignantMax?: undefined;
        };
    } | {
        message: string;
        data: {
            total: number;
            prestationTotale: number;
            prestationMinimale: number;
            prestationMaximale: number;
            enseignantMin: {
                _id: import("mongoose").Types.ObjectId;
                matricule: string;
                nom: string;
                tauxHoraire: number;
                nombreHeures: number;
                prestation: number;
            } | undefined;
            enseignantMax: {
                _id: import("mongoose").Types.ObjectId;
                matricule: string;
                nom: string;
                tauxHoraire: number;
                nombreHeures: number;
                prestation: number;
            } | undefined;
            enseignants: {
                _id: import("mongoose").Types.ObjectId;
                matricule: string;
                nom: string;
                tauxHoraire: number;
                nombreHeures: number;
                prestation: number;
            }[];
        };
    }>;
}
