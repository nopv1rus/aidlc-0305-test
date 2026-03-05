import { AuthService } from './auth.service';
import { AdminLoginDto, AdminRegisterDto, TableLoginDto } from './dto/admin-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerAdmin(dto: AdminRegisterDto): Promise<{
        message: string;
    }>;
    adminLogin(dto: AdminLoginDto): Promise<{
        accessToken: string;
    }>;
    tableLogin(dto: TableLoginDto): Promise<{
        accessToken: string;
    }>;
}
