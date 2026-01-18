
import { Barbershop } from "src/barbershops/entities/barbershop.entity";
import { UserRole } from "src/common/enums/user-role.enum";

export class User {
    id: string;
    name: string;
    phone: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    
    barbershopId: string;
    barbershop: Barbershop;
}
