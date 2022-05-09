import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FeedView } from './views/feed.view'

export const feed_routing_paths = {
  feed: 'feed'
};

const routes: Routes = [
  {
    path: '',
    component: FeedView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedRoutingModule {}
