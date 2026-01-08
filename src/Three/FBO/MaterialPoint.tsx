import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";


const MaterialPoint = shaderMaterial(
  { 
    uTexture: null,
    uTextureSize: new Vector2(),
    uTime: 0.0,
    uPositions: null,
    uRed: 1.0
  },
  // vertex shader
  /*glsl*/`
    uniform sampler2D uPositions;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uTextureSize;

    varying vec2 vUv;
    varying vec2 vPUv;

    void main() {
      vUv = uv;
      vPUv = position.xy;

      float ratioX = (128. / uTextureSize.x);
      float ratioY = (128. / uTextureSize.y);

      vec3 pos = texture2D(uPositions, position.xy).xyz;
      pos.x = (pos.x / ratioX);
      pos.y = (pos.y / ratioY);
      
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;

      gl_PointSize = 10.0;
      // Size attenuation;
      //gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform sampler2D uTexture;
    uniform float uRed;

    varying vec2 vUv;
    varying vec2 vPUv;

    void main() {
      //vec3 color = vec3(uRed, 0.53, 0.96);
      vec3 color = texture2D(uTexture,vPUv).rgb;
      gl_FragColor = vec4(color, 1.0);
    }  
  `
)

export default MaterialPoint;