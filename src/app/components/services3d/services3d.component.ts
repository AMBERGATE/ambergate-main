import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
    selector: 'app-services3d',
    imports: [CommonModule],
    templateUrl: './services3d.component.html',
    styleUrl: './services3d.component.scss'
})
export class Services3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasElement', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cubeMesh!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
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
    this.scene.background = new THREE.Color(0x0b0f17);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 7);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf59e0b, 2.5); // Amber Hue
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const secondaryLight = new THREE.DirectionalLight(0x38bdf8, 1.2); // Cyan accent rim light
    secondaryLight.position.set(-5, -5, -2);
    this.scene.add(secondaryLight);

    // 5. Industrial Mesh Cube Base
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false
    });

    this.cubeMesh = new THREE.Mesh(geometry, material);
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

    // Step 1 -> Step 2 transition: Rotate, move right/left, scale up, change hue
    this.scrollTimeline
      .to(cube.rotation, {
        x: Math.PI * 1.5,
        y: Math.PI * 2,
        z: Math.PI * 0.5,
        duration: 2,
        ease: 'power2.inOut'
      }, 0)
      .to(cube.position, {
        x: -1.8,
        y: 0.5,
        z: 1,
        duration: 2,
        ease: 'power2.inOut'
      }, 0)
      .to(cube.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 2,
        ease: 'power2.inOut'
      }, 0)
      // Step 2 -> Step 3 transition: Translate across X/Y axes, spin, scale & update material color
      .to(cube.rotation, {
        x: Math.PI * 3,
        y: Math.PI * 4,
        z: Math.PI * 2,
        duration: 2,
        ease: 'power2.inOut'
      }, '+=0.5')
      .to(cube.position, {
        x: 1.8,
        y: -0.5,
        z: 0.5,
        duration: 2,
        ease: 'power2.inOut'
      }, '<')
      .to(cube.scale, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        duration: 2,
        ease: 'power2.inOut'
      }, '<');
  }

  private animate = (): void => {
    if (!this.isBrowser) return;

    this.animFrameId = requestAnimationFrame(this.animate);

    // Subtle continuous idle floating rotation
    if (this.cubeMesh) {
      this.cubeMesh.rotation.y += 0.003;
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

    // 1. Cancel RAF
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }

    // 2. Kill GSAP ScrollTrigger instances
    if (this.scrollTimeline) {
      this.scrollTimeline.kill();
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // 3. Dispose 3D Geometry and Materials
    if (this.cubeMesh) {
      this.cubeMesh.geometry.dispose();
      if (Array.isArray(this.cubeMesh.material)) {
        this.cubeMesh.material.forEach(m => m.dispose());
      } else {
        this.cubeMesh.material.dispose();
      }
    }

    // 4. Dispose WebGL Renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}
