import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'beam' | 'rock' | 'barrier';
}

@Component({
  selector: 'app-construction-runner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './construction-runner.component.html',
  styleUrl: './construction-runner.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ConstructionRunnerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;

  gameStarted = false;
  gameOver = false;
  score = 0;
  highScore = 0;

  private reqId: number | null = null;
  private gameSpeed = 5;
  private isBrowser: boolean;

  // Truck state
  private truck = {
    x: 60,
    y: 110,
    width: 50,
    height: 28,
    vy: 0,
    gravity: 0.65,
    jumpPower: -11.5,
    isJumping: false,
    groundY: 110
  };

  private obstacles: Obstacle[] = [];
  private frameCount = 0;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.highScore = parseInt(localStorage.getItem('amber_runner_hi') || '0', 10);
    
    // Forzar el renderizado del vehículo y mapa en estado inicial
    setTimeout(() => {
      this.resizeCanvas();
      this.render();
    }, 50);
  }

  private resizeCanvas(): void {
    if (!this.isBrowser || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 220;
    this.truck.groundY = canvas.height - 48;
    this.truck.y = this.truck.groundY;
  }

  startGame(): void {
    this.gameStarted = true;
    this.gameOver = false;
    this.score = 0;
    this.gameSpeed = 5;
    this.obstacles = [];
    this.truck.y = this.truck.groundY;
    this.truck.vy = 0;
    this.truck.isJumping = false;
    this.frameCount = 0;

    this.loop();
  }

  onCanvasClick(): void {
    this.jump();
  }

  private jump(): void {
    if (!this.gameStarted) {
      this.startGame();
      return;
    }

    if (!this.truck.isJumping) {
      this.truck.vy = this.truck.jumpPower;
      this.truck.isJumping = true;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      this.jump();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  handleTouch(event: TouchEvent): void {
    if (this.isBrowser) {
      this.jump();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    if (!this.gameStarted) {
      this.drawInitialState();
    }
  }

  private loop = (): void => {
    this.update();
    this.render();

    if (this.gameStarted && !this.gameOver) {
      this.reqId = requestAnimationFrame(this.loop);
    }
  };

  private update(): void {
    this.frameCount++;
    this.score = Math.floor(this.frameCount / 4);

    // Speed progression
    if (this.frameCount % 250 === 0 && this.gameSpeed < 12) {
      this.gameSpeed += 0.4;
    }

    // Gravity physics
    this.truck.vy += this.truck.gravity;
    this.truck.y += this.truck.vy;

    if (this.truck.y >= this.truck.groundY) {
      this.truck.y = this.truck.groundY;
      this.truck.vy = 0;
      this.truck.isJumping = false;
    }

    // Spawn industrial obstacles
    const minFrameInterval = Math.max(50, 100 - Math.floor(this.gameSpeed * 4));
    if (this.frameCount % minFrameInterval === 0) {
      const rand = Math.random();
      const type: 'beam' | 'rock' | 'barrier' = rand > 0.6 ? 'beam' : rand > 0.3 ? 'rock' : 'barrier';
      
      const width = type === 'beam' ? 34 : type === 'rock' ? 26 : 36;
      const height = type === 'beam' ? 30 : type === 'rock' ? 22 : 30;

      this.obstacles.push({
        x: this.canvasRef.nativeElement.width,
        width,
        height,
        type
      });
    }

    // Move obstacles & AABB collision
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.gameSpeed;

      const truckBox = {
        left: this.truck.x + 4,
        right: this.truck.x + this.truck.width - 4,
        top: this.truck.y + 4,
        bottom: this.truck.y + this.truck.height
      };

      const obsBox = {
        left: obs.x,
        right: obs.x + obs.width,
        top: this.truck.groundY + this.truck.height - obs.height,
        bottom: this.truck.groundY + this.truck.height
      };

      if (
        truckBox.left < obsBox.right &&
        truckBox.right > obsBox.left &&
        truckBox.top < obsBox.bottom &&
        truckBox.bottom > obsBox.top
      ) {
        this.triggerGameOver();
        break;
      }

      if (obs.x + obs.width < 0) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  private render(): void {
    if (!this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Map Background: Miami Vice / Magic City Sunset Skyline & Palms
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#0B0F19');
    skyGradient.addColorStop(0.5, '#1E1B4B');
    skyGradient.addColorStop(1, '#31103F');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bgOffset = (this.frameCount * (this.gameSpeed * 0.2)) % 500;

    // Miami Coastal Skyline (High-rises & Art Deco Towers)
    ctx.fillStyle = '#1E1B4B';
    for (let x = -bgOffset; x < canvas.width + 500; x += 110) {
      // Modern Glass Tower
      ctx.fillRect(x, canvas.height - 140, 50, 95);
      // Tower Neon Trim
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(x + 23, canvas.height - 140, 4, 95);
      ctx.fillStyle = '#1E1B4B';

      // Art Deco Building with step top
      ctx.fillRect(x + 60, canvas.height - 110, 40, 65);
      ctx.fillRect(x + 68, canvas.height - 125, 24, 15);
      
      // Palm Tree Silhouette
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 105, canvas.height - 45);
      ctx.quadraticCurveTo(x + 110, canvas.height - 85, x + 118, canvas.height - 105);
      ctx.stroke();

      // Palm Fronds
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(x + 118, canvas.height - 105, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Road & Ground Layer
    const groundLevel = this.truck.groundY + this.truck.height;
    
    // Asphalt Road Base
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, groundLevel - 4, canvas.width, canvas.height - groundLevel + 4);

    // Gold Road Top Border
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, groundLevel - 4, canvas.width, 4);

    // Moving Dashed Center Line (Asphalt Effect)
    const roadDashOffset = (this.frameCount * this.gameSpeed) % 40;
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 2;
    ctx.setLineDash([18, 22]);
    ctx.beginPath();
    ctx.moveTo(-roadDashOffset, groundLevel + 16);
    ctx.lineTo(canvas.width + 40, groundLevel + 16);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Realistic White Ambergate Isuzu Dump Truck
    const tx = this.truck.x;
    const ty = this.truck.y;
    const tw = this.truck.width;
    const th = this.truck.height;

    // Heavy Duty Aluminum Dump Bed (White & Silver)
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(tx, ty, 36, th - 6, [3, 1, 1, 3]);
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dump Bed Reinforcement Ribs
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(tx + 8, ty + 2, 4, th - 10);
    ctx.fillRect(tx + 18, ty + 2, 4, th - 10);
    ctx.fillRect(tx + 28, ty + 2, 4, th - 10);

    // Ambergate Gold Stripe
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(tx + 2, ty + th - 10, 32, 3);

    // Isuzu White Cab
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(tx + 36, ty + 2, 24, th - 8, [4, 6, 2, 2]);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Windshield & Side Window (Tinted Glass)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(tx + 44, ty + 5, 14, 11, [2, 4, 1, 1]);
    ctx.fill();

    // Cyan Windshield Glass Reflection
    ctx.fillStyle = '#38BDF8';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(tx + 50, ty + 6);
    ctx.lineTo(tx + 56, ty + 6);
    ctx.lineTo(tx + 48, ty + 14);
    ctx.lineTo(tx + 46, ty + 14);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Front Chrome Bumper & Grille
    ctx.fillStyle = '#64748B';
    ctx.fillRect(tx + 54, ty + 18, 6, 6);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(tx + 52, ty + th - 8, 10, 4);

    // Amber Headlight / Indicator
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(tx + 58, ty + 16, 3, 3);

    // Rotating Wheels with Chrome Hubcaps
    const wheelY = ty + th - 2;
    const wheelPositions = [tx + 12, tx + 26, tx + 50];
    const wheelRotation = (this.frameCount * 0.25) % (Math.PI * 2);

    wheelPositions.forEach((wx) => {
      // Rubber Tire
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(wx, wheelY, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Chrome Rim
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(wx, wheelY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Lug Nut Detail
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wx, wheelY);
      ctx.lineTo(wx + Math.cos(wheelRotation) * 3, wheelY + Math.sin(wheelRotation) * 3);
      ctx.stroke();
    });

    // Draw Crisp High-Definition Industrial Obstacles
    for (const obs of this.obstacles) {
      const oy = groundLevel - obs.height;

      if (obs.type === 'beam') {
        // Structural Steel H-Beam (Angled Construction Beam)
        ctx.fillStyle = '#DC2626'; // High-vis Safety Red Beam
        ctx.fillRect(obs.x, oy + 4, obs.width, 10);
        ctx.fillRect(obs.x + 4, oy, 8, obs.height);
        ctx.fillRect(obs.x + obs.width - 12, oy, 8, obs.height);

        // Gold Industrial Highlight
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(obs.x + 2, oy + 6, obs.width - 4, 3);
        
        // Steel Bolt Detail
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(obs.x + 6, oy + 2, 2, 2);
        ctx.fillRect(obs.x + obs.width - 10, oy + 2, 2, 2);

      } else if (obs.type === 'rock') {
        // Concrete Debris & Cut Rock Stack
        ctx.fillStyle = '#64748B'; // Concrete Grey
        ctx.beginPath();
        ctx.moveTo(obs.x, oy + obs.height);
        ctx.lineTo(obs.x + 4, oy + 6);
        ctx.lineTo(obs.x + 14, oy);
        ctx.lineTo(obs.x + obs.width - 2, oy + 8);
        ctx.lineTo(obs.x + obs.width, oy + obs.height);
        ctx.closePath();
        ctx.fill();
        
        // Sharp Rock Edges & Shadows
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(obs.x + 6, oy + 4, 6, 6);
        ctx.fillRect(obs.x + 16, oy + 8, 5, 5);

      } else {
        // Heavy Industrial Demolition Barrier with Warning Flasher
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(obs.x, oy + 8, obs.width, 12);

        // Black Diagonal Hazard Stripes
        ctx.fillStyle = '#0F172A';
        for (let sx = obs.x + 2; sx < obs.x + obs.width - 4; sx += 10) {
          ctx.beginPath();
          ctx.moveTo(sx, oy + 8);
          ctx.lineTo(sx + 5, oy + 8);
          ctx.lineTo(sx + 2, oy + 20);
          ctx.lineTo(sx - 3, oy + 20);
          ctx.closePath();
          ctx.fill();
        }

        // Steel Support Legs
        ctx.fillStyle = '#475569';
        ctx.fillRect(obs.x + 4, oy + 20, 4, obs.height - 20);
        ctx.fillRect(obs.x + obs.width - 8, oy + 20, 4, obs.height - 20);

        // Amber Flashing Safety Beacon
        const isBeaconOn = (this.frameCount % 20) < 10;
        ctx.fillStyle = isBeaconOn ? '#EF4444' : '#7F1D1D';
        ctx.fillRect(obs.x + obs.width / 2 - 3, oy + 1, 6, 7);
        if (isBeaconOn) {
          ctx.fillStyle = '#FCA5A5';
          ctx.fillRect(obs.x + obs.width / 2 - 1, oy + 2, 2, 3);
        }
      }
    }
  }

  private triggerGameOver(): void {
    this.gameOver = true;
    this.gameStarted = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      if (this.isBrowser) {
        localStorage.setItem('amber_runner_hi', this.highScore.toString());
      }
    }
  }

  private drawInitialState(): void {
    this.render();
  }

  ngOnDestroy(): void {
    if (this.reqId !== null && this.isBrowser) {
      cancelAnimationFrame(this.reqId);
    }
  }
}
