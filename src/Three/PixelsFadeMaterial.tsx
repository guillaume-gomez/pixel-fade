import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";


const PixelsFadeMaterial = shaderMaterial(
  { 
    uTexture: null,
    uTextureSize: new Vector2(),
    uTime: 0.0,
    uRandom: 1.0,
    uDepth: 2.0,
    uSize: 0.0,
    uRound: 0.0,
  },
  // vertex shader
  /*glsl*/`
    #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

        float random(float n) {
            return fract(sin(n) * 43758.5453123);
        }

        in vec3 iPosition;
        in float iAngle;
        out vec3 vPos;
        
        uniform vec2 uTextureSize;
        uniform sampler2D uTexture;
        uniform float uRandom;
        uniform float uTime;

        varying vec2 vUv;
        varying vec2 vPUv;

        void main(){
            vUv = uv;
            vec2 puv = iPosition.xy / uTextureSize;
            vPUv = puv;

            // scale pixel color
            vec4 colA = texture2D(uTexture, puv);
            float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

            vec3 p = position;
            p.x *= grey;
            p.y *= grey;
            p.z *= grey;


            vec3 finalPosition = vec3(p + iPosition);
            // center the material based on the texture
            finalPosition.x -= uTextureSize.x/2.;
            finalPosition.y -= uTextureSize.y/2.;
            finalPosition.z = sin(uTime * iAngle);

            
            vec4 pos = vec4(finalPosition, 1.0);
            vPos = iPosition;

            gl_Position = projectionMatrix * viewMatrix * pos;
        }
  `,
  // fragment shader
  /*glsl*/`
    precision highp float;

        uniform sampler2D uTexture;
        uniform float uRound;

        varying vec2 vUv;
        varying vec2 vPUv;
        
        in vec3 vPos;
        
        void main(){
            vec4 color = vec4(0.0);
            vec2 uv = vUv;
            vec2 puv = vPUv;

            // pixel color
            //vec3 colA = vec3(0.5, 0.0, 0.0);
            vec3 colA = texture2D(uTexture,puv).rgb;


            // circle
            float border = 0.1;
            float radius = uRound;
            float dist = radius - distance(uv, vec2(0.5));
            float t = smoothstep(0.0, border, dist);

            gl_FragColor = vec4(colA, t);
        }    
  `
)

export default PixelsFadeMaterial;