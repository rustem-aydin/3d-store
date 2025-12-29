"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileCode,
} from "lucide-react";
import { getPreviewUrl } from "@/helpers/get-product-files";

interface FileData {
  id: string;
  file_url: string;
  file_name: string;
  file_size: string;
  file_type: string;
  product_id: string;
}

export default function STLViewer({ urls = [] }: { urls: FileData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSignedUrl, setActiveSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentFile = useMemo(
    () => urls[currentIndex] || null,
    [urls, currentIndex]
  );

  // URL Çözümleme
  useEffect(() => {
    async function resolveUrl() {
      if (!urls || urls.length === 0) {
        setError("Dosya bulunamadı.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const activeItem = urls[currentIndex];

        if (!activeItem?.file_url) {
          throw new Error("Geçersiz dosya URL'i");
        }

        const signedUrl = await getPreviewUrl(activeItem);

        if (!signedUrl) {
          throw new Error("İmzalı URL alınamadı");
        }

        setActiveSignedUrl(signedUrl);
      } catch (err: any) {
        console.error("URL çözümleme hatası:", err);
        setError(err.message || "Model dosyası yüklenemedi.");
        setLoading(false);
      }
    }

    resolveUrl();
  }, [currentIndex, urls]);

  // Three.js Sahne Kurulumu
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Işıklandırma
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);
    scene.add(camera);

    // Animasyon döngüsü
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        meshRef.current.rotation.z += 0.005;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Responsive resize
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element zaten kaldırılmış olabilir
        }
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Model Yükleme
  useEffect(() => {
    if (!sceneRef.current || !activeSignedUrl) return;

    // Eski mesh'i temizle
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      if (meshRef.current.geometry) meshRef.current.geometry.dispose();
      if (meshRef.current.material) {
        if (Array.isArray(meshRef.current.material)) {
          meshRef.current.material.forEach((mat) => mat.dispose());
        } else {
          meshRef.current.material.dispose();
        }
      }
      meshRef.current = null;
    }

    const loader = new STLLoader();

    loader.load(
      activeSignedUrl,
      (geometry) => {
        try {
          // Geometriyi merkezle
          geometry.center();
          geometry.computeBoundingBox();
          geometry.computeVertexNormals();

          if (!geometry.boundingBox) {
            throw new Error("Bounding box hesaplanamadı");
          }

          // Ölçeklendirme
          const bbox = geometry.boundingBox;
          const maxDim = Math.max(
            bbox.max.x - bbox.min.x,
            bbox.max.y - bbox.min.y,
            bbox.max.z - bbox.min.z
          );

          const scale = 45 / maxDim;
          geometry.scale(scale, scale, scale);

          // Material ve mesh oluştur
          const material = new THREE.MeshPhongMaterial({
            color: 0x9333ea,
            specular: 0x111111,
            shininess: 100,
            flatShading: false,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = -Math.PI / 2;

          sceneRef.current?.add(mesh);
          meshRef.current = mesh;

          setLoading(false);
          setError(null);
        } catch (err: any) {
          console.error("Geometri işleme hatası:", err);
          setError("Model işlenirken hata oluştu.");
          setLoading(false);
        }
      },
      (progressEvent) => {
        // İsteğe bağlı: yükleme ilerlemesi
        if (progressEvent.lengthComputable) {
          const percentComplete =
            (progressEvent.loaded / progressEvent.total) * 100;
          console.log(`Yükleme: ${percentComplete.toFixed(2)}%`);
        }
      },
      (err) => {
        console.error("STL yükleme hatası:", err);
        setError("Model yüklenirken hata oluştu. Dosya bozuk olabilir.");
        setLoading(false);
      }
    );
  }, [activeSignedUrl]);

  if (!urls || urls.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
        <div className="text-center text-white/60">
          <AlertCircle className="mx-auto mb-2" size={32} />
          <p className="text-sm">Görüntülenecek dosya yok</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white">
          <Loader2 className="animate-spin text-purple-500 mb-2" size={32} />
          <span className="text-xs font-bold uppercase tracking-tighter">
            {currentFile?.file_name || "Hazırlanıyor..."}
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-md text-white p-4">
          <AlertCircle className="mb-2 text-red-500" size={32} />
          <p className="text-sm font-medium text-center">{error}</p>
        </div>
      )}

      {/* Metadata Bilgisi (Sol Alt) */}
      {currentFile && (
        <div className="absolute bottom-4 left-4 z-40 bg-black/60 border border-white/10 p-2 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white">
            <FileCode size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase">
              {currentFile.file_name}
            </span>
          </div>
          <p className="text-[9px] text-gray-400 ml-6 uppercase">
            {currentFile.file_size} • {currentFile.file_type}
          </p>
        </div>
      )}

      {/* Navigasyon (Üst Sol) */}
      {urls.length > 1 && (
        <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-black/60 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          <button
            onClick={() =>
              setCurrentIndex((p) => (p - 1 + urls.length) % urls.length)
            }
            className="p-1 text-white/50 hover:text-white transition-colors disabled:opacity-30"
            disabled={loading}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-white text-[10px] font-bold px-2">
            DOSYA {currentIndex + 1}/{urls.length}
          </span>
          <button
            onClick={() => setCurrentIndex((p) => (p + 1) % urls.length)}
            className="p-1 text-white/50 hover:text-white transition-colors disabled:opacity-30"
            disabled={loading}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
