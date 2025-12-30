"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlobeLogoWithText() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const size = 50;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 13;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Çizgisel Küre
    const wireframeGeometry = new THREE.SphereGeometry(5, 18, 18);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3a86ff,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeGlobe);

    // İç Dolgu
    const innerGeometry = new THREE.SphereGeometry(4.8, 24, 24);
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
    });
    const innerGlobe = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerGlobe);

    // Atmosferik Parlama
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
     uniform vec3 glowColor;
     varying vec3 vNormal;
     void main() {
       float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
       gl_FragColor = vec4(glowColor, 0.6) * intensity;
     }
    `;
    const atmosphereGeometry = new THREE.SphereGeometry(5.4, 24, 24);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0x3a86ff) },
      },
    });
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    scene.add(atmosphereMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const colors = [
      new THREE.Color(0x3a86ff),
      new THREE.Color(0x8338ec),
      new THREE.Color(0xff006e),
    ];
    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorT = 0;

    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      colorT += 0.007;
      if (colorT >= 1) {
        colorT = 0;
        colorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % colors.length;
      }

      const currentColor = new THREE.Color().lerpColors(
        colors[colorIndex],
        colors[nextColorIndex],
        colorT
      );
      wireframeMaterial.color = currentColor;
      atmosphereMaterial.uniforms.glowColor.value = currentColor;

      wireframeGlobe.rotation.y += 0.012;
      innerGlobe.rotation.y += 0.012;
      atmosphereMesh.rotation.y += 0.006;

      renderer.render(scene, camera);
      return animationId;
    };

    const id = animate();

    return () => {
      cancelAnimationFrame(id);
      mountRef.current?.removeChild(renderer.domElement);
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "50px", height: "50px" }}
      className="flex-shrink-0"
    />
  );
}
