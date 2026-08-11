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
  private cubeMesh!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial[]>;
  private animFrameId: number | null = null;
  private scrollTimeline: gsap.core.Timeline | null = null;
  private isBrowser: boolean;

  // Face textures paths corresponding to 6 cube faces:
  // Face 0: Right (+X) -> Demolition 01
  // Face 1: Left (-X)  -> Demolition 03
  // Face 2: Top (+Y)   -> Pressure 01
  // Face 3: Bottom (-Y)-> Flooring 01
  // Face 4: Front (+Z) -> Junk 01
  // Face 5: Back (-Z)  -> Flooring 02
  private readonly faceImagePaths = [
    './assets/img/1-interior-selective-demolitions/01.webp',
    './assets/img/1-interior-selective-demolitions/03.webp',
    './assets/img/3-high-pressure/01.webp',
    './assets/img/2-flooring-demolition-removal/01.webp',
    './assets/img/4-junk-removal/01.webp',
    './assets/img/2-flooring-demolition-removal/02.webp'
  ];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initThreeScene();
      this.initScrollAnimations();
      this.animate();
    }
  }

  private initThreeScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera: Increased distance for proper scale and clearance
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 8.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 4. Lights - Enhanced for bright light/white background
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xf59e0b, 3.5); // Amber
    directionalLight1.position.set(5, 5, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x0f172a, 1.5); // Dark Slate Accent
    directionalLight2.position.set(-5, -5, -2);
    this.scene.add(directionalLight2);

    // 5. Load textures for each face of the cube
    const textureLoader = new THREE.TextureLoader();
    const materials: THREE.MeshStandardMaterial[] = this.faceImagePaths.map((path) => {
      const texture = textureLoader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;

      return new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.25,
        roughness: 0.3,
        bumpScale: 0.05
      });
    });

    // 6. Multi-Material Cube Box Geometry (3D Cube with custom image on each side)
    const geometry = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    this.cubeMesh = new THREE.Mesh(geometry, materials);
    
    // Position 3D cube slightly offset left so cards on right have ample margin
    this.cubeMesh.position.set(-1.6, 0, 0);
    this.scene.add(this.cubeMesh);
  }

  private initScrollAnimations(): void {
    const cube = this.cubeMesh;
    if (!cube) return;

    this.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-3d-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });

    // Section 1 (card at Right -> cube at Left -2.6)
    // Section 2 (card at Left -> cube at Right +2.6)
    // Section 3 (card at Right -> cube at Left -2.6)
    // Section 4 (card at Left -> cube at Right +2.6)

    this.scrollTimeline
      // Phase 1: Section 1 -> Section 2
      .to(cube.position, {
        x: 2.6,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'none'
      }, 0)
      .to(cube.rotation, {
        x: Math.PI * 0.5,
        y: Math.PI * 1.5,
        z: 0,
        duration: 1,
        ease: 'none'
      }, 0)

      // Phase 2: Section 2 -> Section 3
      .to(cube.position, {
        x: -2.6,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'none'
      }, 1)
      .to(cube.rotation, {
        x: Math.PI * 1.0,
        y: Math.PI * 2.5,
        z: 0,
        duration: 1,
        ease: 'none'
      }, 1)

      // Phase 3: Section 3 -> Section 4
      .to(cube.position, {
        x: 2.6,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'none'
      }, 2)
      .to(cube.rotation, {
        x: Math.PI * 1.5,
        y: Math.PI * 3.5,
        z: 0,
        duration: 1,
        ease: 'none'
      }, 2)
      // Step 4 -> Landing Transition: Animate 3D Cube smoothly down to the truck ground position
      .to(cube.position, {
        x: -2.8,
        y: -2.1,
        z: 0,
        duration: 1,
        ease: 'power1.inOut'
      }, 3)
      .to(cube.scale, {
        x: 0.12,
        y: 0.12,
        z: 0.12,
        duration: 1,
        ease: 'power1.inOut'
      }, 3);

    // Initial position for Section 1 (Cube at Left -2.6, card at Right)
    cube.position.set(-2.6, 0, 0);
    cube.scale.set(0.85, 0.85, 0.85);
  }

  private animate = (): void => {
    if (!this.isBrowser) return;

    this.animFrameId = requestAnimationFrame(this.animate);

    // Continuous idle 3D rotation
    if (this.cubeMesh) {
      this.cubeMesh.rotation.y += 0.0025;
      this.cubeMesh.rotation.x += 0.0012;
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

    if (this.cubeMesh) {
      this.cubeMesh.geometry.dispose();
      if (Array.isArray(this.cubeMesh.material)) {
        this.cubeMesh.material.forEach((mat) => {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}
