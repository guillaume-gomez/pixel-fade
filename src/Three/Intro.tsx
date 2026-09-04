import { Text3D, Center, GradientTexture } from '@react-three/drei';
import { easings } from '@react-spring/web';
import { useSpring, animated } from '@react-spring/three';
import { useContext } from "react";
import { SettingsContext } from "../SettingsContext";
const { BASE_URL } = import.meta.env;

const AnimatedText3D = animated(Text3D);

const delay = 500;
const timeOff = 400;

const widthLaptop = 1790;

function Intro() {
  const { timerIntroInMs } = useContext(SettingsContext);
  const springs = useSpring(
      {
        from: { opacity: 0, z: -50 },
        to: [
          { opacity: 1, z: 0 },
          { opacity: 0, z: 50 }
        ],
        config: {
          easing: easings.easeInOutSine,
          duration: (timerIntroInMs/2) - delay - timeOff, // timerIntroMs/2 because Two changes in to:[array]
        },
        delay: delay,
      }
  );

  const sizeRatio = document.body.clientWidth / widthLaptop;

	return (
     <Center>
      <AnimatedText3D
        position-z={springs.z}
        size={23 * sizeRatio }
        font={`${BASE_URL}/Roinert Squared_Italic.json`}
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={5}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={-0.06}
        visible={true}
      >
        Particle Pixel BalleT
        <animated.meshStandardMaterial transparent={true} opacity={springs.opacity}>
          <GradientTexture
            stops={[0, 1]} // As many stops as you want
            colors={['#aa9900', '#ffffff']} // Colors need to match the number of stops
            size={1024} // Size is optional, default = 1024
          />
        </animated.meshStandardMaterial>
      </AnimatedText3D>
     </Center>
   	);
}

export default Intro;