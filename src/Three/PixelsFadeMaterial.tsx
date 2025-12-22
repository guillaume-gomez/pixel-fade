import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";


const PixelsFadeMaterial = shaderMaterial(
  { 
    uTexture: null,
    uTextureSize: new Vector2(),
    uTime: 0.0,
    uRandom: 1.0,
    uDepth: 2.0,
    uSize: 1.0,
    uFbmAmplitude: 10.0,
    uFbmFrequency: 1.0,
    uFbmSpeed: 10.0,

  },
  // vertex shader
  /*glsl*/`
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 2D Value Noise - Based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners of the tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      // Smooth interpolation
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    uniform float uFbmAmplitude;
    uniform float uFbmFrequency;

    #define OCTAVES 6

    // Fractal Brownian Motion - layered noise for natural variation
    float fbm(vec2 st, int octaves) {
      float value = 0.0;
      float amplitude = uFbmAmplitude;
      float frequency = uFbmFrequency;
      vec2 shift = vec2(100.0, 100.0);

      // Rotation matrix to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

      for (int i = 0; i < OCTAVES; i++) {
        if (i >= octaves) break;
        value += amplitude * noise(st * frequency);
        st = rot * st * 2.0 + shift;
        amplitude *= 0.5;
        frequency *= 2.0; 
      }

      return value;
    }

    uniform float uFbmSpeed;
    // Curl Noise
    vec2 curlNoise(vec2 st, float time) {
      float eps = uFbmSpeed;

      // Sample FBM at offset positions
      float n1 = fbm(st + vec2(eps, 0.0) + time * 0.1, 4);
      float n2 = fbm(st + vec2(-eps, 0.0) + time * 0.1, 4);
      float n3 = fbm(st + vec2(0.0, eps) + time * 0.1, 4);
      float n4 = fbm(st + vec2(0.0, -eps) + time * 0.1, 4);

      // Calculate curl (perpendicular to gradient)
      float dx = (n1 - n2) / (2.0 * eps);
      float dy = (n3 - n4) / (2.0 * eps);

      return vec2(dy, -dx);
    }

    #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

    in vec3 iPosition;
    in float iAngle;
    out vec3 vPos;
    
    uniform vec2 uTextureSize;
    uniform sampler2D uTexture;
    uniform float uRandom;
    uniform float uTime;
    uniform float uSize;

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
        p.x *= (grey * uSize);
        p.y *= (grey * uSize);
        p.z *= (grey * uSize);

        // curl noise to move tile
        vec2 noise = curlNoise(puv, uTime);

        vec3 finalPosition = vec3(p + iPosition);
        // center the material based on the texture
        finalPosition.x += -uTextureSize.x/2. + iAngle * noise.x;
        finalPosition.y += -uTextureSize.y/2. + iAngle * noise.y;
        finalPosition.z += sin(uTime * iAngle);

        
        vec4 pos = vec4(finalPosition, 1.0);
        vPos = iPosition;

        gl_Position = projectionMatrix * viewMatrix * pos;
    }
  `,
  // fragment shader
  /*glsl*/`
    precision highp float;

        uniform sampler2D uTexture;
        
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

            float t = 1.0;

            gl_FragColor = vec4(colA, t);
        }    
  `
)

export default PixelsFadeMaterial;