export class FileUploadDto {
    userId: string;
    file: string;
    constructor(userId: string, file: string) {
        this.userId = userId;
        this.file = file;
    }
}
  