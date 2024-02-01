export class SignUpDto {
    public email: string;
    public password: string;
    public name: string;
    public otpId: string;
    public birthday?: string | null;
    public gender?: string | null;
    public phoneNumber?: string | null;
    public countryCode?: string | null;
    constructor(email: string,
        password: string,
        name: string,
        otpId: string,
        birthday?: string | null,
        gender?: string | null,
        phoneNumber?: string | null,
        countryCode?: string | null,
    ) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.otpId = otpId;
        this.birthday = birthday
        this.gender = gender,
        this.phoneNumber = phoneNumber
        this.countryCode = countryCode
    }
}
