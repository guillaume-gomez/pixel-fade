import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { 
  GizmoHelper,
  GizmoViewport,
  Stage,
  Stats,
  CameraControls,
  useHelper,
  Grid,
} from '@react-three/drei';
import { Color } from "three";
import { EffectComposer, Vignette, ChromaticAberration, Bloom, Grid as GridP } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import SenaarEffect from "../Effect/Senaar/SeenarShaderEffect";
import Range from "../../components/Range";
import FBOParticles from "./FBOParticles";
import FallbackLoader from "../FallbackLoader";

const SceneTest = () => {
  const [red, setRed] = useState<number>(1.);
  const cameraRef = useRef(null);
  //useHelper(cameraRef, CameraHelper, 1, 'hotpink');  
  

  return (
    <div className="w-full h-screen">
    <Range
      label="Red"
      value={red}
      onChange={(value) => setRed(value)}
      min={0.0}
      max={1.0}
      step={0.1}
      float={true}
    />
    <Canvas camera={{ position: [0, 0, 500],  far: 1000 }}>
      <ambientLight intensity={0.5} />
      <color attach="background" args={["#0007A6"]} />
      <Stats/>
      <Suspense fallaback={FallbackLoader}>
      <FBOParticles red={red} />
      <Grid args={[1000, 1000]} position={[0,0,0]} cellColor='green' />
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <EffectComposer enableNormalPass={false}>
        <Vignette
          offset={0.1} darkness={0.8} 
          eskil={false} // Eskil's vignette technique
          blendFunction={BlendFunction.NORMAL} // blend mode
        />
        {/*<Bloom mipmapBlur luminanceThreshold={1.0} />*/}
        {/*<ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.01, 0.01]} // color offset
        />*/}
        <SenaarEffect
          param={{
              color: new Color(0xFF9009),
              enableStripe: true,
              stripeDirection: -2.0,
              gradiantCurve: 0.5
            }}
        />
        </EffectComposer>
      </Suspense>
      <CameraControls ref={cameraRef} />
      <GizmoHelper
        alignment="bottom-right"
        margin={[80, 80]}
      >
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper>


    </Canvas>
  </div>
  );
};

export default SceneTest;