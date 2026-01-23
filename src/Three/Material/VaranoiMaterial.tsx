import { useRef } from "react"; 
import { Vector2 } from "three";
import { extend, useFrame } from "@react-three/fiber";
import VaranoiShaderMaterial from "./VaranoiShaderMaterial";


extend({ VaranoiShaderMaterial });

interface VaranoiMaterialProps {
	width: number;
	height: number;
	mousePosition: Vector2;
}

function VaranoiMaterial({width, height, mousePosition}) {
  const ref = useRef(null);

  useFrame((state) => {
    const { clock } = state;
    if(!ref || !ref.current) {
      return;
    }
    ref.current.uniforms.uTime.value = clock.getElapsedTime();
  });

	return <varanoiShaderMaterial
    ref={ref}
		uTime={1.0}
		uResolution={new Vector2(width, height)}
		uMouse={mousePosition}
		/>
}

export default VaranoiMaterial;