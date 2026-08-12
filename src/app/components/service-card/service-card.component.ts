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
  shapeType?: 'block-assembly' | 'layered-slab' | 'hydro-crystal' | 'logistics-matrix';
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
  
  private mainGroup!: THREE.Group;
  private animatedSubObjects: THREE.Object3D[] = [];

  private animFrameId: number | null = null;
  private isBrowser: boolean;
  private observer: IntersectionObserver | null = null;
  private isVisible: boolean = false;
  private animationProgress: number = 0;

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
        this.init3DScene();
        this.setupIntersectionObserver();
      }, 0);
    }
  }

  private setupIntersectionObserver(): void {
    const element = this.canvasRef.nativeElement;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.3 }
    );
    this.observer.observe(element);
  }

  private init3DScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Balanced Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(4, 5, 4);
    this.scene.add(mainLight);

    const shapeType = this.serviceData.shapeType || 'block-assembly';
    const baseColor = this.serviceData.cubeColor || 0xDBA622;

    const accentLight = new THREE.DirectionalLight(baseColor, 1.8);
    accentLight.position.set(-4, -3, -2);
    this.scene.add(accentLight);

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);
    this.animatedSubObjects = [];

    // Create 3D geometry & sub-elements based on shapeType
    switch (shapeType) {
      case 'layered-slab':
        this.buildLayeredSlab(baseColor);
        break;
      case 'hydro-crystal':
        this.buildHydroCrystal(baseColor);
        break;
      case 'logistics-matrix':
        this.buildLogisticsMatrix(baseColor);
        break;
      case 'block-assembly':
      default:
        this.buildBlockAssembly(baseColor);
        break;
    }

    this.animate();
  }

  /* --- 1. Block Assembly (Demolition & Removal) --- */
  private buildBlockAssembly(baseColor: number): void {
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.85,
      roughness: 0.18,
      side: THREE.DoubleSide
    });
    const planeGeo = new THREE.PlaneGeometry(1.5, 1.5);
    const offset = 0.75;
    const spread = 2.4;

    const faceConfigs = [
      { targetPos: new THREE.Vector3(0, 0, offset), targetRot: new THREE.Euler(0, 0, 0), startPos: new THREE.Vector3(0, 0, offset + spread) },
      { targetPos: new THREE.Vector3(0, 0, -offset), targetRot: new THREE.Euler(0, Math.PI, 0), startPos: new THREE.Vector3(0, 0, -offset - spread) },
      { targetPos: new THREE.Vector3(0, offset, 0), targetRot: new THREE.Euler(-Math.PI / 2, 0, 0), startPos: new THREE.Vector3(0, offset + spread, 0) },
      { targetPos: new THREE.Vector3(0, -offset, 0), targetRot: new THREE.Euler(Math.PI / 2, 0, 0), startPos: new THREE.Vector3(0, -offset - spread, 0) },
      { targetPos: new THREE.Vector3(offset, 0, 0), targetRot: new THREE.Euler(0, Math.PI / 2, 0), startPos: new THREE.Vector3(offset + spread, 0, 0) },
      { targetPos: new THREE.Vector3(-offset, 0, 0), targetRot: new THREE.Euler(0, -Math.PI / 2, 0), startPos: new THREE.Vector3(-offset - spread, 0, 0) }
    ];

    faceConfigs.forEach((config) => {
      const mesh = new THREE.Mesh(planeGeo, material);
      mesh.position.copy(config.startPos);
      mesh.rotation.copy(config.targetRot);
      mesh.userData = { targetPos: config.targetPos, startPos: config.startPos, type: 'lerpPos' };
      this.mainGroup.add(mesh);
      this.animatedSubObjects.push(mesh);
    });
  }

  /* --- 2. Layered Slab (Flooring Specialists) --- */
  private buildLayeredSlab(baseColor: number): void {
    const layerCount = 4;
    const slabGeo = new THREE.BoxGeometry(1.6, 0.22, 1.6);

    for (let i = 0; i < layerCount; i++) {
      const isTop = i === layerCount - 1;
      const mat = new THREE.MeshStandardMaterial({
        color: isTop ? baseColor : new THREE.Color(baseColor).multiplyScalar(0.7 + i * 0.1),
        metalness: 0.6,
        roughness: 0.25
      });
      const mesh = new THREE.Mesh(slabGeo, mat);

      const targetY = (i - 1.5) * 0.32;
      const startY = targetY + (i % 2 === 0 ? 2.5 : -2.5);

      mesh.position.set(0, startY, 0);
      mesh.userData = {
        targetPos: new THREE.Vector3(0, targetY, 0),
        startPos: new THREE.Vector3(0, startY, 0),
        type: 'lerpPos',
        layerIndex: i
      };

      this.mainGroup.add(mesh);
      this.animatedSubObjects.push(mesh);
    }
  }

  /* --- 3. Hydro Crystal (High Pressure Cleaning) --- */
  private buildHydroCrystal(baseColor: number): void {
    // Outer wireframe crystal + inner solid core
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.userData = { type: 'pulseScale' };
    this.mainGroup.add(coreMesh);
    this.animatedSubObjects.push(coreMesh);

    const wireGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.userData = { type: 'counterRotate' };
    this.mainGroup.add(wireMesh);
    this.animatedSubObjects.push(wireMesh);
  }

  /* --- 4. Logistics Matrix (Junk Removal & Site Clean) --- */
  private buildLogisticsMatrix(baseColor: number): void {
    // Central core cargo box
    const centerGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const centerMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.8,
      roughness: 0.2
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.userData = { type: 'centerCore' };
    this.mainGroup.add(centerMesh);
    this.animatedSubObjects.push(centerMesh);

    // Orbiting mini container satellites
    const satCount = 6;
    const satGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      metalness: 0.9,
      roughness: 0.15
    });

    for (let i = 0; i < satCount; i++) {
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 1.4;

      const targetPos = new THREE.Vector3(
        Math.cos(angle) * radius,
        (i % 2 === 0 ? 0.3 : -0.3),
        Math.sin(angle) * radius
      );
      const startPos = targetPos.clone().multiplyScalar(2.2);

      satMesh.position.copy(startPos);
      satMesh.userData = {
        targetPos,
        startPos,
        angle,
        radius,
        type: 'orbitSatellite'
      };
      this.mainGroup.add(satMesh);
      this.animatedSubObjects.push(satMesh);
    }
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const targetProgress = this.isVisible ? 1 : 0;
    this.animationProgress += (targetProgress - this.animationProgress) * 0.05;

    const time = performance.now() * 0.0015;

    // Animate sub-objects according to their behavior type
    this.animatedSubObjects.forEach((obj) => {
      const type = obj.userData['type'];

      if (type === 'lerpPos') {
        const targetPos: THREE.Vector3 = obj.userData['targetPos'];
        const startPos: THREE.Vector3 = obj.userData['startPos'];
        obj.position.lerpVectors(startPos, targetPos, this.animationProgress);
      } else if (type === 'pulseScale') {
        const pulse = 1 + Math.sin(time * 3) * 0.06 * this.animationProgress;
        obj.scale.set(pulse, pulse, pulse);
      } else if (type === 'counterRotate') {
        obj.rotation.x = -time * 0.4;
        obj.rotation.y = -time * 0.6;
      } else if (type === 'orbitSatellite') {
        const targetPos: THREE.Vector3 = obj.userData['targetPos'];
        const startPos: THREE.Vector3 = obj.userData['startPos'];

        // Dock in when visible
        const currentPos = new THREE.Vector3().lerpVectors(startPos, targetPos, this.animationProgress);

        // Orbital rotation around center Y axis
        const baseAngle = obj.userData['angle'] + time * 0.8;
        const currentRadius = currentPos.length();

        obj.position.x = Math.cos(baseAngle) * currentRadius;
        obj.position.z = Math.sin(baseAngle) * currentRadius;
        obj.position.y = currentPos.y;

        obj.rotation.x += 0.02;
        obj.rotation.y += 0.03;
      }
    });

    // Continuous smooth group rotation
    if (this.mainGroup) {
      this.mainGroup.rotation.x += 0.006;
      this.mainGroup.rotation.y += 0.012;
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
    this.animatedSubObjects.forEach((obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: THREE.Material) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
