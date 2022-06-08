import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class LaluService {

  constructor(
    private readonly http: HttpClient,
  ) {}

  public getSongsById(id: string){
    console.log(id);

    return {
      result: ["Waka Waka ", " Las mañanitas"]
    };
    // return this.http.get(
    //     `/uriiiiii/song/${id}`,
    // );
  }

}
