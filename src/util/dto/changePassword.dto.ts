export class ChangePasswordDto {
    public userId: string;
    public currentPassword: string;
    public newPassword: string;
    public validatePassword: string;
    constructor(userId: string, currentPassword: string, newPassword: string, validatePassword: string) {
        this.userId = userId;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.validatePassword = validatePassword;
    }
}
  