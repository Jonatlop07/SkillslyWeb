import { NgModule, Optional, SkipSelf } from '@angular/core'
import { AuthGuard } from './guards/auth.guard'
import { ThemeService } from './service/theme.service'
import { AuthService } from './service/auth.service'
import { JwtService } from './service/jwt.service'
import { NoAuthGuard } from './guards/no_auth.guard'

@NgModule({
  declarations: [],
  providers: [
    ThemeService,
    AuthService,
    JwtService,
    NoAuthGuard,
    AuthGuard
  ],
})
export default class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }
}
