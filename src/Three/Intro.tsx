import { Text3D, Center, MeshDistortMaterial } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/web'
import { useEffect,useState } from "react";

const AnimatedText3D = animated(Text3D);


function Intro() {
  const [springs, api] = useSpring(() => (
      {
        from: { size: 40},
      }
    )
  );

  useEffect(() => {
    api.start(
      {
        to: {size: 5},
        config: {
          duration: 4000
        }
      }
    );
  }, [])

	return (
    <Center>
      <AnimatedText3D
        size={springs.size}
        letterSpacing={-0.07}
        font="/Roinert Squared_Italic.json"
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={5}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={-0.06}
        visible={true}
      >
        Floating pixels
        <meshStandardMaterial color={"orange"} />
      </AnimatedText3D>
    </Center>
   	);               
}

export default Intro;