import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async upload(filename: string, fileBuffer: Buffer): Promise<string> {
    try {
      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: `${randomUUID()}.${filename.split('.').pop()}`,
        Body: fileBuffer,
        ACL: 'public-read',
      });
      await this.client.send(putCommand);
      return `https://${putCommand.input.Bucket}.s3.amazonaws.com/${putCommand.input.Key}`;
    } catch (err) {
      throw new BadRequestException('Error upload file');
    }
  }

  async remove(key: string) {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: key,
      });
      await this.client.send(deleteCommand);
    } catch (error) {
      throw new BadRequestException('Error remove file');
    }
  }
}
