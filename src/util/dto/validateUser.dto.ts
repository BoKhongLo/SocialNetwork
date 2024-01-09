export class ValidateUserDto {
    public userId: string;
    public name: string;
    public nickName: string;
    public description: string;
    public avatarUrl: string | null;
    public birthday: Date;
    constructor(userId: string, name: string, nickName: string, description: string, avatarUrl: string | null, birthday: Date) {
        this.userId = userId;
        this.name = name;
        this.nickName = nickName;
        this.description = description;
        this.avatarUrl = avatarUrl;
        this.birthday = birthday;
    }
}
  