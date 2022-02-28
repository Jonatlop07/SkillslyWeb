import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import ChatView from './views/chat.view'

export const routing_paths = {
  chat: 'chat'
};

const routes: Routes = [
  {
    path: routing_paths.chat,
    component: ChatView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
