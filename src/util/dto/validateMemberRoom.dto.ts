export class ValidateMemberRoomDto {
    public userId: string;
    public roomId: string;
    public nickname: string;
    public fileUrl?: string[] | [];
    constructor(userId: string, roomId: string, nickname: string, fileUrl?: string[] | []) {
        this.userId = userId;
        this.roomId = roomId;
        this.nickname = nickname;
        this.fileUrl = fileUrl;
    }
}