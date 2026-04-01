import { useRef, Suspense, useEffect, useState, useContext } from 'react';
import { SettingsContext } from "../SettingsContext";

import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, Stage, Grid, Stats, CameraControls, PerformanceMonitor } from '@react-three/drei';
import { type Mesh} from "three";
import FallBackLoader from "./FallBackLoader";
import { EffectComposer, Vignette, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import InstanceMesh, { type Config } from "./ParticleWithBufferGeometry/InstancedBufferGeometry";
//import InstancedBufferGeometryPoints from "./ParticleWithPoints/InstancedBufferGeometryPoints";
import Intro from "./Intro";

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
    backgroundColor,
    setGeometryType,
    spacing
  } = useContext(SettingsContext);

  const meshRef = useRef<Mesh|null>(null);
  const cameraControllerRef = useRef<CameraControls>(null);
  const [vignetteDarkness, setVignetteDarkness] = useState<number>(1.5);
  const [_chromaticOffset, setChromaticOffset] = useState<number>(0.0025);
  const [dpr, setDpr] = useState<number>(1);

  useEffect(() => {
    if(!base64Texture) {
      return;
    }

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
    }, 5000);

  },[base64Texture, width, height, cameraControllerRef]);


  async function recenter() {
    if(!meshRef.current || !cameraControllerRef.current) {
      return;
    }

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

  function onUpdateCamera(camera: CameraControls) {
    updateCameraFarProperty(camera);

    const cameraZ = camera.position.z;
    fromCameraZPositionToVignetteDarkness(cameraZ)
  }

  function updateCameraFarProperty(camera: CameraControls) {
    const farCandidate = Math.max(1, spacing) * 500;
    const needChangeFar = farCandidate != camera.far;

    if(needChangeFar) {
      camera.far = Math.max(1, spacing) * 500;
      camera.updateProjectionMatrix();
    }
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
          camera={{ position: [0,0, 250], fov: 75, far: 1000 }}
          dpr={Math.max(dpr, window.devicePixelRatio)}
          shadows
          id="three-js-renderer"
        >
          { import.meta.env.MODE === "development" ? <Stats/> : <></> }
          <ambientLight intensity={1.5} />
          <color attach="background" args={[backgroundColor]} />
          <fog attach="fog" args={['red', 20, -5]} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <Stage adjustCamera={false} intensity={1} shadows="contact" environment={"sunset"}>
              <PerformanceMonitor
                  bounds={() => [30, 500]} // frame/second limit to trigger functions
                  flipflops={1} // maximum changes before onFallback
                  onDecline={() => {
                    setDpr(dpr * 0.8); // lower dpr by 20%
                    setGeometryType("rectangle");
                  }}
               >
                <ambientLight intensity={0.5} />
                <spotLight position={[0, 10, 0]} intensity={0.3} />
                <directionalLight position={[-50, 0, -40]} intensity={0.7} />
                <Suspense fallback={<FallBackLoader/>} >
                  { !base64Texture && <Intro /> }

                  {
                    base64Texture &&
                    <InstanceMesh
                      width={width}
                      height={height}
                      base64Texture={base64Texture as string}
                      config={config}
                      ref={meshRef}
                    />
                  }
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
              </PerformanceMonitor>
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
            minPolarAngle={0.75}
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={-0.55}
            maxAzimuthAngle={0.55}
            minDistance={10}
            maxDistance={200 * Math.max(1, spacing * 0.8)}
            onUpdate={(e: any) => onUpdateCamera(e.target._camera) }
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ThreejsRenderer;
