import { useContext } from 'react';
import Form from "./components/Form";
import Title from "./components/Title";
import ThreejsRenderer from "./Three/ThreejsRenderer";

import { SettingsContext } from "./SettingsContext";


function App() {
  const {
    image,
    geometryType,
    size,
    fbmFrequency,
    fbmSpeed,
    fbmAmplitude,
    luminance
  } = useContext(SettingsContext);


  return (
    <div className="w-full h-screen sm:px-4 sm:d-flex sm:flex-column ">
      <Title />

      <div className="w-full h-full">
        <ThreejsRenderer
          base64Texture={image?.src}
          config={{
            geometryType,
            size,
            fbmFrequency,
            fbmSpeed,
            fbmAmplitude,
            luminance,
            optimised: true
          }}
        />
      </div>

      <div className="lg:absolute md:static lg:top-8 lg:left-8 lg:max-w-xs md:max-w-full md:w-full z-10">
        <Form />
      </div>
      
    </div>
  )
}

export default App
