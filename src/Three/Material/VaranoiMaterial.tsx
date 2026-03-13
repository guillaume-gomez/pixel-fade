import { useRef } from "react"; 
import { Vector2, type ShaderMaterial } from "three";
import { extend, useFrame } from "@react-three/fiber";
import VaranoiShaderMaterial from "./VaranoiShaderMaterial";

const VaranoiShaderMaterialComponent = extend(VaranoiShaderMaterial);

interface VaranoiMaterialProps {
	width: number;
	height: number;
	mousePosition: Vector2;
}

function VaranoiMaterial({width, height, mousePosition} : VaranoiMaterialProps) {
  const ref = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    const { clock } = state;
    if(!ref || !ref.current) {
      return;
    }
    ref.current.uniforms.uTime.value = clock.getElapsedTime();
  });

	return <VaranoiShaderMaterialComponent
    ref={ref}
		uTime={1.0}
		uResolution={new Vector2(width, height)}
		uMouse={mousePosition}
		/>
}

export default VaranoiMaterial;