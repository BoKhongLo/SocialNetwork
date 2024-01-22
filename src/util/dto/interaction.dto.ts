export class InteractDto {
    public userId: string;
    public postId: string;
    public commentId?: string | null;
    public content?: string | null;
    public interactId?: string | null;
    constructor(userId: string, postId: string, commentId?: string | null, content?: string | null, interactId?: string | null) {
        this.userId = userId;
        this.postId = postId;
        this.commentId = commentId;
        this.content = content;
        this.interactId = interactId;
    }
}
  