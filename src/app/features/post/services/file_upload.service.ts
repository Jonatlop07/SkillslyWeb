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

  uploadImage(file_to_upload: File, form_data: FormData) {
    return this.http.post<FileUploadResponse>(
      `${this.API_URL}/api/v1/media/upload-image`,
      form_data
    );
  }
}
