export class BookmarksDto {
    public userId: string;
    public postId: string;
    constructor(userId: string, postId: string) {
        this.userId = userId;
        this.postId = postId;
    }
}
  