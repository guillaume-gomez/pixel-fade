import { useRef, Suspense, useEffect, useState } from 'react';
import { Group } from "three";
import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, Gltf, Text, CameraControls } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";

const { BASE_URL, MODE } = import.meta.env;


interface ThreeJsRendererProps {
  backgroundColor: string;
}

function ThreejsRenderer({
  backgroundColor,
} : ThreeJsRendererProps ): React.ReactElement {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<Group|null>(null);
  const cameraControlsRef = useRef<ExternalActionInterface| null>(null);
  


  return (
    <div className="flex flex-col gap-5 w-full h-full">
      <div ref={canvasContainerRef} 
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
          <ambientLight intensity={1.0} />
            <Stage adjustCamera={true} intensity={1} shadows="contact" environment="city">
                     
                <Suspense fallback={<FallBackLoader/>}>
                 
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
          <CameraControls
            ref={cameraControlsRef}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;