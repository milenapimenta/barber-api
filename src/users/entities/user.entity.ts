import { UserRole } from "@prisma/client";
import { Barbershop } from "src/barbershops/entities/barbershop.entity";

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
