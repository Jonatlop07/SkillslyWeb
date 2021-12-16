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
import { environment } from '../environments/environment'
import { state_list } from './shared/state/state_list'
import { NgxsStoragePluginModule }  from '@ngxs/storage-plugin'; 

@NgModule({
  declarations: [AppComponent, NopagefoundComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    SocketIoModule,
    NgxsModule.forRoot([...state_list], {
      developmentMode: !environment.production
    }), 
    NgxsStoragePluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
