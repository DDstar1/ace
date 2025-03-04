import * as THREE from "three";

export function createSplitSphere(
  scene,
  position = new THREE.Vector3(0, 0, 0),
  scale = 1,
  maxSeparation = 2
) {
  const numSections = 100; // Equal 7 parts
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const sectionGeometries = Array.from(
    { length: numSections },
    () => new THREE.BufferGeometry()
  );

  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  const sectionVertices = Array.from({ length: numSections }, () => []);
  const sectionIndices = Array.from({ length: numSections }, () => []);
  const vertexMaps = Array.from({ length: numSections }, () => new Map());
  const sectionCounts = Array(numSections).fill(0);

  function getSectionIndex(x, y, z) {
    // Partition space into 7 equal regions
    const angle = Math.atan2(y, x) + Math.PI; // Angle-based partition
    return Math.floor((angle / (2 * Math.PI)) * numSections) % numSections;
  }

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i],
      b = indices[i + 1],
      c = indices[i + 2];

    const va = vertices.slice(a * 3, a * 3 + 3);
    const vb = vertices.slice(b * 3, b * 3 + 3);
    const vc = vertices.slice(c * 3, c * 3 + 3);

    // Ensure balanced splitting
    const sectionIndex =
      (getSectionIndex(...va) +
        getSectionIndex(...vb) +
        getSectionIndex(...vc)) %
      numSections;

    [a, b, c].forEach((v) => {
      if (!vertexMaps[sectionIndex].has(v)) {
        vertexMaps[sectionIndex].set(v, sectionCounts[sectionIndex]++);
        sectionVertices[sectionIndex].push(
          vertices[v * 3],
          vertices[v * 3 + 1],
          vertices[v * 3 + 2]
        );
      }
    });

    sectionIndices[sectionIndex].push(
      vertexMaps[sectionIndex].get(a),
      vertexMaps[sectionIndex].get(b),
      vertexMaps[sectionIndex].get(c)
    );
  }

  const colors = ["red", "blue", "green", "yellow", "purple", "orange", "cyan"];
  const meshes = [];

  for (let i = 0; i < numSections; i++) {
    sectionGeometries[i].setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sectionVertices[i], 3)
    );
    sectionGeometries[i].setIndex(sectionIndices[i]);
    sectionGeometries[i].computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(sectionGeometries[i], material);
    scene.add(mesh);
    meshes.push(mesh);
  }

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);

    time += 0.02;
    const separation = Math.abs(Math.sin(time) * maxSeparation);

    for (let i = 0; i < numSections; i++) {
      const angle = (i / numSections) * Math.PI * 2;
      meshes[i].position.set(
        position.x + Math.cos(angle) * separation * scale,
        position.y + Math.sin(angle) * separation * scale,
        position.z + Math.sin(angle * 2) * separation * scale
      );
    }
  }

  animate();
}
