export class ValidateRoomchatDto {
    public userId: string;
    public roomId: string;
    public title: string; 
    public description?: string | null;
    public imgDisplay?: string | null;
    constructor(userId: string, roomId: string, title: string, description?: string | null, imgDisplay?: string | null) {
        this.userId = userId;
        this.roomId = roomId;
        this.title = title;
        this.description = description 
        this.imgDisplay = imgDisplay
    }
}