import { useRef, Suspense, useEffect, useState, useContext } from 'react';
import { SettingsContext } from "../SettingsContext";

import { Canvas } from '@react-three/fiber';
//import PixelFade from "./PixelFade";
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, CameraControls } from '@react-three/drei';
import { type Mesh} from "three";
import FallBackLoader from "./FallBackLoader";
import { EffectComposer, Vignette, ChromaticAberration, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import InstanceMesh, { type Config } from "./ParticleWithBufferGeometry/InstancedBufferGeometry";
import InstancedBufferGeometryPoints from "./ParticleWithPoints/InstancedBufferGeometryPoints";


const { /*BASE_URL,*/ MODE } = import.meta.env;


interface ThreeJsRendererProps {
  base64Texture?: string;
  config: Config;
}

function ThreejsRenderer({
  base64Texture,
  config
} : ThreeJsRendererProps ): React.ReactElement {
  const {
    width,
    height,
    backgroundColor
  } = useContext(SettingsContext);

  const meshRef = useRef<Mesh|null>(null);
  const cameraControllerRef = useRef<CameraControls>(null);
  const [vignetteDarkness, setVignetteDarkness] = useState<number>(1.5);
  const [chromaticOffset, setChromaticOffset] = useState<number>(0.0025);

  useEffect(() => {
    if(!cameraControllerRef.current) {
      // try in 4000 sec
      setTimeout(() => {
        recenter();
      }, 4000);
      
      return;
    }

    cameraControllerRef.current.setTarget(0,0,0, false);
    cameraControllerRef.current.setPosition(0,0, 10, true);

    setTimeout(() => {
      // delay the times to see the particules
      recenter();
    }, 3000);

  },[base64Texture, width, height, cameraControllerRef]);


  async function recenter() {
    if(!meshRef.current || !cameraControllerRef.current) {
      return;
    }

    console.log(meshRef.current)

    await cameraControllerRef.current.fitToBox(meshRef.current, true,
      { paddingLeft: width, paddingRight: width, paddingBottom: height, paddingTop: height }
    );
  }

  // start1, stop1 => min and max of value
  // start2, stop2 => convertion of value into this new range
  function minMax([start1, stop1]: [number, number], [start2, stop2]: [number, number], value: number) {
    const newval = (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
  }

  function fromCameraZPositionToVignetteDarkness(cameraZ: number) {
    setVignetteDarkness(minMax([10, 200], [1.5, 0.5], cameraZ));
    setChromaticOffset(minMax([10, 200], [0, 0.0025], cameraZ));
  }

  return (
    <div className="flex flex-col gap-5 w-full h-full" style={{ width: '100%', height: '100%'}}>
      <div style={{ width: '100%', height: '100%'}}
        className="hover:cursor-grabbing w-full h-full rounded-xl"
      >
        <Canvas
          camera={{ position: [0,0, 10], fov: 75, far: 500 }}
          dpr={window.devicePixelRatio}
          shadows
        >
          { import.meta.env.MODE === "development" ? <Stats/> : <></> }
          <ambientLight intensity={1.5} />
          <color attach="background" args={[backgroundColor]} />
          <fog attach="fog" args={['red', 20, -5]} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <Stage adjustCamera={false} intensity={1} shadows="contact" environment={null/*'city'*/}>
                     
                <Suspense fallback={<FallBackLoader/>} >
                  <InstanceMesh
                    width={width}
                    height={height} 
                    base64Texture={base64Texture as string}
                    config={config}
                    ref={meshRef}
                  />
                  {/*<InstancedBufferGeometryPoints
                    width={width}
                    height={height} 
                    base64Texture={base64Texture as string}
                    config={config}
                    ref={meshRef} />*/}
                
                  { MODE === "development" &&
                    <Grid args={[1000, 1000]} position={[0,0,0]} cellColor='green' />
                  }
              </Suspense>
            </Stage>
          { MODE === "development" &&
            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          }
          <EffectComposer enableNormalPass={false}>
            <Vignette
              offset={0.1} darkness={vignetteDarkness} 
              eskil={false} // Eskil's vignette technique
              blendFunction={BlendFunction.NORMAL} // blend mode
            />
            <Bloom mipmapBlur luminanceThreshold={1.0} />
            {/*<ChromaticAberration
              blendFunction={BlendFunction.NORMAL} // blend mode
              offset={[chromaticOffset, chromaticOffset]} // color offset
            />*/}
            {/*<GridP scale={0.0} lineWidth={.0}/>*/}
          </EffectComposer>
          <CameraControls
            ref={cameraControllerRef}
            makeDefault
            smoothTime={1.0}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={-0.55}
            maxAzimuthAngle={0.55}
            minDistance={10}
            maxDistance={200}
            onUpdate={(e: any) => fromCameraZPositionToVignetteDarkness(e.target._camera.position.z) }
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;
