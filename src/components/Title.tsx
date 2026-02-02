import { useSpring, animated } from '@react-spring/web';
import { SettingsContext } from "../SettingsContext";
import { useContext } from 'react';

function Title() {
	const { timerIntroInMs } = useContext(SettingsContext);

  const springs = useSpring({
    from: { opacity: 0, right: '0rem', textShadow: "#ffcc00 1px 0 10px",  },
    to: { opacity: 1, right: '2.5rem' },
    delay: timerIntroInMs + 500,
    config: {
      duration: 1000
    }

  });

	return (
		<animated.div
        className="lg:absolute bottom-10 z-10 text-center"
        style={springs}
      >
         <h1 className="lg:text-5xl md:text-2xl">Particle Pixel Ballet</h1>
         <span className="lg:text-3xl md:text-xl"> By Guillaume Gomez</span>
      </animated.div>
	)
}

export default Title;