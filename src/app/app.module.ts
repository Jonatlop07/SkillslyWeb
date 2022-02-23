import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PagesModule } from './pages/pages.module';
import { SocketIoModule } from 'ngx-socket-io';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { state_list } from './shared/state/state_list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr'
import { environment } from '../environments/environment.prod'
import CoreModule from './core/core.module'

@NgModule({
  declarations: [AppComponent, NopagefoundComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
