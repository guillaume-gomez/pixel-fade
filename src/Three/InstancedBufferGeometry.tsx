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

    // const objectData = useMemo(() => {
    //     const data = init(numInstances);
    //     return data;
    // }, [width, height]);

    // function init(numPoints: number) {
    //     const geometry = new InstancedBufferGeometry();
        
    //     // positions
    //     const positions = new BufferAttribute(new Float32Array(4 * 3), 3);
    //     positions.setXYZ(0, -0.5, 0.5, 0.0);
    //     positions.setXYZ(1, 0.5, 0.5, 0.0);
    //     positions.setXYZ(2, -0.5, -0.5, 0.0);
    //     positions.setXYZ(3, 0.5, -0.5, 0.0);
        
    //     // uvs
    //     const uvs = new BufferAttribute(new Float32Array(4 * 2), 2);
    //     uvs.setXYZ(0, 0.0, 0.0);
    //     uvs.setXYZ(1, 1.0, 0.0);
    //     uvs.setXYZ(2, 0.0, 1.0);
    //     uvs.setXYZ(3, 1.0, 1.0);

    //     // index
    //     const indexes = new BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1);

    //     const indices = new Uint16Array(numPoints);
    //     const offsets = new Float32Array(numPoints * 3);
    //     const angles = new Float32Array(numPoints);

    //     for (let i = 0; i < numPoints; i++) {
    //         offsets[i * 3 + 0] = i % width;
    //         offsets[i * 3 + 1] = Math.floor(i / width);

    //         indices[i] = i;

    //         angles[i] = Math.random() * Math.PI;
    //     }
    //     //geometry.addAttribute('position', positions);
    //     //geometry.addAttribute('uv', uvs);
    //     //geometry.addAttribute('pindex', new InstancedBufferAttribute(indices, 1, false));
    //     //geometry.addAttribute('offset', new InstancedBufferAttribute(offsets, 3, false));
    //     //geometry.addAttribute('angle', new InstancedBufferAttribute(angles, 1, false));

    //     const ipositions = new InstancedBufferAttribute(positions, 3);
    //     const iscales = new InstancedBufferAttribute(new Int8Array([0.5]), 1);
    //     const pIndex



    //     return {
    //         index: indexes,
    //         attribs: {
    //             iPosition: positions,
    //             iScale: iscales,
    //             uvs,
    //             //...sphere.attributes
    //         }
    //     }
    // }

     const {
        dimensions = 3,
        packAttempts = 500,
        minRadius = 0.05,
        maxRadius = 0.5,
        padding = 0.0025,
        widthSegments = 1,
        heightSegments = 1
    } = props;

    // Builds instanced data for the packing
    const objectData = useMemo(() => {
        let plane = new PlaneGeometry(1, 1, widthSegments, heightSegments);
        console.log(plane.attributes)
        // setup arrays
        let positions = new Float32Array(numInstances * 3);
        let scales = new Float32Array(numInstances);
        let angles = new Float32Array(numInstances);

        // Build per-instance attributes. 
        let count = 0
        for(let i= 0; i < numInstances; i++) {
            positions[count] = i % width;
            positions[count + 1] = Math.floor(i / width);;
            positions[count + 2] = 0//randomInteger(-2, 2);

            scales[i] = Math.random();
            angles[i] = Math.random() * Math.PI;

            count += 3 
        }

        const ipositions = new InstancedBufferAttribute(positions, 3);
        const iscales = new InstancedBufferAttribute(scales, 1);
        const iAngles = new InstancedBufferAttribute(angles, 1);
        
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

    console.log(uniforms)


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