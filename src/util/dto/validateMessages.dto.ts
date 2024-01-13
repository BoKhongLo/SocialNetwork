export class ValidateMessagesDto {
    public userId: string;
    public roomchatId: string;
    public messagesId: string;

    constructor(userId: string, roomchatId: string, messagesId: string, ) {
        this.userId = userId;
        this.roomchatId = roomchatId;
        this.messagesId = messagesId;
    }
}
  