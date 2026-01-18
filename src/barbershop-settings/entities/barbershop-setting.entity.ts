import { Barbershop } from "src/barbershops/entities/barbershop.entity";


export class BarbershopSettings {
  id: string;
  barbershopId: string;

  servicesShared: boolean;
  pricesShared: boolean;
  employeeCanSeeClientWhatsapp: boolean;
  timezone: string;

  barbershop: Barbershop;
}
