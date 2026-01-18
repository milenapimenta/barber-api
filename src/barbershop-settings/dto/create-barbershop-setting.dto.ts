export class CreateBarbershopSettingDto {
    barbershopId: string;

    servicesShared?: boolean;
    pricesShared?: boolean;
    employeeCanSeeClientWhatsapp?: boolean;
    timezone?: string;
}
