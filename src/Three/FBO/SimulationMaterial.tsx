import { DataTexture, ShaderMaterial, RGBAFormat, FloatType, MathUtils } from "three";

const vertexShader = /*glsl*/
`varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}`;

const fragmentShader = /*glsl*/
`
uniform sampler2D positionsA;
uniform sampler2D positionsB;
uniform float uTime;
uniform float uFrequency;

varying vec2 vUv;

void main() {
  float time = sin(uTime);

  vec3 positionStart = texture2D(positionsA, vUv).rgb;
  vec3 positionEnd = texture2D(positionsB, vUv).rgb;

  vec3 pos = mix(positionStart, positionEnd, time);

  gl_FragColor = vec4(pos, 1.0);
}
`;

const getPositionStart = (width, height) => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  const length = width * height * 4 
  const data = new Float32Array(length);
    
  for (let i = 0; i < length; i++) {
    const stride = i * 4;

    data[stride] = (i % width);
    data[stride + 1] = (Math.floor(i / width));
    data[stride + 2] = 0;
    data[stride + 3] =  1.0; // this value will not have any impact
  }
  
  return data;
}

const getPositionEnd = (width, height) => {
  var len = width * height * 4;
  var data = new Float32Array(len);

  for (let i = 0; i < data.length; i++) {
    const stride = i * 4;

    data[stride] = (i % width);
    data[stride + 1] = (Math.floor(i / width));
    data[stride + 2] = Math.random() * 10.;
    data[stride + 3] =  1.0; // this value will not have any impact
  }
  return data;
};

class SimulationMaterial extends ShaderMaterial {
  constructor(size) {
    const positionsTextureA = new DataTexture(
      getPositionStart(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    positionsTextureA.needsUpdate = true;

    const positionsTextureB = new DataTexture(
      getPositionEnd(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    );
    positionsTextureB.needsUpdate = true;

    const simulationUniforms = {
      positionsA: { value: positionsTextureA },
      positionsB: { value: positionsTextureB },
      uFrequency: { value: 0.25 },
      uTime: { value: 0 },
    };

    super({
      uniforms: simulationUniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default SimulationMaterial;
