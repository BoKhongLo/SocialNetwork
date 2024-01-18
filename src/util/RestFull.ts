import axios from "axios";
import { FileUploadDto, NotiNativeDto } from "./dto";
import { Toast } from 'toastify-react-native';

export async function uploadFile (data: FileUploadDto, authToken: string,) {
    try {
        const formData = new FormData();
        formData.append('userId', data.userId);
        formData.append('file', {
            uri: data.file,
            name: `avt${data.userId}${data.nameFile}`,
            type: data.typeFile, 
          });

        const response = await axios.post('http://103.144.87.14:3434/media/upload', formData, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
        },
        });

        if (response.data == null) return null;
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function sendNotification(dto: NotiNativeDto) {
    try {

        const response = await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: dto.userId,
            appId: 18604,
            appToken: '8sbEFbNYoDaZJKMDeIAWoc',
            title: dto.title,
            message: dto.message,
       });

        if (response.data == null) return null;
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}