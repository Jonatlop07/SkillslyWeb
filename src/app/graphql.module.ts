import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context'
import { JwtService } from './core/service/jwt.service'
import { environment } from '../environments/environment'

const uri = environment.API_URL; // <-- add the URL of the GraphQL server here

export function createApollo(http_link: HttpLink, jwt_service: JwtService): ApolloClientOptions<any> {
  const basic = setContext(() => ({
    headers: {
      'Content-Type': 'application/json',
    }
  }));
  const auth = setContext(() => {
    const token = jwt_service.getToken();
    if (token === null) {
      return {};
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  })
  const link = ApolloLink.from([
    basic,
    auth,
    http_link.create({ uri })
  ])
  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, JwtService],
    },
  ],
})
export class GraphQLModule {
}
