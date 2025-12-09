import { useLoader } from '@react-three/fiber';
import { BoxGeometry, RepeatWrapping, TextureLoader } from 'three';
import { useEffect } from "react";

const imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC";

interface PixelFadeProps {
	texture?: string;
	width?: number;
	height?: number;
}


const geometry = new BoxGeometry(1, 1, 0.2, 1, 1, 1);

const offset = 0;

const SCALE = 10;

function PixelFade({ texture = imageBase64, width = 500, height = 500 }) {
	// const [texture, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    //   base64Texture,
    //   `${BASE_URL}/plastic_0021/reduced/normal_1k.png`,
    //   `${BASE_URL}/plastic_0021/reduced/roughness_1k.jpg`,
    //   `${BASE_URL}/plastic_0021/reduced/ao_1k.jpg`,
    // ]);

    // useEffect(() => {
    //   normalMap.repeat.set( widthMozaic/tileSize, heightMozaic/tileSize );
    //   normalMap.offset.set( offset, offset );
    //   normalMap.wrapS = RepeatWrapping;
    //   normalMap.wrapT = RepeatWrapping;
    //   normalMap.needsUpdate = true;

    //   roughnessMap.repeat.set( 1, 1 );
    //   roughnessMap.wrapS = RepeatWrapping;
    //   roughnessMap.wrapT = RepeatWrapping;

    //   aoMap.repeat.set( widthMozaic/tileSize, heightMozaic/tileSize );
    //   aoMap.offset.set( offset, offset );
    //   aoMap.wrapS = RepeatWrapping;
    //   aoMap.wrapT = RepeatWrapping;
    //   aoMap.needsUpdate = true;
 
    // }, [base64Texture])


  return (
    <mesh
      scale={[SCALE,SCALE * (height/width),2]}
      position={[0,0,0]}
      geometry={geometry}
      castShadow
    >
      <meshStandardMaterial attach="material-0" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-1" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-2" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-3" color="black" emissive="#000000" roughness={0} metalness={0} />
      <meshStandardMaterial attach="material-5" color="black" />
      {/*<meshStandardMaterial

          attach="material-4"
          color="#FFFFFF"
          map={texture}
          // debug map={aoMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
      />*/}


      <meshStandardMaterial

          attach="material-4"
          color="#FFFFFF"
          //map={texture}
          
      />
    </mesh>
    )
}

export default PixelFade;