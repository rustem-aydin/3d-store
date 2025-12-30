"use client";
import { getPreviewUrl } from "@/helpers/get-product-files";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// Server action'ı import ettiğinizden emin olun (yolu projenize göre düzenleyin)

type ViewMode = "solid" | "wireframe" | "xray";

interface STLViewerProps {
  file_url: string; // Dosya adı (örn: "model.stl")
}

export default function STLViewer({ file_url }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Supabase'den gelecek signed URL için state
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>("solid");

  // 1. ADIM: Component mount olduğunda Signed URL'i al
  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!file_url) return;

      setIsLoading(true);
      try {
        const url = await getPreviewUrl({ file_url });
        if (url) {
          setModelUrl(url);
        } else {
          console.error("Signed URL alınamadı.");
        }
      } catch (error) {
        console.error("URL getirme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignedUrl();
  }, [file_url]);

  // 2. ADIM: modelUrl geldiğinde Three.js sahnesini kur
  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    // Önceki sahneyi temizle (Eğer url değişirse üst üste binmemesi için)
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2b2b2b);
    sceneRef.current = scene;

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 100);
    cameraRef.current = camera;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- ORBIT CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controlsRef.current = controls;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, 5, -10);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0x9333ea, 0.3);
    directionalLight3.position.set(0, -10, 10);
    scene.add(directionalLight3);

    // --- STL Loader ---
    const loader = new STLLoader();

    // BURADA ARTIK SIGNED URL KULLANILIYOR
    loader.load(
      modelUrl,
      (geometry) => {
        geometry.computeBoundingBox();
        geometry.center();

        const material = new THREE.MeshPhongMaterial({
          color: 0x9333ea,
          shininess: 80,
          specular: 0xb466ff,
          flatShading: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;

        scene.add(mesh);
        meshRef.current = mesh;
      },
      (xhr) => {
        // Yükleme sırasında progress log'u
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error("STL yüklenirken hata:", error);
      }
    );

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      // Sahnedeki objeleri temizle (memory leak önlemek için)
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      if (containerRef.current && renderer.domElement) {
        // React strict mode bazen DOM node'u çoktan kaldırmış olabilir, kontrol ediyoruz.
        if (containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [modelUrl]); // modelUrl değişirse sahneyi yeniden kur

  // --- Button Handlers (Aynı Kaldı) ---

  const handleZoomIn = () => {
    if (cameraRef.current) {
      const direction = new THREE.Vector3();
      cameraRef.current.getWorldDirection(direction);
      cameraRef.current.position.addScaledVector(direction, 10);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      const direction = new THREE.Vector3();
      cameraRef.current.getWorldDirection(direction);
      cameraRef.current.position.addScaledVector(direction, -10);
    }
  };

  const handleRotateUp = () => {
    if (meshRef.current) meshRef.current.rotation.x -= Math.PI / 8;
  };
  const handleRotateDown = () => {
    if (meshRef.current) meshRef.current.rotation.x += Math.PI / 8;
  };
  const handleRotateLeft = () => {
    if (meshRef.current) meshRef.current.rotation.z -= Math.PI / 8;
  };
  const handleRotateRight = () => {
    if (meshRef.current) meshRef.current.rotation.z += Math.PI / 8;
  };

  const handleReset = () => {
    if (controlsRef.current) controlsRef.current.reset();
    if (meshRef.current) {
      meshRef.current.rotation.set(-Math.PI / 2, 0, 0);
      meshRef.current.position.set(0, 0, 0);
    }
    if (cameraRef.current) cameraRef.current.position.set(0, 20, 100);
  };

  const handleDownload = () => {
    if (modelUrl) {
      window.open(modelUrl, "_blank");
    } else {
      alert("Dosya URL'i henüz hazır değil.");
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (!meshRef.current || !meshRef.current.material) return;
    const material = meshRef.current.material as THREE.MeshPhongMaterial;

    switch (mode) {
      case "solid":
        material.wireframe = false;
        material.transparent = false;
        material.opacity = 1;
        material.color.setHex(0x9333ea);
        break;
      case "wireframe":
        material.wireframe = true;
        material.transparent = false;
        material.opacity = 1;
        material.color.setHex(0xa855f7);
        break;
      case "xray":
        material.wireframe = false;
        material.transparent = true;
        material.opacity = 0.4;
        material.color.setHex(0xc084fc);
        material.side = THREE.DoubleSide;
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#2b2b2b] text-white">
      {/* 3D Viewer */}
      <div ref={containerRef} className="flex-1 relative cursor-move">
        {/* Yükleniyor Göstergesi */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2b2b2b] z-50">
            <div className="text-purple-500 font-semibold animate-pulse">
              Model Yükleniyor...
            </div>
          </div>
        )}
        {/* Hata veya URL yoksa */}
        {!isLoading && !modelUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2b2b2b] z-50">
            <div className="text-red-400 font-semibold">Model yüklenemedi.</div>
          </div>
        )}
      </div>

      {/* Controls UI (Sadece ref güncellemeleri dışında aynı kaldı) */}
      <div className="absolute top-6 left-6 z-10 select-none">
        {/* ... SVG Kontrolleri (Aynı) ... */}
        <div className="relative w-[160px] h-[160px] rounded-full bg-black/20 backdrop-blur-md shadow-2xl border border-white/10 flex items-center justify-center hover:scale-105 duration-300">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            className="drop-shadow-lg"
          >
            {/* Dönme Butonları */}
            <g
              onClick={handleRotateUp}
              className="cursor-pointer group hover:brightness-125 transition-all"
            >
              <path
                d="M 80 10 L 105 35 A 40 40 0 0 0 55 35 Z"
                className="fill-white/5 stroke-white/10 group-hover:fill-purple-600/80 group-hover:stroke-purple-400 transition-colors duration-300"
                strokeWidth="1"
              />
              <path
                d="M 80 18 L 80 28 M 75 23 L 80 18 L 85 23"
                stroke="currentColor"
                className="text-gray-400 group-hover:text-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            <g
              onClick={handleRotateRight}
              className="cursor-pointer group hover:brightness-125 transition-all"
            >
              <path
                d="M 150 80 L 125 105 A 40 40 0 0 0 125 55 Z"
                className="fill-white/5 stroke-white/10 group-hover:fill-purple-600/80 group-hover:stroke-purple-400 transition-colors duration-300"
                strokeWidth="1"
              />
              <path
                d="M 142 80 L 132 80 M 137 75 L 142 80 L 137 85"
                stroke="currentColor"
                className="text-gray-400 group-hover:text-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            <g
              onClick={handleRotateDown}
              className="cursor-pointer group hover:brightness-125 transition-all"
            >
              <path
                d="M 80 150 L 55 125 A 40 40 0 0 0 105 125 Z"
                className="fill-white/5 stroke-white/10 group-hover:fill-purple-600/80 group-hover:stroke-purple-400 transition-colors duration-300"
                strokeWidth="1"
              />
              <path
                d="M 80 142 L 80 132 M 85 137 L 80 142 L 75 137"
                stroke="currentColor"
                className="text-gray-400 group-hover:text-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            <g
              onClick={handleRotateLeft}
              className="cursor-pointer group hover:brightness-125 transition-all"
            >
              <path
                d="M 10 80 L 35 55 A 40 40 0 0 0 35 105 Z"
                className="fill-white/5 stroke-white/10 group-hover:fill-purple-600/80 group-hover:stroke-purple-400 transition-colors duration-300"
                strokeWidth="1"
              />
              <path
                d="M 18 80 L 28 80 M 23 85 L 18 80 L 23 75"
                stroke="currentColor"
                className="text-gray-400 group-hover:text-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            {/* Zoom Butonları */}
            <g
              onClick={handleZoomIn}
              className="cursor-pointer group hover:brightness-125 transition-all"
            >
              <path
                d="M 50 80 A 30 30 0 0 1 110 80 L 80 80 Z"
                className="fill-[#2a2a2a] stroke-white/5 group-hover:fill-[#3a3a3a] transition-colors"
              />
              <text x="74" y="65" fill="white" fontSize="18" fontWeight="bold">
                +
              </text>
            </g>
            <g
              onClick={handleZoomOut}
              className="cursor-pointer group hover:brightness-125 transition-all"
            >
              <path
                d="M 50 80 A 30 30 0 0 0 110 80 L 80 80 Z"
                className="fill-[#2a2a2a] stroke-white/5 group-hover:fill-[#3a3a3a] transition-colors"
              />
              <rect x="73" y="95" width="14" height="2" fill="white" />
            </g>
            {/* Reset Butonu */}
            <g
              onClick={handleReset}
              className="cursor-pointer group hover:scale-110 transition-transform origin-center"
            >
              <circle
                cx="80"
                cy="80"
                r="12"
                className="fill-purple-600 stroke-purple-400 group-hover:fill-purple-500 shadow-lg"
                strokeWidth="2"
              />
              <path
                transform="translate(74, 74) scale(0.5)"
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                fill="white"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Sağ/Sol Oklar (UI için) */}
      <button className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-purple-600/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center transition-all group shadow-lg z-10">
        <svg
          className="w-6 h-6 text-gray-300 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-purple-600/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center transition-all group shadow-lg z-10">
        <svg
          className="w-6 h-6 text-gray-300 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Üst Sağ Küp İkonu */}
      <div className="absolute top-6 right-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.18l7 3.5v7.14l-7-3.5V9.18zm9 10.64v-7.14l7-3.5v7.14l-7 3.5z" />
          </svg>
        </div>
      </div>

      {/* Alt Footer */}
      <div className="bg-[#1f1f1f] border-t border-gray-700 p-3 flex items-center justify-center gap-4 relative z-20">
        <div className="flex gap-2">
          {["solid", "wireframe", "xray"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode as ViewMode)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 border ${
                viewMode === mode
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 shadow-lg shadow-purple-500/30"
                  : "bg-[#3a3a3a] text-gray-300 hover:bg-[#454545] border-gray-600"
              }`}
            >
              <span className="text-sm font-semibold capitalize">{mode}</span>
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-700"></div>

        <button
          onClick={handleDownload}
          className="p-2 bg-[#3a3a3a] hover:bg-[#454545] border border-gray-600 rounded-lg transition-all"
          title="Modeli İndir"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>

        <div className="h-8 w-px bg-gray-700"></div>

        {/* Dosya İsmi Dinamik Hale Getirildi */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#3a3a3a] border border-gray-600 rounded-lg text-sm">
          <span className="font-medium text-gray-200">{file_url}</span>
          {/* Dosya boyutu dinamik gelmediği için şimdilik kaldırıldı veya prop olarak eklenebilir */}
        </div>

        <div className="h-8 w-px bg-gray-700"></div>

        <button
          disabled
          className="px-4 py-2 bg-[#2a2a2a] text-gray-600 border border-gray-700 rounded-lg cursor-not-allowed text-sm"
        >
          ÖNCEKİ
        </button>
        <button className="px-4 py-2 bg-[#3a3a3a] hover:bg-[#454545] text-gray-200 border border-gray-600 rounded-lg transition-all text-sm">
          SONRAKİ
        </button>
      </div>
    </div>
  );
}
