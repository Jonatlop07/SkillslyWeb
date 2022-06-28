import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../core/service/jwt.service';
import { FileUploadResponse } from '../types/file_upload.response';

@Injectable()
export class FileUploadService {
  private readonly API_URL: string = environment.API_URL;
  public isChargingComments = false;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  uploadImage(file_to_upload: File) {
    console.log(file_to_upload);
    const form_data = new FormData();
    form_data.append('media', file_to_upload, file_to_upload.name);
    return this.http.post<FileUploadResponse>(
      `https://api.skillsly.app/api/v1/media/image/`,
      form_data,
      this.jwt_service.getHttpOptions()
    );
  }

  uploadVideo(file_to_upload: File) {
    console.log(file_to_upload);
    const form_data = new FormData();
    form_data.append('media', file_to_upload, file_to_upload.name);
    return this.http.post<FileUploadResponse>(
      `https://api.skillsly.app/api/v1/media/video/`,
      form_data,
      this.jwt_service.getHttpOptions()
    );
  }
}
