import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { NearestFilter, RGBAFormat, FloatType, Scene, OrthographicCamera, AdditiveBlending, PlaneGeometry } from "three";
import { GizmoHelper, GizmoViewport, Stage, Stats, CameraControls } from '@react-three/drei';
import { EffectComposer, Vignette, ChromaticAberration, Bloom, Grid as GridP } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';


import SimulationMaterial from './SimulationMaterial';

const vertexShader = /*glsl*/`
uniform sampler2D uPositions;
uniform sampler2D uTexture;
uniform float uTime;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = 10.0;
  // Size attenuation;
  //gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;
}`;


const fragmentShader = /*glsl*/`
void main() {
  vec3 color = vec3(0.34, 0.53, 0.96);
  gl_FragColor = vec4(color, 1.0);
}
`;

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  const fboRef = useRef(null)
  const size = 128;

  const width = size;
  const height = size;

  // This reference gives us direct access to our points
  const points = useRef();
  const simulationMaterialRef = useRef();

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
   const uvs = new Float32Array([
    0, 0,  // bottom-left
    1, 0,  // bottom-right
    1, 1,  // top-right
    0, 0,  // bottom-left
    1, 1,  // top-right
    0, 1   // top-left
  ]);

  const renderTarget = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    stencilBuffer: false,
    type: FloatType,
  });

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const length = width * height;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % width) / width;
      particles[i3 + 1] = i / width / width;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(() => ({
    uPositions: {
      value: null,
    },
    uTexture: {
      value: null
    }
  }), [])

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.uPositions.value = renderTarget.texture;

    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <group position={[-size/2, -size/2, 0]}>
        <points ref={points}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlesPosition.length / 3}
              array={particlesPosition}
              itemSize={3}
            />
          </bufferGeometry>
          <shaderMaterial
            blending={AdditiveBlending}
            depthWrite={false}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={uniforms}
          />
        </points>
      </group>
    </>
  );
};

const SceneTest = () => {
  return (
    <div className="w-full h-screen">
    <Canvas camera={{ position: [0, 0, 100],  far: 500 }}>
      <ambientLight intensity={0.5} />
      <color attach="background" args={["#6707A6"]} />
      <Stats/>
      <FBOParticles />
      <EffectComposer enableNormalPass={false}>
      <Vignette
        offset={0.1} darkness={0.8} 
        eskil={false} // Eskil's vignette technique
        blendFunction={BlendFunction.NORMAL} // blend mode
      />
        <Bloom mipmapBlur luminanceThreshold={1.0} />
        {/*<ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.001, 0.001]} // color offset
        />*/}
        {/*<GridP scale={2.0} lineWidth={.0}/>*/}
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  </div>
  );
};

export default SceneTest;