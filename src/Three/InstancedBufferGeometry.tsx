import React, { useMemo, useRef, forwardRef, useEffect } from "react";
import { useLoader, useFrame, extend } from '@react-three/fiber';
import {
    SphereGeometry,
    PlaneGeometry,
    CircleGeometry,
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    BufferGeometry,
    Vector2,
    Vector3,
    Box3,
    BoxHelper,
    TextureLoader
} from "three";
import { useHelper } from '@react-three/drei';
import PixelsFadeMaterial from "./PixelsFadeMaterial";
import RoundedPlane from "./RoundedPlane";


extend({ PixelsFadeMaterial })


type GeometryType = "rounded"|"rectangle"|"circle";

export interface Config {
    fbmAmplitude: float;
    fbmFrequency: float;
    fbmSpeed: float;
    size: float;
    optimised: boolean;
    geometryType: GeometryType;
}

interface instancedBufferGeometryProps {
    width: number;
    height: number;
    base64Texture: string;
    config: Config;
    ref: any;
}

export default forwardRef(function instancedBufferGeometry({
    width,
    height,
    base64Texture,
    config,
} : instancedBufferGeometryProps, ref) {
    //useHelper(ref, BoxHelper, 'red');
    const [texture] = useLoader(TextureLoader, [base64Texture]);
    
    const maxNumberOfInstances = width * height;
    
    // Builds instanced data for the packing
    const objectData = useMemo(() => {
        
        // setup buffer geometry
        let geometry = pickGeometry(config.geometryType)
        
        // setup arrays
        let positionsArray = new Float32Array(maxNumberOfInstances * 3);
        let anglesArray = new Float32Array(maxNumberOfInstances);
        let indicesArray = new Uint16Array(maxNumberOfInstances);

        // Build per-instance attributes. 
        let count = 0
        for(let i = 0; i < maxNumberOfInstances; i++) {
            positionsArray[count] = (i % width);
            positionsArray[count + 1] = (Math.floor(i / width));
            positionsArray[count + 2] = 0;

            anglesArray[i] = Math.random() * Math.PI;
            indicesArray[i] = i;

            count += 3 
        }

        const positions = new InstancedBufferAttribute(positionsArray, 3);
        const angles = new InstancedBufferAttribute(anglesArray, 1);
        const indices = new InstancedBufferAttribute(indicesArray, 1);
        
        return {
            index: geometry.index,
            attribs: {
                iPosition: positions,
                iAngle: angles,
                ...geometry.attributes
            }
        }
    }, [base64Texture, width, height, config.geometryType]);

    useFrame((state) => {
        const { clock } = state;
        ref.current.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    function pickGeometry(geometryType: GeometryType) {
        switch(geometryType) {
        case "rounded":
            return new RoundedPlane( 1, 1, 0.2, 18 );
        case "circle":
            return new CircleGeometry( 1, 18 );
        case "rectangle":
        default:
            return new PlaneGeometry(1, 1, 1, 1);
        }
    }

    return (
        <mesh ref={ref}>
            <instancedBufferGeometry
                instanceCount={maxNumberOfInstances}
                index={objectData.index}
                attributes={objectData.attribs}
            />
            <pixelsFadeMaterial
                uTexture={texture}
                uTextureSize={new Vector2(width, height)}
                uRound={config.round}
                uSize={config.size}
                uFbmAmplitude={config.fbmAmplitude}
                uFbmFrequency={config.fbmFrequency}
                uFbmSpeed={config.fbmSpeed}
            />
        </mesh>
    )
});