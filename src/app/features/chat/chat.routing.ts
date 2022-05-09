import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import ChatView from './views/chat.view'

export const chat_routing_paths = {
  chat: 'chat'
};

const routes: Routes = [
  {
    path: '',
    component: ChatView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ChatRoutingModule {}
