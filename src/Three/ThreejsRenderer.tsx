import { useRef, Suspense, useEffect, useState } from 'react';
import { Group, MathUtils } from "three";
import { Canvas, useFrame } from '@react-three/fiber';
import PixelFade from "./PixelFade";
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, Gltf, Text, CameraControls } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import { Instances, Instance, Environment } from '@react-three/drei';
import { EffectComposer, Pixelation, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing'

import InstanceMesh, { Config } from "./InstancedBufferGeometry";


const { BASE_URL, MODE } = import.meta.env;


interface ThreeJsRendererProps {
  backgroundColor: string;
  width: number;
  height: number;
  base64Texture?: string;
  config: Config;
}

function ThreejsRenderer({
  backgroundColor,
  width,
  height,
  base64Texture,
  config
} : ThreeJsRendererProps ): React.ReactElement {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<Group|null>(null);
  const cameraControlsRef = useRef<ExternalActionInterface| null>(null);

  return (
    <div className="flex flex-col gap-5 w-full h-full" style={{ width: '100%', height: '100%'}}>
      <div ref={canvasContainerRef}  style={{ width: '100%', height: '100%'}}
        className="hover:cursor-grabbing w-full h-full /*bg-secondary*/ bg-gradient-to-b from-sky-100 to-sky-500  rounded-xl"
      >
        <Canvas
          camera={{ position: [50,10, 20], fov: 75, far: 200 }}
          dpr={window.devicePixelRatio}
          shadows
          onDoubleClick={() => {
            toggleFullscreen();
          }}
        >
          { import.meta.env.MODE === "development" ? <Stats/> : <></> }
          <ambientLight intensity={1.5} />
          {/*<color attach="background" args={['#f0f0f0']} />
          <fog attach="fog" args={['red', 20, -5]} />*/}
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <Stage adjustCamera={true} intensity={1} shadows="contact" environment={null/*'city'*/}>
                     
                <Suspense fallback={<FallBackLoader/>} >
                  <InstanceMesh
                    width={width}
                    height={height} 
                    base64Texture={base64Texture}
                    config={config}
                  />
                  {/*<PixelFade />*/}
                 
                  { MODE === "development" &&
                    <Grid args={[60, 60]} position={[0,0,0]} cellColor='white' />
                  }
              </Suspense>
            </Stage>
          { MODE === "development" &&
            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          }
          <EffectComposer disableNormalPass>
            <Vignette
              offset={0.1} darkness={1.1} 
              eskil={false} // Eskil's vignette technique
              blendFunction={BlendFunction.NORMAL} // blend mode
            />
            {/*<ChromaticAberration
              blendFunction={BlendFunction.NORMAL} // blend mode
              offset={[0.02, 0.002]} // color offset
            />*/}
           {/*<Pixelation  granularity={10}/>*/}
          </EffectComposer>
          <CameraControls
            ref={cameraControlsRef}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;
