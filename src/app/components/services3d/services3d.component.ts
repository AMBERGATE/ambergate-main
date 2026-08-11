import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services3d.component.html',
  styleUrl: './services3d.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class Services3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasElement', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private truckModel: THREE.Group | null = null;
  private dumpBed: THREE.Object3D | null = null;
  private doors: THREE.Object3D[] = [];
  private wheels: THREE.Object3D[] = [];
  private particlesMesh: THREE.Points | null = null;

  private animFrameId: number | null = null;
  private scrollTimeline: gsap.core.Timeline | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initThreeScene();
      this.loadTruckModel();
    }
  }

  private initThreeScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 9);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xf59e0b, 2.5); // Amber Industrial Accent
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0); // Soft sky fill
    fillLight.position.set(-5, 4, -5);
    this.scene.add(fillLight);

    // 5. Water Spray Particle System (For Phase 03)
    this.initWaterParticles();
  }

  private initWaterParticles(): void {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1.5;
      positions[i + 1] = (Math.random() - 0.5) * 1.5;
      positions[i + 2] = (Math.random() - 0.5) * 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.particlesMesh.position.set(-2, 0.5, 0);
    this.scene.add(this.particlesMesh);
  }

  private loadTruckModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/models/isuzu_giga_dump_truck.glb',
      (gltf) => {
        this.truckModel = gltf.scene;
        this.truckModel.scale.set(0.026, 0.026, 0.026);
        this.truckModel.position.set(-2.0, -0.6, 0);

        this.truckModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.side = THREE.DoubleSide;
            }
          }

          // Reference key meshes for animations
          const nameLower = child.name.toLowerCase();
          if (nameLower.includes('dump') || nameLower.includes('bed') || nameLower.includes('box')) {
            this.dumpBed = child;
          }
          if (nameLower.includes('door')) {
            this.doors.push(child);
          }
          if (nameLower.includes('wheel') || nameLower.includes('tire')) {
            this.wheels.push(child);
          }
        });

        this.scene.add(this.truckModel);
        this.initScrollTimeline();
        this.animate();
      },
      undefined,
      (error) => {
        console.error('Error loading Isuzu Giga Dump Truck model:', error);
      }
    );
  }

  private initScrollTimeline(): void {
    if (!this.truckModel) return;

    const truck = this.truckModel;

    this.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-3d-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0,
        invalidateOnRefresh: true
      }
    });

    // PHASE 01 (0% -> 25% Scroll): Interior Demolition
    // Rotation & Door Exploded View
    this.scrollTimeline
      .to(truck.position, {
        x: -2.0,
        y: -0.5,
        z: 0.5,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      .to(truck.rotation, {
        x: 0.1,
        y: Math.PI * 0.25,
        z: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0);

    // PHASE 02 (25% -> 50% Scroll): Flooring Removal
    // Move to left side, low angle, backward motion
    this.scrollTimeline
      .to(truck.position, {
        x: 2.2,
        y: -0.8,
        z: -1.0,
        duration: 1,
        ease: 'power2.inOut'
      }, 1)
      .to(truck.rotation, {
        x: 0,
        y: -Math.PI * 0.4,
        z: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 1);

    // PHASE 03 (50% -> 75% Scroll): High Pressure Cleaning
    // Profile side view, water spray particles opacity trigger
    this.scrollTimeline
      .to(truck.position, {
        x: -2.2,
        y: -0.6,
        z: 0.5,
        duration: 1,
        ease: 'power2.inOut'
      }, 2)
      .to(truck.rotation, {
        x: 0,
        y: Math.PI * 0.5,
        z: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 2);

    if (this.particlesMesh) {
      const pMat = this.particlesMesh.material as THREE.PointsMaterial;
      this.scrollTimeline.to(pMat, {
        opacity: 0.8,
        duration: 0.4,
        yoyo: true,
        repeat: 1
      }, 2.2);
    }

    // PHASE 04 (75% -> 100% Scroll): Debris Hauling & Minigame Handoff
    // Dump bed elevation and exit landing
    this.scrollTimeline
      .to(truck.position, {
        x: 2.0,
        y: -0.6,
        z: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 3)
      .to(truck.rotation, {
        x: 0,
        y: -Math.PI * 0.6,
        z: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 3);

    if (this.dumpBed) {
      this.scrollTimeline.to(this.dumpBed.rotation, {
        x: -Math.PI * 0.2, // Raise dump bed
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      }, 3.2);
    }

    // Final exit transition down towards minigame
    this.scrollTimeline
      .to(truck.position, {
        x: -4.0,
        y: -3.8,
        z: 0,
        duration: 0.8,
        ease: 'power1.in'
      }, 3.7)
      .to(truck.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 0.8,
        ease: 'power1.in'
      }, 3.7);
  }

  private animate = (): void => {
    if (!this.isBrowser) return;

    this.animFrameId = requestAnimationFrame(this.animate);

    // Idle physics (gentle float)
    if (this.truckModel) {
      this.truckModel.position.y += Math.sin(Date.now() * 0.002) * 0.0015;
    }

    // Animate water particles if active
    if (this.particlesMesh && this.particlesMesh.geometry) {
      const positions = this.particlesMesh.geometry.attributes['position'].array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.05;
        positions[i + 1] += Math.random() * 0.03;
        if (positions[i + 1] > 1.5) positions[i + 1] = -0.5;
      }
      this.particlesMesh.geometry.attributes['position'].needsUpdate = true;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isBrowser || !this.renderer || !this.camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }

    if (this.scrollTimeline) {
      this.scrollTimeline.kill();
    }
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    if (this.particlesMesh) {
      this.particlesMesh.geometry.dispose();
      (this.particlesMesh.material as THREE.Material).dispose();
    }

    if (this.truckModel) {
      this.truckModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}
