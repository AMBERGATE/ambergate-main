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
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

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
  modelPath?: string;
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
  private loadedModel: THREE.Object3D | null = null;

  private animFrameId: number | null = null;
  private isBrowser: boolean;
  private observer: IntersectionObserver | null = null;
  private isVisible: boolean = false;
  private animationProgress: number = 0;

  public activePhaseIndex: number = 1; // 1: Amb. Completo, 2: Selective Strip-Out, 3: Kitchen Demolition, 4: Clean Structure
  public readonly phaseTitles: string[] = [
    'Ambiente Completo',
    'Strip-Out Selectivo',
    'Preservación MEP',
    'Estructura Limpia'
  ];

  private isWheelCooldown: boolean = false;
  private touchStartY: number = 0;

  private targetRotationY: number = 0;
  private currentRotationY: number = 0;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public selectPhase(phaseNumber: number): void {
    if (phaseNumber < 1 || phaseNumber > 4) return;
    this.activePhaseIndex = phaseNumber;
    if (this.loadedModel) {
      this.updateMeshVisibilityForPhase(phaseNumber);
    }
    this.cdr.markForCheck();
  }

  public get rotationDegrees(): number {
    let deg = Math.round((this.targetRotationY * 180 / Math.PI) % 360);
    if (deg > 180) deg -= 360;
    if (deg < -180) deg += 360;
    return deg;
  }

  public rotateLeft(): void {
    this.targetRotationY += Math.PI / 4;
    this.cdr.markForCheck();
  }

  public rotateRight(): void {
    this.targetRotationY -= Math.PI / 4;
    this.cdr.markForCheck();
  }

  public resetRotation(): void {
    this.targetRotationY = 0;
    this.cdr.markForCheck();
  }

  private setupSceneInteractionListeners(): void {
    if (!this.isBrowser) return;
    const container = this.canvasRef.nativeElement.parentElement;
    if (!container) return;

    container.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        // Bloquear siempre el scroll global de la página mientras el cursor esté dentro de la escena 3D
        event.preventDefault();
        event.stopPropagation();

        if (this.isWheelCooldown) return;

        const delta = event.deltaY;
        if (Math.abs(delta) < 12) return;

        if (delta > 0) {
          if (this.activePhaseIndex < 4) {
            this.selectPhase(this.activePhaseIndex + 1);
            this.triggerCooldown();
          } else {
            this.triggerCooldown();
          }
        } else if (delta < 0) {
          if (this.activePhaseIndex > 1) {
            this.selectPhase(this.activePhaseIndex - 1);
            this.triggerCooldown();
          } else {
            this.triggerCooldown();
          }
        }
      },
      { passive: false }
    );

    container.addEventListener(
      'touchstart',
      (event: TouchEvent) => {
        if (event.touches && event.touches.length === 1) {
          this.touchStartY = event.touches[0].clientY;
        }
      },
      { passive: true }
    );

    container.addEventListener(
      'touchmove',
      (event: TouchEvent) => {
        if (!event.touches || event.touches.length !== 1) return;
        const currentY = event.touches[0].clientY;
        const diffY = this.touchStartY - currentY;

        if (Math.abs(diffY) > 25) {
          if (event.cancelable) event.preventDefault();
          if (this.isWheelCooldown) return;

          if (diffY > 0 && this.activePhaseIndex < 4) {
            this.selectPhase(this.activePhaseIndex + 1);
            this.touchStartY = currentY;
            this.triggerCooldown();
          } else if (diffY < 0 && this.activePhaseIndex > 1) {
            this.selectPhase(this.activePhaseIndex - 1);
            this.touchStartY = currentY;
            this.triggerCooldown();
          }
        }
      },
      { passive: false }
    );
  }

  private triggerCooldown(): void {
    this.isWheelCooldown = true;
    setTimeout(() => {
      this.isWheelCooldown = false;
    }, 260);
  }

  public navigatePrev(): void {
    const target = this.currentIndex - 1;
    this.navigateRequested.emit(target);
  }

  public navigateNext(): void {
    const target = this.currentIndex < this.totalServices ? this.currentIndex + 1 : 0;
    this.navigateRequested.emit(target);
  }

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.init3DScene();
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.setupSceneInteractionListeners();
      }, 0);
    }
  }

  private setupResizeObserver(): void {
    const container = this.canvasRef.nativeElement.parentElement;
    if (!container) return;
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    this.resizeObserver.observe(container);
  }

  private setupIntersectionObserver(): void {
    const element = this.canvasRef.nativeElement;
    this.isVisible = true;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    this.observer.observe(element);
  }

  private init3DScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    
    // 1. BLOQUEO DE CÁMARA Y PERSPECTIVA FIJA CINEMÁTICA
    // Vista estática y cinematográfica perfectamente angulada para encuadrar la tarjeta y el espacio.
    this.camera.position.set(4.2, 3.2, 5.2);
    this.camera.lookAt(0, -0.2, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Iluminación Profesional de Estudio
    const ambientLight = new THREE.AmbientLight(0xfff8e7, 1.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffdf9e, 3.0);
    mainLight.position.set(5, 8, 5);
    this.scene.add(mainLight);

    const baseColor = this.serviceData.cubeColor || 0xDBA622;
    const accentLight = new THREE.DirectionalLight(baseColor, 2.0);
    accentLight.position.set(-6, -2, -4);
    this.scene.add(accentLight);

    const fillLight = new THREE.PointLight(0xffe6a3, 1.5, 15);
    fillLight.position.set(0, 3, 2);
    this.scene.add(fillLight);

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);
    this.animatedSubObjects = [];

    const shapeType = this.serviceData.shapeType || 'block-assembly';
    const modelPath = this.serviceData.modelPath;

    if (modelPath) {
      this.loadGLTFModel(modelPath);
    } else {
      this.buildFallbackGeometry(shapeType, baseColor);
    }

    this.animate();
  }

  private loadGLTFModel(modelPath: string): void {
    // 3. FLUIDEZ Y OPTIMIZACIÓN WEB: GLTFLoader con compresión Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/assets/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const normalizedPath = modelPath.startsWith('/') ? modelPath : '/' + modelPath;

    gltfLoader.load(
      normalizedPath,
      (gltf) => {
        const model = gltf.scene;
        this.loadedModel = model;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                  mat.roughness = Math.min(mat.roughness, 0.5);
                  mat.metalness = Math.max(mat.metalness, 0.2);
                  mat.needsUpdate = true;
                }
              });
            }
          }
        });

        // Luz puntual de apoyo interior
        const centerInteriorLight = new THREE.PointLight(0xffdf9e, 2.5, 10);
        centerInteriorLight.position.set(0, 1.5, 0);
        this.mainGroup.add(centerInteriorLight);

        // Bounding box nativo de Three.js para centrado y escalado perfecto
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const wrapper = new THREE.Group();
        wrapper.add(model);
        model.position.set(-center.x, -center.y, -center.z);

        const targetSize = 4.0;
        const scaleFactor = (maxDim > 0 && isFinite(maxDim)) ? targetSize / maxDim : 1;
        wrapper.scale.setScalar(scaleFactor);

        const isServiceModel3 = this.serviceData.modelPath?.includes('amber_service_model_3');

        // Ajuste de cámara según el modelo cargado
        if (this.camera) {
          if (isServiceModel3) {
            this.camera.position.set(-3.0, 1.4, 4.6);
            this.camera.lookAt(0, -0.15, 0);
          } else {
            this.camera.position.set(4.2, 3.2, 5.2);
            this.camera.lookAt(0, -0.2, 0);
          }
          this.camera.updateProjectionMatrix();
        }

        // Aplicar visibilidad de mallas según la fase activa
        this.updateMeshVisibilityForPhase(this.activePhaseIndex);

        this.mainGroup.add(wrapper);
        this.cdr.markForCheck();
      },
      undefined,
      (error) => {
        console.warn(`Could not load GLTF model at ${normalizedPath}, using procedural geometry fallback.`, error);
        const baseColor = this.serviceData.cubeColor || 0xDBA622;
        this.buildBlockAssembly(baseColor);
        this.cdr.markForCheck();
      }
    );
  }

  // 2. SISTEMA DE FASES DE DEMOLICIÓN INTERACTIVO POR BOTONES (CLASIFICACIÓN DETERMINISTA GLB)
  private updateMeshVisibilityForPhase(phase: number): void {
    if (!this.loadedModel) return;

    const isServiceModel3 = this.serviceData.modelPath?.includes('amber_service_model_3');

    // Si el modelo no es el amber_service_model_3, asegurar visibilidad completa de todas las mallas
    if (!isServiceModel3) {
      this.loadedModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = true;
        }
      });
      this.cdr.markForCheck();
      return;
    }

    this.loadedModel.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      let nameStr = child.name || '';
      if (child.parent && child.parent.name) {
        nameStr += ' ' + child.parent.name;
      }

      // Elementos específicos requeridos para ser eliminados en Tab 3
      const isExplicitlyTab3Removed =
        child.name === 'Phase1_Structure_Phase2_Furniture_Phase2_Furniture_Phase2_F.009' ||
        child.name === 'Phase1_Structure_Plane.002_Material.012_0' ||
        child.name === 'Phase1_Structure_Plane.006_Material.014_0' ||
        child.name === 'Phase1_Structure_Plane.004_Material.013_0' ||
        nameStr.includes('F.009') ||
        nameStr.includes('Plane.002') ||
        nameStr.includes('Plane.006') ||
        nameStr.includes('Plane.004');

      // 0. ESTRUCTURA BASE Y MARCO ARQUITECTÓNICO (Piso, Techo, Paredes, Vigas) -> NUNCA SE ELIMINAN
      const isStructure: boolean = Boolean(
        !isExplicitlyTab3Removed &&
        (nameStr.includes('Phase1_Structure') ||
         nameStr.includes('Cube_Material.003_0') ||
         child.name === 'Phase1_Structure_Phase2_Furniture_Phase2_Furniture_Phase2_F' ||
         (child.parent && child.parent.name === 'Phase1_Structure_Phase2_Furniture_Phase2_Furniture_Phase2_F')) &&
        !nameStr.includes('Phase2_Furniture') &&
        !nameStr.includes('Phase3_Kitchen')
      );

      // 1. MARCO DE MADERA EXTERIOR
      const isFrame: boolean = isStructure;

      // 2. MESITAS DE CENTRO / LUZ (F.001, F.006) -> Se van en Tab 3 y Tab 4
      const isSideTable: boolean = Boolean(
        !isStructure &&
        (nameStr.includes('Phase2_F.001') ||
         nameStr.includes('Phase2_F.006') ||
         nameStr.includes('Cube.002') ||
         nameStr.includes('Cube.007'))
      );

      // 3. MESADA, BARRA DE COMEDOR Y SILLAS (F.002, F.003, F.004, F.008, F.009) -> Se van en Tab 4
      const isCounterBar: boolean = Boolean(
        !isStructure &&
        (nameStr.includes('Phase2_F.002') ||
         nameStr.includes('Phase2_F.003') ||
         nameStr.includes('Phase2_F.004') ||
         nameStr.includes('Phase2_F.008') ||
         nameStr.includes('Phase2_F.009') ||
         nameStr.includes('Cube.003') ||
         nameStr.includes('Cube.004') ||
         nameStr.includes('Cube.005') ||
         nameStr.includes('Cylinder'))
      );

      // 4. MUEBLES GENERALES DE SALA (Sofás) -> Se van desde Tab 2
      const isGenFurniture: boolean = Boolean(
        !isStructure &&
        !isSideTable &&
        !isCounterBar &&
        (nameStr.includes('Phase2_Furniture') || nameStr.includes('Cube'))
      );

      // 5. COCINA COMPLETA (node_0*) -> Se va en Tab 3 y Tab 4
      const isKitchen: boolean = Boolean(
        !isStructure &&
        (nameStr.includes('Phase3_Kitchen') || nameStr.includes('node_0'))
      );

      // 6. DECORACIÓN (Alfombra Plane.002 + Cuadros Plane.004, Plane.005, Plane.006) -> Se van en Tab 3 y Tab 4
      const isDecor: boolean = Boolean(
        !isStructure &&
        (nameStr.includes('Plane.002') ||
         nameStr.includes('Plane.004') ||
         nameStr.includes('Plane.005') ||
         nameStr.includes('Plane.006'))
      );

      switch (phase) {
        case 1:
          // Tab 1 (Ambiente Completo): Todo visible
          child.visible = true;
          break;

        case 2:
          // Tab 2 (Strip-Out Selectivo): Ocultar sofás y muebles generales. Estructura SIEMPRE visible.
          child.visible = isStructure || !isGenFurniture;
          break;

        case 3:
          // Tab 3 (Preservación MEP): Ocultar sofás, cocina, decor, mesitas de luz. Estructura SIEMPRE visible.
          if (isExplicitlyTab3Removed) {
            child.visible = false;
          } else {
            child.visible = isStructure || (!isGenFurniture && !isKitchen && !isDecor && !isSideTable);
          }
          break;

        case 4:
          // Tab 4 (Estructura Limpia): Mantiene visible la estructura arquitectónica limpia pura.
          child.visible = isStructure;
          break;

        default:
          child.visible = true;
          break;
      }
    });

    this.cdr.markForCheck();
  }

  private buildFallbackGeometry(shapeType: string, baseColor: number): void {
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
  }

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

  private buildHydroCrystal(baseColor: number): void {
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.9,
      roughness: 0.1
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

  private buildLogisticsMatrix(baseColor: number): void {
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

  // 3. FLUIDEZ Y OPTIMIZACIÓN WEB (LOOP DE RENDERIZADO 60 FPS ESTABLES)
  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const targetProgress = this.isVisible ? 1 : 0;
    this.animationProgress += (targetProgress - this.animationProgress) * 0.05;

    const time = performance.now() * 0.0015;

    // Animación suave de fallbacks geométricos procedurales si aplican
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

        const currentPos = new THREE.Vector3().lerpVectors(startPos, targetPos, this.animationProgress);
        const baseAngle = obj.userData['angle'] + time * 0.8;
        const currentRadius = currentPos.length();

        obj.position.x = Math.cos(baseAngle) * currentRadius;
        obj.position.z = Math.sin(baseAngle) * currentRadius;
        obj.position.y = currentPos.y;

        obj.rotation.x += 0.02;
        obj.rotation.y += 0.03;
      }
    });

    // Animación suave de rotación de la escena 3D con inercia
    if (this.mainGroup) {
      this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;
      this.mainGroup.rotation.y = this.currentRotationY;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser || !this.renderer || !this.camera) return;
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    const width = container?.clientWidth || canvas.clientWidth || 300;
    const height = container?.clientHeight || canvas.clientHeight || 300;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
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
    if (this.loadedModel) {
      this.loadedModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m: THREE.Material) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

