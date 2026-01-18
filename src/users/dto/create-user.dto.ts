import { UserRole } from "@prisma/client";

export class CreateUserDto {
    name: string;
    phone: string;
    password: string;
    role: UserRole;
    barbershopId: string;
}
