export class ValidatePrivacyUserDto {
    public userId: string;
    public name: string;
    public nickName: string;
    public description: string;
    public gender: string;
    public phoneNumber: string;
    public countryCode: string;
    constructor(userId: string, name: string, nickName: string, description: string, 
        gender: string, phoneNumber: string, countryCode: string) {
        this.userId = userId;
        this.name = name;
        this.nickName = nickName;
        this.description = description;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.countryCode = countryCode;
    }
}
  