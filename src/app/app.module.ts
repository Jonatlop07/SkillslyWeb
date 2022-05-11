import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { NgxsModule } from '@ngxs/store'
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SocketIoModule } from 'ngx-socket-io'
import CoreModule from './core/core.module'
import { environment } from '../environments/environment'
import { state_list } from './shared/state/state_list'
import { HttpClientModule } from '@angular/common/http'
import { NopagefoundComponent } from './core/components/no-page-found/nopagefound.component'
import { SharedModule } from './shared/shared.module'
import { NavbarComponent } from './core/components/navbar/navbar.component'
import { MainPage } from './core/components/page/main.page'
import { AuthPage } from './core/components/auth-page/auth.page';
import { GraphQLModule } from './graphql.module'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthPage,
    MainPage,
    NopagefoundComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    SocketIoModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([...state_list], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot(),
    CoreModule,
    SharedModule,
    AppRoutingModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
