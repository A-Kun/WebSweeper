import { Component, OnInit, ElementRef, Input, ViewChild  } from '@angular/core';


@Component({
  selector: 'shooter',
  templateUrl: './shooter.component.html',
  styleUrls: ['./shooter.component.css']
})
export class ShooterComponent {
  @ViewChild('shooter') shooterRef;
  /* The canvas element */
  canvas;
  ctx;

  /* The height of the game */
  @Input() height: number;

  /* The height of the game */
  @Input() width: number;

  /* Keys for keypress */
  KEYS = {
      UP: 119,
      RIGHT: 100,
      DOWN: 115,
      LEFT: 97,
    };

  /* Keys for key_down */
  KEY_DOWN = {
      UP: 87,
      RIGHT: 68,
      DOWN: 83,
      LEFT: 65,
    };

  config = {
    speed: {
      player: 5,
      enemy: 10,
      shots: 4
    },
    respawn: 5,
    invincible: 1000,
    hpLoss: 10,
    maxEnemy: 16,
    enemyHP: 1,
    playerHP: 100000
  };


  /* The player character */
  player: Player;

  /* The enemy objects */
  enemies: Array<Enemy>;

  /* The enemy objects */
  shots: Array<Projectile>;

  /* icon source used */
  @Input() playerIconSrc: String;
  @Input() projectileIconSrc: String;
  @Input() enemyIconSrc: String;
  playerIcon;
  enemyIcon;
  projectileIcon;


  /* Position of the canvas */
  x: number;
  y: number;

  lastNewAI: number;

  pause: Boolean = false;

  @Input() isSpectating: Boolean;
  constructor(private _el: ElementRef) {
    this.playerIcon = new Image();
    this.enemyIcon = new Image();
    this.projectileIcon = new Image();
  }


  movePlayer() {
    let newX = this.player.x + this.player.x_change * this.config.speed.player,
      newY = this.player.y + this.player.y_change * this.config.speed.player;
    if (newX >= 0 && newX + this.playerIcon.width  < this.width) {
      this.player.x = newX;
    }
    if (newY >= 0 && newY + this.playerIcon.width < this.height) {
      this.player.y = newY;
    }
  }

  fireShots() {
    var i, scale;
    if (this.player.shoot) {
      scale = Math.max(
          Math.abs(this.player.x - this.player.shoot.x),
          Math.abs(this.player.y - this.player.shoot.y)) / this.config.speed.shots;
      this.shots.push({
        x: this.player.x,
        y: this.player.y,
        x_change: (this.x + this.player.shoot.x - this.player.x) / scale,
        y_change: (this.y + this.player.y - this.player.shoot.y) / scale
      });
      this.player.shoot = false;
    }
    for(i=this.shots.length - 1;i>=0;i--) {
      this.shots[i].x += this.shots[i].x_change;
      this.shots[i].y -= this.shots[i].y_change;
      if (this.shots[i].x < 0 ||
        this.shots[i].y < 0 ||
        this.shots[i].x + this.projectileIcon.height > this.height ||
        this.shots[i].y + this.projectileIcon.width > this.width) {
        this.shots.splice(i, 1);
      }
    }
  }
  handleAI() {
    let currTime = +new Date();
    for (let i = 0; i< this.enemies.length; i++) {
      //chase
      if (this.enemies[i].type == 0) {
        let scale = Math.max(
            Math.abs(this.player.x - this.enemies[i].x),
            Math.abs(this.player.y - this.enemies[i].y)) / this.config.speed.enemy;
        this.enemies[i].x += (this.player.x - this.enemies[i].x) / Math.max(scale, 0.01);
        this.enemies[i].y -= (this.enemies[i].y - this.player.y) / Math.max(scale, 0.01);
      }
    }
    if (this.lastNewAI + this.config.respawn < currTime &&
      this.enemies.length < this.config.maxEnemy) {
      let safe = 5;
      // new enemy
      let x = Math.floor((Math.random() * this.width));
      let y = Math.floor((Math.random() * this.height));

      while ((this.player.x + this.playerIcon.width + safe) > x &&
        (this.x + this.enemyIcon.width + safe) > this.player.x &&
        (this.player.y + this.playerIcon.height + safe) > y &&
        (this.y + this.enemyIcon.height + safe) > this.player.y
        ) {
        x = Math.floor((Math.random() * this.width));
        y = Math.floor((Math.random() * this.height));
      }
      this.enemies.push({
        x: x,
        y: y,
        type: 0,
        HP: this.config.enemyHP
      });
      this.lastNewAI = currTime;
    }
  }

  conflict(x, y, img, x_other, y_other, img_other) {
    return ((x + img.width > x_other) &&
      (x_other + img_other.width > x) &&
      (y + img.width > y_other) &&
      (y_other + img_other.width > y))
  }

  handleHits() {
    let currTime = + new Date();
    for (let i=this.enemies.length-1;i>=0;i--) {
      if (this.player.invincible + this.config.invincible < currTime &&
        this.conflict(this.player.x, this.player.y, this.playerIcon,
          this.enemies[i].x, this.enemies[i].y, this.enemyIcon)) {
        this.player.invincible = currTime;
        this.player.HP -= this.config.hpLoss;
        this.enemies.splice(i, 1);
      } else {
        for (let j=this.shots.length-1;j>=0;j--) {
          if (this.conflict(this.shots[j].x, this.shots[j].y, this.projectileIcon,
            this.enemies[i].x, this.enemies[i].y, this.enemyIcon)) {
            this.enemies[i].HP -= 1;
            this.shots.splice(j, 1);
            if (this.enemies[i].HP <= 0) {
              this.enemies.splice(i, 1);
              break;
            }
          }
        }
      }
    }
    return false;
  }
  draw() {
    this.movePlayer();
    this.fireShots();
    this.handleAI();
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i=0;i<this.enemies.length;i++) {
      this.ctx.drawImage(this.enemyIcon, this.enemies[i].x, this.enemies[i].y);
    }
    for (let i=0;i<this.shots.length;i++) {
      this.ctx.drawImage(this.projectileIcon, this.shots[i].x, this.shots[i].y);
    }
    this.ctx.drawImage(this.playerIcon, this.player.x, this.player.y);
    this.handleHits();
    if (this.player.HP<=0) {
      return;
    }
    if (this.pause) {
      return;
    }
    requestAnimationFrame(() => this.draw());
  }
  pauseGame() {
    this.pause = true;
  }

  start() {
    var shooter = this;
    document.addEventListener('keypress', function(e) {
      var code = e.keyCode || e.which;
      if (code == shooter.KEYS.UP && shooter.player.y_change >= 0) {
        shooter.player.y_change = -1;
      } else if (code == shooter.KEYS.RIGHT && shooter.player.x_change <= 0) {
        shooter.player.x_change = 1;
      } else if (code == shooter.KEYS.DOWN && shooter.player.y_change <= 0) {
        shooter.player.y_change = 1;
      } else if (code == shooter.KEYS.LEFT && shooter.player.x_change >= 0) {
        shooter.player.x_change = -1;
      }
    });

    document.addEventListener('keyup', function(e) {
      var code = e.keyCode || e.which;
      if (code == shooter.KEY_DOWN.UP && shooter.player.y_change < 0) {
        shooter.player.y_change = 0;
      } else if (code == shooter.KEY_DOWN.RIGHT && shooter.player.x_change > 0) {
        shooter.player.x_change = 0;
      } else if (code == shooter.KEY_DOWN.DOWN && shooter.player.y_change > 0) {
        shooter.player.y_change = 0;
      } else if (code == shooter.KEY_DOWN.LEFT && shooter.player.x_change < 0) {
        shooter.player.x_change = 0;
      }
    });
    document.addEventListener('mousedown', function(e) {
      shooter.player.shoot = {
        x: e.pageX,
        y: e.pageY
      };
    });
  }

  ngOnInit() {
    var loadedImages = 0;
    this.playerIcon.src = this.playerIconSrc;
    this.projectileIcon.src = this.projectileIconSrc;
    this.enemyIcon.src = this.enemyIconSrc;
    this.canvas = this.shooterRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    let position = this.canvas.getBoundingClientRect();
    this.enemies = [];
    this.player = {
      x: 200,
      y: 300,
      x_change: 0,
      y_change: 0,
      shoot: false,
      HP: this.config.playerHP,
      invincible: +new Date()
    };
    this.shots = [];
    this.x = position.x;
    this.y = position.y;
    this.lastNewAI = +new Date();
    var cb = () => {
      loadedImages += 1;
      if (loadedImages === 3) {
        this.start();
        requestAnimationFrame(() => this.draw());
      }
    }
    this.playerIcon.onload = cb;
    this.projectileIcon.onload = cb;
    this.enemyIcon.onload = cb;
  }
}

export interface Player {
  x?: number;
  y?: number;
  x_change: number;
  y_change: number;
  invincible: number;
  HP?: number;
  shoot: {
    x?: number,
    y?: number
  };
}

export interface Enemy {
  x?: number;
  y?: number;
  type?: number;
  HP?: number;
}

export interface Projectile {
  x?: number;
  y?: number;
  x_change: number;
  y_change: number;
}