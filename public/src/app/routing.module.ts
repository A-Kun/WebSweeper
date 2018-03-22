import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { GameComponent } from './game.component';
import { MinesweeperComponent } from './minesweeper.component';
import { ChatComponent } from './chat.component';
import { ShooterGameComponent } from './shooter.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'game/:id/minesweeper',
    pathMatch: 'full',
    component: GameComponent,
  },
  {
    path: 'game/:id/shooter',
    pathMatch: 'full',
    component: ShooterGameComponent,
  },
  {
    path: 'chat',
    pathMatch: 'full',
    component: ChatComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class RoutingModule { }
