import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LaluService {
  constructor(private readonly http: HttpClient) {}

  public getSongsById(id: string) {
    return this.http.get(`https://soap.skillsly.app/soap/song/${id}`);
  }
}
