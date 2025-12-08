import { Html, useProgress } from '@react-three/drei';


function FallBackLoader() {
    const {progress} = useProgress();
    return (
        <Html>
            <span className="canvas-load"></span>
            <p 
                style={{
                    fontSize: 14,
                    color: '#f1f1f1',
                    fontWeight: 800,
                }}
            >
                {progress.toFixed(2)}%
            </p>
        </Html>
    )
}

export default FallBackLoader;