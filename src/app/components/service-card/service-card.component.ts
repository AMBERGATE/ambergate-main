import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

export interface ServiceItemData {
  step: string;
  badge: string;
  title: string;
  description: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  tags: string[];
  cubeColor?: number;
}

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) serviceData!: ServiceItemData;
  @Input() alignRight: boolean = false;
  @Input() currentIndex: number = 1;
  @Input() totalServices: number = 4;

  @Output() navigateRequested = new EventEmitter<number>();

  @ViewChild('cubeCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  
  private faceMeshes: THREE.Mesh[] = [];
  private cubeGroup!: THREE.Group;

  private animFrameId: number | null = null;
  private isBrowser: boolean;
  private observer: IntersectionObserver | null = null;
  private isVisible: boolean = false;
  private animationProgress: number = 0; // 0 = split/exploded, 1 = assembled cube

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public navigatePrev(): void {
    const target = this.currentIndex - 1;
    this.navigateRequested.emit(target);
  }

  public navigateNext(): void {
    const target = this.currentIndex < this.totalServices ? this.currentIndex + 1 : 0;
    this.navigateRequested.emit(target);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initFacesAssemblyScene();
        this.setupIntersectionObserver();
      }, 0);
    }
  }

  private setupIntersectionObserver(): void {
    const element = this.canvasRef.nativeElement;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When card enters viewport -> animate assemble (progress to 1)
          // When card leaves viewport -> animate disassemble (progress back to 0)
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.35 }
    );
    this.observer.observe(element);
  }

  private initFacesAssemblyScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 4.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(4, 5, 4);
    this.scene.add(mainLight);

    const accentLight = new THREE.DirectionalLight(0xDBA622, 2.0);
    accentLight.position.set(-4, -3, -2);
    this.scene.add(accentLight);

    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    const baseColor = this.serviceData.cubeColor || 0xDBA622;

    const frontMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.85,
      roughness: 0.18,
      side: THREE.DoubleSide
    });

    const planeGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const size = 1.5 / 2; // Offset 0.75

    // Configurations for unique directional face explosion based on service index
    // Each service has a slightly different pattern of explosion vector
    const patternMultiplier = (this.currentIndex % 2 === 0) ? 2.8 : 2.2;

    const faceConfigs = [
      // 0: Front (+Z)
      { targetPos: new THREE.Vector3(0, 0, size), targetRot: new THREE.Euler(0, 0, 0), startPos: new THREE.Vector3(0, 0, size + patternMultiplier) },
      // 1: Back (-Z)
      { targetPos: new THREE.Vector3(0, 0, -size), targetRot: new THREE.Euler(0, Math.PI, 0), startPos: new THREE.Vector3(0, 0, -size - patternMultiplier) },
      // 2: Top (+Y)
      { targetPos: new THREE.Vector3(0, size, 0), targetRot: new THREE.Euler(-Math.PI / 2, 0, 0), startPos: new THREE.Vector3(0, size + patternMultiplier, 0) },
      // 3: Bottom (-Y)
      { targetPos: new THREE.Vector3(0, -size, 0), targetRot: new THREE.Euler(Math.PI / 2, 0, 0), startPos: new THREE.Vector3(0, -size - patternMultiplier, 0) },
      // 4: Right (+X)
      { targetPos: new THREE.Vector3(size, 0, 0), targetRot: new THREE.Euler(0, Math.PI / 2, 0), startPos: new THREE.Vector3(size + patternMultiplier, 0, 0) },
      // 5: Left (-X)
      { targetPos: new THREE.Vector3(-size, 0, 0), targetRot: new THREE.Euler(0, -Math.PI / 2, 0), startPos: new THREE.Vector3(-size - patternMultiplier, 0, 0) }
    ];

    this.faceMeshes = [];

    faceConfigs.forEach((config) => {
      const mesh = new THREE.Mesh(planeGeo, frontMaterial);
      mesh.position.copy(config.startPos);
      mesh.rotation.copy(config.targetRot);
      mesh.userData = {
        targetPos: config.targetPos,
        startPos: config.startPos
      };
      this.cubeGroup.add(mesh);
      this.faceMeshes.push(mesh);
    });

    this.animate();
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Smoothly transition progress based on IntersectionObserver visibility state
    const targetProgress = this.isVisible ? 1 : 0;
    this.animationProgress += (targetProgress - this.animationProgress) * 0.06;

    // Interpolate face positions between startPos (exploded) and targetPos (assembled)
    this.faceMeshes.forEach((mesh) => {
      const targetPos: THREE.Vector3 = mesh.userData['targetPos'];
      const startPos: THREE.Vector3 = mesh.userData['startPos'];

      mesh.position.lerpVectors(startPos, targetPos, this.animationProgress);
    });

    // Continuous 3D Rotation of the cube group
    if (this.cubeGroup) {
      this.cubeGroup.rotation.x += 0.008;
      this.cubeGroup.rotation.y += 0.014;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser || !this.renderer || !this.camera) return;
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 300;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.faceMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
