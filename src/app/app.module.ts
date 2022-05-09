import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { NgxsModule } from '@ngxs/store'
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SocketIoModule } from 'ngx-socket-io'
import { NopagefoundComponent } from './pages/no-page-found/nopagefound.component'
import CoreModule from './core/core.module'
import { PagesModule } from './pages/pages.module'
import { AuthModule } from './features/authentication/auth.module'
import { environment } from '../environments/environment'
import { state_list } from './shared/state/state_list'

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    PagesModule,
    AuthModule,
    SocketIoModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([...state_list], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
