"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import fragmentSphere from "./MoonUtils";

const MoonScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer,
      scene,
      camera,
      moon,
      sphere,
      controls,
      pieces = [];
    let isFragmenting = true;

    // Set up scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Grid and Axes Helpers
    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Load the moon GLB model
    const loader = new GLTFLoader();
    loader.load("/3d/Moon_1_3474.glb", function (gltf) {
      moon = gltf.scene;

      moon.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Scale and center the moon
      const box = new THREE.Box3().setFromObject(moon);
      const size = box.getSize(new THREE.Vector3());
      const scaleFactor = 5 / Math.max(size.x, size.y, size.z);
      moon.scale.set(scaleFactor, scaleFactor, scaleFactor);

      const center = box.getCenter(new THREE.Vector3());
      moon.position.sub(center);
      moon.position.set(-6, 0, 0); // Move it to the left

      scene.add(moon);
    });

    // Create a sphere beside the moon
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff3333,
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(6, 0, 0); // Move it to the right
    scene.add(sphere);

    // Animate fragmentation and defragmentation
    const toggleFragments = () => {
      if (isFragmenting) {
        // Fragment the sphere
        pieces = fragmentSphere(sphere, 1000);
        pieces.forEach((piece) => {
          scene.add(piece);
          // Move pieces outward
          piece.userData.targetPosition = piece.position
            .clone()
            .add(
              new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
              )
            );
        });
        scene.remove(sphere); // Hide original sphere
      } else {
        // Defragment: Move pieces back
        pieces.forEach((piece) => {
          piece.userData.targetPosition = new THREE.Vector3(6, 0, 0);
        });

        setTimeout(() => {
          // Remove all fragments and restore sphere
          pieces.forEach((piece) => scene.remove(piece));
          pieces = [];
          scene.add(sphere);
        }, 2000);
      }

      isFragmenting = !isFragmenting;
    };

    // Automatically toggle fragmentation every 5 seconds
    setInterval(toggleFragments, 5000);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth movement of fragments
      pieces.forEach((piece) => {
        if (piece.userData.targetPosition) {
          piece.position.lerp(piece.userData.targetPosition, 0.05);
        }
      });

      if (moon) moon.rotation.y += 0.001;
      if (sphere) sphere.rotation.y += 0.005;

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
