import { useMemo } from "react";
import { useLoader, useFrame, extend } from '@react-three/fiber';
import {
    InstancedBufferAttribute,
    Vector2,
    //BoxHelper,
    TextureLoader,
    BufferGeometry
} from "three";
import PixelsFadeMaterialPoint from "./PixelsFadeMaterialPoint";

extend({ PixelsFadeMaterialPoint });

export type GeometryType = "rounded"|"rectangle"|"circle";

export interface Config {
    fbmAmplitude: number;
    fbmFrequency: number;
    fbmSpeed: number;
    size: number;
    optimised: boolean;
    geometryType: GeometryType;
    luminence: number;
}

interface instancedBufferGeometryProps  {
    width: number;
    height: number;
    base64Texture: string;
    config: Config;
    ref: any;
}

function InstancedBufferGeometryPoints(
{
    width,
    height,
    base64Texture,
    config,
    ref
}: instancedBufferGeometryProps ) {
  //useHelper(ref, BoxHelper, 'red');
  const [texture] = useLoader(TextureLoader, [base64Texture]);

  const maxNumberOfInstances = width * height;
  
  // Builds instanced data for the packing
  const objectData = useMemo(() => {
      
      // setup buffer geometry
      let geometry = new BufferGeometry();
      
      // setup arrays
      let positionsArray = new Float32Array(maxNumberOfInstances * 3);
      let speedArray = new Float32Array(maxNumberOfInstances);
      
      // Build per-instance attributes. 
      let count = 0;
      for(let i = 0; i < maxNumberOfInstances; i++) {
          positionsArray[count] = (i % width);
          positionsArray[count + 1] = (Math.floor(i / width));
          positionsArray[count + 2] = 0;

          speedArray[i] = Math.random() * Math.PI;

          count += 3;
      }

      return { positionsArray, speedArray };
  }, [base64Texture, width, height, config.geometryType]);

  useFrame((state) => {
      const { clock } = state;
      if(!ref || !ref.current) {
        return;
      }

      ref.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={objectData.positionsArray.length / 3}
          array={objectData.positionsArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={objectData.speedArray.length}
          array={objectData.speedArray}
          itemSize={1}
        />
      </bufferGeometry>
      {/*  @ts-ignore */
	      <pixelsFadeMaterialPoint
      		depthWrite={false}
      		uTexture={texture}
          uTextureSize={new Vector2(width, height)}
          uLuminenceIntensity={config.luminance}
          uSize={config.size}
          uFbmAmplitude={config.fbmAmplitude}
          uFbmFrequency={config.fbmFrequency}
          uFbmSpeed={config.fbmSpeed}
	      />
    	}
    </points>
  );
}

export default InstancedBufferGeometryPoints;