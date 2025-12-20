import React, { useMemo, useRef } from "react";
import { useLoader, useFrame, extend } from '@react-three/fiber';
import {
    SphereGeometry,
    PlaneGeometry,
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Vector2,
    TextureLoader
} from "three";
import PixelsFadeMaterial from "./PixelsFadeMaterial";

extend({ PixelsFadeMaterial })

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
    const mesh = useRef();
    const [texture] = useLoader(TextureLoader, [base64Texture]);
    const numInstances = width * height;

    console.log(numInstances);

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
    }, [base64Texture, width, height]);

    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    console.log(width, height)


    return (
        <mesh ref={mesh}>
            <instancedBufferGeometry
                instanceCount={numInstances}
                index={objectData.index}
                attributes={objectData.attribs}
            />
            <pixelsFadeMaterial
                uTexture={texture}
                uTextureSize={new Vector2(width, height)}
                uRound={config.round}
            />
        </mesh>
    )
}