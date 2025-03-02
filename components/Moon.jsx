"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const MoonScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer, scene, camera, moon, controls;

    // Set up scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.7);
    secondaryLight.position.set(-5, 2, -5);
    scene.add(secondaryLight);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 100;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.autoRotate = false;

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Load the moon GLB model
    const loader = new GLTFLoader();
    loader.load(
      "/3d/Moon_1_3474.glb",
      function (gltf) {
        moon = gltf.scene;

        // Ensure all materials are set up properly
        moon.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.side = THREE.DoubleSide;
              child.material.transparent = false;
              child.material.needsUpdate = true;

              if (child.material.map) {
                child.material.map.anisotropy =
                  renderer.capabilities.getMaxAnisotropy();
              }

              child.castShadow = true;
              child.receiveShadow = true;
            }
          }
        });

        // Properly scale the model
        const box = new THREE.Box3().setFromObject(moon);
        const size = box.getSize(new THREE.Vector3());
        const scaleFactor = 5 / Math.max(size.x, size.y, size.z);
        moon.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Center the model
        const center = box.getCenter(new THREE.Vector3());
        moon.position.sub(center);

        scene.add(moon);

        console.log("Model loaded successfully");
        console.log("Model size:", size);
        console.log("Camera position:", camera.position);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("An error occurred while loading the model:", error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (moon) moon.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MoonScene;
