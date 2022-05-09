import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { NgxsModule } from '@ngxs/store'
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SocketIoModule } from 'ngx-socket-io'
import CoreModule from './core/core.module'
import { PagesModule } from './pages/pages.module'
import { environment } from '../environments/environment'
import { state_list } from './shared/state/state_list'
import { AuthModule } from './features/authentication/auth.module'
import { HttpClientModule } from '@angular/common/http'
import { NopagefoundComponent } from './no-page-found/nopagefound.component'

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SocketIoModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([...state_list], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot(),
    AuthModule,
    PagesModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
