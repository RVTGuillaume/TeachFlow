import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            nom: string;
            email: string;
            role: string;
        };
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        message: string;
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            nom: string;
            email: string;
            role: string;
        };
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
