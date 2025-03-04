import * as THREE from "three";

export const uniforms = {
  mousePosition: { value: new THREE.Vector2(0.0, 0.0) },
  lightPosition: { value: new THREE.Vector3(1, 1, 2) },
};

export const vertexShader = `
  uniform vec2 mousePosition;
  uniform vec3 lightPosition;
  attribute vec3 color;
  attribute vec3 displacement;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vLightPosition;
  void main() {
    vNormal = normal;
    vColor = color;
    vLightPosition = lightPosition;
    float dist = min(0.05 - distance(position.xy, mousePosition) * 0.1, 0.0);
    vec3 newPosition = position + normal * dist * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  }
`;

export const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vColor;
  varying vec3 vLightPosition;
  void main() {
    const float ambient = 0.1;
    vec3 light = normalize(vLightPosition);
    float directional = max(dot(vNormal, light), 0.0);
    gl_FragColor = vec4((directional + ambient) * vColor, 1.0);
  }
`;
