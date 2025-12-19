import React, {useMemo} from "react";
import { useLoader } from '@react-three/fiber';
import {
    SphereGeometry,
    GLSL3,
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Vector2,
    PlaneGeometry,
    TextureLoader
} from "three";

function randomInteger(min: number, max: number) {
   return Math.random() * (max - min) + min;
}

interface instancedBufferGeometryProps {
    width: number;
    height: number;
    base64Texture: string
}

export default function instancedBufferGeometry({width, height, base64Texture, ...props} : instancedBufferGeometryProps) {
    const [texture] = useLoader(TextureLoader, [base64Texture]);
    const numInstances = width * height;

    // Builds instanced data for the packing
    const objectData = useMemo(() => {
        const widthSegments = 1;
        const heightSegments = 1;

        let plane = new PlaneGeometry(1, 1, widthSegments, heightSegments);
        
        // setup arrays
        let positions = new Float32Array(numInstances * 3);
        let scales = new Float32Array(numInstances);
        let angles = new Float32Array(numInstances);
        let indicesArray = new Uint16Array(numInstances);

        // Build per-instance attributes. 
        let count = 0
        for(let i= 0; i < numInstances; i++) {
            positions[count] = i % width;
            positions[count + 1] = Math.floor(i / width);;
            positions[count + 2] = 0//randomInteger(-2, 2);

            scales[i] = Math.random();
            angles[i] = Math.random() * Math.PI;
            indicesArray[i] = i;

            count += 3 
        }

        const ipositions = new InstancedBufferAttribute(positions, 3);
        const iscales = new InstancedBufferAttribute(scales, 1);
        const iAngles = new InstancedBufferAttribute(angles, 1);
        const indices = new InstancedBufferAttribute(indicesArray, 1);
        
        return {
            index: plane.index,
            attribs: {
                iPosition: ipositions,
                iScale: iscales,
                iAngles: iAngles,
                ...plane.attributes
            }
        }
    }, [])

    const uniforms = {
        uTime: { value: 0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 2.0 },
        uSize: { value: 0.0 },
        uTextureSize: { value: new Vector2(width, height) },
        uTexture: { value: texture },
        uTouch: { value: null },
    };

    const vertex = `
    
        in vec3 iPosition;
        in float iScale;
        out float vScale;
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

            // pixel color
            vec4 colA = texture2D(uTexture, puv);
            float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

            vec3 p = position;
            p.x *= grey;
            p.y *= grey;
            p.z *= grey;
            
            vec4 pos = vec4(p + iPosition,1.);
            vPos = iPosition;
            vScale = iScale;
            gl_Position = projectionMatrix * viewMatrix * pos;
        }
    `

    const fragment = `
        precision highp float;

        uniform sampler2D uTexture;

        varying vec2 vUv;
        varying vec2 vPUv;
        
        in float vScale;
        in vec3 vPos;
        
        void main(){
            vec4 color = vec4(0.0);
            vec2 uv = vUv;
            vec2 puv = vPUv;

            // pixel color
            //vec3 colA = vec3(vScale, 0.0, 0.0);
            vec3 colA = texture2D(uTexture,puv).rgb;
            gl_FragColor = vec4(colA, 1.0);
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
                uniforms={uniforms}
                vertexShader={vertex}
                fragmentShader={fragment}/>
        </mesh>
    )
}