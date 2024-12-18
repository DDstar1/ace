"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const MoonScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer, scene, camera, moon, sphere;

    // Set up scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enabled = true;
    controls.enableDamping = true;
    // controls.dampingFactor = 0.05;
    // controls.minDistance = 0.1;
    // controls.maxDistance = 100;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.autoRotate = false;
    // controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
    // controls.minPolarAngle = 0;

    // Add transform controls
    const transformControls = new TransformControls(
      camera,
      renderer.domElement
    );
    // scene.add(transformControls);

    // Load moon texture
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load("/3d/moon-texture.jpg");

    // Create a sphere for the moon
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      metalness: 0.0,
      roughness: 1.0,
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Attach transform controls to the sphere
    // transformControls.attach(sphere);

    // Load the moon model
    // const loader = new GLTFLoader();
    // loader.load("/3d/Moon_1_3474.glb", function (gltf) {
    //   moon = gltf.scene;
    //   moon.scale.set(2, 2, 2);
    //   moon.position.set(3, 0, 0);
    //   scene.add(moon);
    // });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.005;

      // Rotate the sphere only when not dragging
      // if (!transformControls.dragging) {
      // }

      // Rotate moon if loaded
      // if (moon) {
      //   moon.rotation.y += 0.005;
      // }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default MoonScene;
