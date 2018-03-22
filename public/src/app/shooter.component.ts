import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shooter-game',
  templateUrl: './shooter.component.html',
  styleUrls: ['./shooter.component.css']
})
export class ShooterGameComponent {
  height = 500;
  width = 500;
  spectating = true;
}