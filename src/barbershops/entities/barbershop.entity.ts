import { BarbershopSettings } from "src/barbershop-settings/entities/barbershop-setting.entity";
import { User } from "src/users/entities/user.entity";

export class Barbershop {
    id: string;
    name: string;
    createdAt: Date;

    settings?: BarbershopSettings;
    users: User[];
    // barbers: Barber[];
    // services: Service[];
    // clients: Client[];
    // templates: MessageTemplate[];
    // reminders: Reminder[];
    // appointments: Appointment[];
}
