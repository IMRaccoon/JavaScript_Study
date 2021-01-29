import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: 'TEST',
    secretAccessKey: 'TEST',
  },
});

const BUCKET_NAME = 'BUCKET_NAME';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    try {
      const objectName = `${Date.now()} ${file.originalName}`;
      await new AWS.S3()
        .putObject({
          Bucket: BUCKET_NAME,
          Body: file.buffer,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();

      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch {
      return null;
    }
  }
}
