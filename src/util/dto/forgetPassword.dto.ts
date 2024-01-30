export class ForgetPasswordDto {
    public email: string;
    public otpId: string;
    public newPassword: string;
    public validatePassword: string;
    constructor(email: string, otpId: string, newPassword: string, validatePassword: string) {
        this.email = email;
        this.otpId = otpId;
        this.newPassword = newPassword;
        this.validatePassword = validatePassword;
    }
}
  