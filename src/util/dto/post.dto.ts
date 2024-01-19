export class PostDto {
    public userId: string;
    public type?: string | null;
    public content?: string | null;
    public fileUrl?: string[] | [];
    public postId?: string | null;

    constructor(userId: string, type?: string | null, content?: string | null, fileUrl?: string[] | [], postId?: string | null) {
      this.userId = userId;
      this.type = type;
      this.content = content;
      this.fileUrl = fileUrl;
      this.postId = postId;
    }
  }
  