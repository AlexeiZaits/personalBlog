import AWS from 'aws-sdk';
import fs from 'fs';

export const s3 = new AWS.S3({
  endpoint: 'https://storage.yandexcloud.net', 
  accessKeyId: process.env.accessKeyId,             
  secretAccessKey: process.env.secretAccessKey,       
  region: 'ru-central1',                    
  s3ForcePathStyle: true,                  
});