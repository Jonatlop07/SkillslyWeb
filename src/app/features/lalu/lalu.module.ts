import {NgModule} from "@angular/core";
import {LaluService} from "./services/lalu.service";
import { LaluView } from './views/lalu.view'
import {LaluRoutingModule} from "./lalu.routing";

@NgModule({
  declarations: [
    LaluView,
  ],
  imports: [
    LaluRoutingModule,
  ],
  providers: [
    LaluService,
  ],
  exports: [LaluView],
})
export class LaluModule {}
