import React, {useMemo} from "react";
import { useLoader } from '@react-three/fiber';
import {
    SphereGeometry,
    PlaneGeometry,
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Vector2,
    TextureLoader
} from "three";

function randomInteger(min: number, max: number) {
   return Math.random() * (max - min) + min;
}

export interface Config {
    round: float;
}

interface instancedBufferGeometryProps {
    width: number;
    height: number;
    base64Texture: string;
    config: Config;
}

export default function instancedBufferGeometry({
    width,
    height,
    base64Texture,
    config,
} : instancedBufferGeometryProps) {
    const [texture] = useLoader(TextureLoader, [base64Texture]);
    const numInstances = width * height;

    // Builds instanced data for the packing
    const objectData = useMemo(() => {
        const widthSegments = 1;
        const heightSegments = 1;
        // setup buffer geometry
        let plane = new PlaneGeometry(1, 1, widthSegments, heightSegments);
        
        // setup arrays
        let positionsArray = new Float32Array(numInstances * 3);
        let anglesArray = new Float32Array(numInstances);
        let indicesArray = new Uint16Array(numInstances);

        // Build per-instance attributes. 
        let count = 0
        for(let i= 0; i < numInstances; i++) {
            positionsArray[count] = (i % width);
            positionsArray[count + 1] = (Math.floor(i / width));
            positionsArray[count + 2] = 0;//randomInteger(-2, 2);

            anglesArray[i] = Math.random() * Math.PI;
            indicesArray[i] = i;

            count += 3 
        }

        const positions = new InstancedBufferAttribute(positionsArray, 3);
        const angles = new InstancedBufferAttribute(anglesArray, 1);
        const indices = new InstancedBufferAttribute(indicesArray, 1);
        
        return {
            index: plane.index,
            attribs: {
                iPosition: positions,
                iAngle: angles,
                ...plane.attributes
            }
        }
    }, [texture, config])

    const uniforms = {
        uTime: { value: 0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 2.0 },
        uSize: { value: 0.0 },
        uRound: { value: 0.8 },
        uTextureSize: { value: new Vector2(width, height) },
        uTexture: { value: texture },
    };

    const vertex = `
    
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

            
            vec4 pos = vec4(finalPosition, 1.0);
            vPos = iPosition;

            gl_Position = projectionMatrix * viewMatrix * pos;
        }
    `

    const fragment = `
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

    return (
        <mesh>
            <instancedBufferGeometry
                instanceCount={numInstances}
                index={objectData.index}
                attributes={objectData.attribs}
            />
            <shaderMaterial
                uRound={config.round}
                uTextureSize={ new Vector2(width, height) }
                uTexture={texture}

                uniforms={uniforms}
                vertexShader={vertex}
                fragmentShader={fragment}/>
        </mesh>
    )
}