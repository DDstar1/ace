import * as THREE from "three";

const fragmentSphere = (sphereMesh, numPieces) => {
  const pieces = [];
  const originalGeometry = sphereMesh.geometry.clone();

  if (!originalGeometry.index) {
    console.error("Sphere geometry must have an index (faces defined).");
    return pieces;
  }

  const positionAttr = originalGeometry.attributes.position;
  const indexAttr = originalGeometry.index.array;

  for (let i = 0; i < numPieces; i++) {
    const pieceGeometry = new THREE.BufferGeometry();

    // Randomly pick a triangle face
    const faceIndex = Math.floor(Math.random() * (indexAttr.length / 3)) * 3;

    const indices = [
      indexAttr[faceIndex],
      indexAttr[faceIndex + 1],
      indexAttr[faceIndex + 2],
    ];

    const vertices = new Float32Array(9);
    for (let j = 0; j < 3; j++) {
      const vi = indices[j] * 3;
      vertices[j * 3] = positionAttr.array[vi];
      vertices[j * 3 + 1] = positionAttr.array[vi + 1];
      vertices[j * 3 + 2] = positionAttr.array[vi + 2];
    }

    pieceGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );

    const pieceMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      metalness: 0.5,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    const pieceMesh = new THREE.Mesh(pieceGeometry, pieceMaterial);

    // Store original position
    pieceMesh.userData.originalPosition = pieceMesh.position.clone();

    // Assign random outward movement for fragmentation
    pieceMesh.userData.fragmentDirection = new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    );

    pieces.push(pieceMesh);
  }

  return pieces;
};

export default fragmentSphere;
