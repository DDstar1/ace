import * as THREE from "three";

const fragmentSphere = (sphereMesh) => {
  if (!sphereMesh.geometry.index) {
    console.error("Sphere geometry must have an index.");
    return [];
  }

  const geometry = sphereMesh.geometry;
  const positionAttr = geometry.attributes.position;
  const indexAttr = geometry.index.array;
  const fragments = [];

  for (let i = 0; i < indexAttr.length; i += 3) {
    const pieceGeometry = new THREE.BufferGeometry();

    // Get the 3 vertices for this triangle
    const indices = [indexAttr[i], indexAttr[i + 1], indexAttr[i + 2]];
    const vertices = new Float32Array(9); // 3 vertices * 3 coords (x,y,z)

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

    // Semi-transparent material for fade effect
    const pieceMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      metalness: 0.5,
      roughness: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0, // Starts fully visible
    });

    const pieceMesh = new THREE.Mesh(pieceGeometry, pieceMaterial);

    // Positioning the fragment at the original sphere's location
    pieceMesh.position.copy(sphereMesh.position);

    // Store original position for defragmentation
    pieceMesh.userData.originalPosition = pieceMesh.position.clone();

    // Store target position for outward movement (random offset)
    pieceMesh.userData.targetPosition = new THREE.Vector3(
      pieceMesh.position.x + (Math.random() - 0.5) * 5,
      pieceMesh.position.y + (Math.random() - 0.5) * 5,
      pieceMesh.position.z + (Math.random() - 0.5) * 5
    );

    // Fragment starts at full opacity
    pieceMesh.userData.fadingOut = false;
    pieceMesh.userData.fadingIn = false;

    fragments.push(pieceMesh);
  }

  return fragments;
};

export default fragmentSphere;
