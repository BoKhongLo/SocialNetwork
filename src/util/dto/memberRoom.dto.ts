export class MemberRoomDto {
    public userId: string;
    public roomId: string;
    public member: string[];
    constructor(userId: string, roomId: string, member: string[]) {
        this.userId = userId;
        this.roomId = roomId;
        this.member = member;
    }
}