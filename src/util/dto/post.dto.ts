export class PostDto {
    public userId: string;
    public type: string;
    public content: string;
    public fileUrl: string[];

    constructor(userId: string, type: string, content: string, fileUrl: string[]) {
      this.userId = userId;
      this.type = type;
      this.content = content;
      this.fileUrl = fileUrl;
    }
  }
  