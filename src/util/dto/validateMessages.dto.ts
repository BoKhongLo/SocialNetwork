export class ValidateMessagesDto {
    public userId: string;
    public roomchatId: string;
    public messagesId: string;
    public content?: string | null;
    public fileUrl?: string[] | [];
    constructor(userId: string, roomchatId: string, messagesId: string, content?: string | null, fileUrl?: string[] | []) {
        this.userId = userId;
        this.roomchatId = roomchatId;
        this.messagesId = messagesId;
        this.content = content;
        this.fileUrl = fileUrl;
    }
}
  