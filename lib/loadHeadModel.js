import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { uniforms, vertexShader, fragmentShader } from "./shaders";

export function loadModel(
  scene,
  position = new THREE.Vector3(0, 0, 0),
  scale = 2.0
) {
  new OBJLoader().load("/3d/head.obj", (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        const geometry = child.geometry;
        geometry.center();

        const numFaces = geometry.attributes.position.count / 3;
        const colors = new Float32Array(numFaces * 3 * 3);
        const displacement = new Float32Array(numFaces * 3 * 3);
        const color = new THREE.Color();

        for (let f = 0; f < numFaces; f++) {
          const index = 9 * f;
          let lightness = 0.3 + Math.random() * 0.7;
          color.setHSL(0.0, 1.0, lightness);
          let d = 10 * (0.5 - Math.random());
          for (let i = 0; i < 3; i++) {
            colors[index + 3 * i] = color.r;
            colors[index + 3 * i + 1] = color.g;
            colors[index + 3 * i + 2] = color.b;
            displacement[index + 3 * i] = d;
            displacement[index + 3 * i + 1] = d;
            displacement[index + 3 * i + 2] = d;
          }
        }

        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute(
          "displacement",
          new THREE.BufferAttribute(displacement, 3)
        );

        const shaderMaterial = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, shaderMaterial);
        mesh.position.copy(position); // Set position
        mesh.scale.setScalar(scale); // Set scale
        scene.add(mesh);
      }
    });
  });
}
