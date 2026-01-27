import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";


const VaranoiShaderMaterial = shaderMaterial(
  { 
    uTime: 1.0,
    uResolution: new Vector2(),
    uMouse: new Vector2(),
  },
  // vertex shader
    /*glsl*/`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
    /*glsl*/`
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // --- noise from procedural pseudo-Perlin ---------
    float noise3( vec3 x ) {
        vec3 p = floor(x),f = fract(x);
        f = f*f*(3.-2.*f);
        #define hash3(p)  fract(sin(1e3*dot(p,vec3(1,57,-13.7)))*4375.5453)

        return mix( mix(mix( hash3(p+vec3(0,0,0)), hash3(p+vec3(1,0,0)),f.x),
                        mix( hash3(p+vec3(0,1,0)), hash3(p+vec3(1,1,0)),f.x),f.y),
                    mix(mix( hash3(p+vec3(0,0,1)), hash3(p+vec3(1,0,1)),f.x),
                        mix( hash3(p+vec3(0,1,1)), hash3(p+vec3(1,1,1)),f.x),f.y), f.z);
    }

    #define noise(x) (noise3(x)+noise3(x+11.5)) / 2.

    void main() {
        vec2 U = vUv * uResolution;
        vec2 R = uResolution.xy;
        float n = noise(vec3(U*8./R.y, .05*uTime)),
              v = sin(6.28*10.*n);

        v = smoothstep(1.,0., .5*abs(v)/fwidth(v));

        vec3 color1 = vec3(0.945, 0.788, 0.067);  // golden yellow
        vec3 color2 = vec3(1.0, 1.0, 1.0);        // white
        vec3 color3 = vec3(0.431, 0.486, 0.741);  // blue

        vec3 baseColor = .5+.5*sin(12.*n+vec3(0,2.1,-2.1));
        vec3 finalColor = mix(mix(color1, color2, baseColor.r), color3, baseColor.b);

        gl_FragColor = vec4(finalColor * v, v);
    }
  `
)

export default VaranoiShaderMaterial;


