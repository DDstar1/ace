"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loadModel } from "../lib/loadHeadModel";
import { createSplitSphere } from "@/lib/brokenSphere";
import { uniforms } from "../lib/shaders";

const MoonScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Color: white, Intensity: 0.5
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5); // Light source position
    scene.add(directionalLight);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 50);
    gridHelper.position.y = -2; // Adjust the height of the grid
    scene.add(gridHelper);

    // Load 3D model
    loadModel(scene, new THREE.Vector3(1, 2, 3), 1.5);
    createSplitSphere(scene, new THREE.Vector3(2, 1, 0), 1.5);

    // Mouse movement tracking
    const pointerPos = new THREE.Vector2();
    window.addEventListener("mousemove", (evt) => {
      pointerPos.set(
        (evt.clientX / window.innerWidth) * 2 - 1,
        -(evt.clientY / window.innerHeight) * 2 + 1
      );
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.mousePosition.value.copy(pointerPos);
      renderer.render(scene, camera);
      controls.update();
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default MoonScene;
