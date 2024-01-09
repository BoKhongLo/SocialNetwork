export class FileUploadDto {
    public userId: string;
    public file: string;
    constructor(userId: string, file: string) {
        this.userId = userId;
        this.file = file;
    }
}
  