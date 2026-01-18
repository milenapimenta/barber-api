import { Barbershop } from "src/barbershops/entities/barbershop.entity";

export class Barber {
    id: string;
    name: string;
    phone?: string;
    active: boolean;
    createdAt: Date;

    barbershopId: string;
    barbershop: Barbershop;

    // appointments: Appointment[];
    // ownedServices: Service[];
}
