import * as THREE from "three";

export function createSplitSphere(
  scene,
  position = new THREE.Vector3(0, 0, 0),
  scale = 1,
  separation = 0.5 // Controls how far apart the halves move
) {
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const topGeometry = new THREE.BufferGeometry();
  const bottomGeometry = new THREE.BufferGeometry();

  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  const topVertices = [];
  const bottomVertices = [];
  const topIndices = [];
  const bottomIndices = [];

  const vertexMap = new Map();
  let topCount = 0,
    bottomCount = 0;

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i],
      b = indices[i + 1],
      c = indices[i + 2];

    const va = vertices.slice(a * 3, a * 3 + 3);
    const vb = vertices.slice(b * 3, b * 3 + 3);
    const vc = vertices.slice(c * 3, c * 3 + 3);

    const isTop = va[1] >= 0 && vb[1] >= 0 && vc[1] >= 0;
    const isBottom = va[1] < 0 && vb[1] < 0 && vc[1] < 0;

    if (isTop) {
      [a, b, c].forEach((v) => {
        if (!vertexMap.has(v)) {
          vertexMap.set(v, topCount++);
          topVertices.push(
            vertices[v * 3],
            vertices[v * 3 + 1],
            vertices[v * 3 + 2]
          );
        }
      });
      topIndices.push(vertexMap.get(a), vertexMap.get(b), vertexMap.get(c));
    } else if (isBottom) {
      [a, b, c].forEach((v) => {
        if (!vertexMap.has(v)) {
          vertexMap.set(v, bottomCount++);
          bottomVertices.push(
            vertices[v * 3],
            vertices[v * 3 + 1],
            vertices[v * 3 + 2]
          );
        }
      });
      bottomIndices.push(vertexMap.get(a), vertexMap.get(b), vertexMap.get(c));
    }
  }

  topGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(topVertices, 3)
  );
  topGeometry.setIndex(topIndices);
  topGeometry.computeVertexNormals();

  bottomGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(bottomVertices, 3)
  );
  bottomGeometry.setIndex(bottomIndices);
  bottomGeometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: "blue",
    wireframe: false,
    side: THREE.DoubleSide,
  });

  const topMesh = new THREE.Mesh(topGeometry, material);
  const bottomMesh = new THREE.Mesh(bottomGeometry, material);

  // Apply position and scale
  topMesh.position
    .copy(position)
    .add(new THREE.Vector3(0, separation * scale, 0)); // Move up
  bottomMesh.position
    .copy(position)
    .add(new THREE.Vector3(0, -separation * scale, 0)); // Move down
  topMesh.scale.setScalar(scale);
  bottomMesh.scale.setScalar(scale);

  scene.add(topMesh);
  scene.add(bottomMesh);
}
