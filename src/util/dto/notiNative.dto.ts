export class NotiNativeDto {
    public userId: string[];
    public title: string;
    public message: string;
    public pushData: any;

    constructor(userId: string[], title: string, message: string, pushData: any) {
      this.userId = userId;
      this.title = title;
      this.message = message;
      this.pushData = pushData;
    }
  }
  