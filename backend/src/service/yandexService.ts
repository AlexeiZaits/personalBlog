import { s3 } from "../config/yandexCloud";

class YandexService {
    async uploadFileToYandex(fileBuffer: Buffer, bucketName: string, fileName: string): Promise<string> {
        try {
          const params = {
            Bucket: bucketName, 
            Key: fileName,     
            Body: fileBuffer,
          };
          
          const data = await s3.upload(params).promise();
          console.log('Файл успешно загружен:', data.Location);
          return data.Location;
        } catch (err) {
          console.error('Ошибка загрузки файла:', err);
          throw err;
        }
    }
    async deleteFilesFromYandex(fileNames: string[]) {
        try {
            const params = {
                Bucket: 'personal-blog', // Имя вашего бакета
                Delete: {
                    Objects: fileNames.map(fileName => ({ Key: fileName })), // Массив объектов для удаления
                },
            };
            
            const data = await s3.deleteObjects(params).promise();
            console.log('Files deleted successfully:', data);
        } catch (err) {
            console.error('Error deleting files from Yandex:', err);
            throw err;
        }
    }
}

export const yandexService = new YandexService;