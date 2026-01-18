import { UserRole } from "src/common/enums/user-role.enum";

export class CreateUserDto {
    name: string;
    phone: string;
    password: string;
    role: UserRole;
    barbershopId: string;
}
