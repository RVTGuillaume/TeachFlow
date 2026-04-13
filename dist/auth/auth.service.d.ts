import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private configService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, configService: ConfigService);
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
    login(dto: LoginDto): Promise<{
        message: string;
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            nom: string;
            email: string;
            role: string;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    private generateToken;
}
