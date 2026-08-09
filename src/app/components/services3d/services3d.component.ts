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
    this.scene.background = new THREE.Color(0x07090e);

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

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xf59e0b, 3.0); // Warm Amber
    directionalLight1.position.set(5, 5, 5);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5); // Cool Cyan Rim
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
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    });

    // Scroll Animation Sequence across 4 sections:
    // Section 1: Cube at Left (-1.6, 0, 0), Card at Right
    // Section 2: Cube moves Right (+1.6, 0, 0), Rotates to display Top/Side faces, Card at Left
    // Section 3: Cube moves back to Left (-1.6, -0.2, 0), Spins 360, Card at Right
    // Section 4: Cube moves to Center Right (+1.4, 0.2, 0.5), Tilts 3D, Card at Left

    this.scrollTimeline
      // Phase 1 -> Phase 2 (Section 1 to Section 2)
      .to(cube.position, {
        x: 1.6,
        y: 0.1,
        z: 0.2,
        duration: 2,
        ease: 'power2.inOut'
      }, 0)
      .to(cube.rotation, {
        x: Math.PI * 0.5,
        y: Math.PI * 1.25,
        z: Math.PI * 0.25,
        duration: 2,
        ease: 'power2.inOut'
      }, 0)
      .to(cube.scale, {
        x: 1.15,
        y: 1.15,
        z: 1.15,
        duration: 2,
        ease: 'power2.inOut'
      }, 0)

      // Phase 2 -> Phase 3 (Section 2 to Section 3)
      .to(cube.position, {
        x: -1.6,
        y: -0.2,
        z: -0.2,
        duration: 2,
        ease: 'power2.inOut'
      }, '+=0.2')
      .to(cube.rotation, {
        x: Math.PI * 1.75,
        y: Math.PI * 2.5,
        z: Math.PI * 1.0,
        duration: 2,
        ease: 'power2.inOut'
      }, '<')
      .to(cube.scale, {
        x: 0.95,
        y: 0.95,
        z: 0.95,
        duration: 2,
        ease: 'power2.inOut'
      }, '<')

      // Phase 3 -> Phase 4 (Section 3 to Section 4)
      .to(cube.position, {
        x: 1.5,
        y: 0.2,
        z: 0.4,
        duration: 2,
        ease: 'power2.inOut'
      }, '+=0.2')
      .to(cube.rotation, {
        x: Math.PI * 2.5,
        y: Math.PI * 3.75,
        z: Math.PI * 1.75,
        duration: 2,
        ease: 'power2.inOut'
      }, '<')
      .to(cube.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 2,
        ease: 'power2.inOut'
      }, '<');
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
