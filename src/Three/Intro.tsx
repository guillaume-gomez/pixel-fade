import { Text3D, Center } from '@react-three/drei';

function Intro() {
	return (
    <Center>
      <Text3D
        letterSpacing={-0.06}
        size={40}
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
      </Text3D>
    </Center>
   	);               
}

export default Intro;