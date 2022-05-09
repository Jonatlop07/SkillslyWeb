import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FollowRequestsView } from './views/follow-requests/follow_requests.view'
import { SearchView } from './views/search/search.view'

export const routing_paths = {
  social: 'social',
  search: 'search/:searchInput',
  follow_requests: 'follow-requests'
};

const routes: Routes = [
  {
    path: routing_paths.search,
    component: SearchView
  },
  {
    path: routing_paths.follow_requests,
    component: FollowRequestsView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class SocialRoutingModule {}
