export class FileUploadDto {
    public userId: string;
    public file: string;
    public nameFile: string;
    public typeFile: string;
    constructor(userId: string, file: string, nameFile: string, typeFile: string) {
        this.userId = userId;
        this.file = file;
        this.nameFile = nameFile;
        this.typeFile = typeFile;
    }
}
  