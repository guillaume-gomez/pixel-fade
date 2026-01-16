import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import FallBackLoader from "../FallBackLoader";
import { 
  GizmoHelper,
  GizmoViewport,
  Stage,
  Stats,
  CameraControls,
  useHelper,
  Grid,
  RoundedBox,
  Environment
} from '@react-three/drei';
import { EffectComposer, Vignette, ChromaticAberration, Bloom, Grid as GridP } from '@react-three/postprocessing';
import { Color } from "three";
import { BlendFunction } from 'postprocessing';
import LutEffect from "../Effect/Lut/LutShaderEffect";
import Range from "../../components/Range";
import FBOParticles from "./FBOParticles";

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
    <Canvas camera={{ position: [0, 0, 500], near: 0.1,  far: 1000 }}>
      <ambientLight intensity={0.5} />
      <Stats/>
      <color attach="background" args={["#0007A6"]} />
      <Suspense fallback={<FallBackLoader/>}>
        
          <FBOParticles red={red} />
          <RoundedBox
            args={[1, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
            radius={0.05} // Radius of the rounded corners. Default is 0.05
            steps={1} // Extrusion steps. Default is 1
            smoothness={4} // The number of curve segments. Default is 4
            bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
            creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
          >
            <meshPhongMaterial color="#f3f3f3" />
          </RoundedBox>
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
          <LutEffect
            param={{
                enable: true,
              }}
          />
            {/*<Bloom mipmapBlur luminanceThreshold={1.0} />*/}
            {/*<ChromaticAberration
              blendFunction={BlendFunction.NORMAL} // blend mode
              offset={[0.01, 0.01]} // color offset
            />*/}
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