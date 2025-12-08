// image.storage.service.ts
import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { minioClient } from '../../common/minio/minio.config';
import * as process from 'node:process';

@Injectable()
export class ImageStorageService {
  private readonly minio: Client = minioClient;
  private readonly bucket = process.env.MINIO_BUCKET_NAME || 'solidarios';

  async init() {
    await this.ensureBucket();
  }

  private async ensureBucket() {
    const exists = await this.minio.bucketExists(this.bucket);
    if (!exists) {
      await this.minio.makeBucket(this.bucket);
    }
  }

  async upload(
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<string> {
    await this.minio.putObject(this.bucket, filename, file, file.length, {
      'Content-Type': mimeType,
    });
    return this.getUrl(filename);
  }

  async delete(filename: string): Promise<void> {
    await this.minio.removeObject(this.bucket, filename);
  }

  getUrl(filename: string): string {
    return `http://${process.env.API_BASE_URL}:9000/${this.bucket}/${filename}`;
  }
}
