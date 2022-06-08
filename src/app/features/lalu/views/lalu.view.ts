import {Component} from "@angular/core";
import {LaluService} from "../services/lalu.service";


@Component({
  selector: 'skl-lalu',
  templateUrl: './lalu.view.html',
  styleUrls: ['./lalu.view.css'],
})
export class LaluView {

  constructor(
    private laluService: LaluService,
  ) {}

  public songs: Array<string>;
  searchSongsById(searchInput: string){
    searchInput = searchInput.trim();
    this.songs = this.laluService.getSongsById(searchInput).result;
  }
}
