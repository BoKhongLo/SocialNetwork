export class PaymentDto {
    public userId: string;
    public method: string;
    public select: string;

    constructor(userId: string, method: string, select: string) {
        this.userId = userId;
        this.method = method;
        this.select = select;

    }
}
