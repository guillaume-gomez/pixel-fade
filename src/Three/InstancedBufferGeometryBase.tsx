import {useMemo} from "react";
import {SphereGeometry, GLSL3, InstancedBufferAttribute} from "three"

export default function instancedBufferGeometry(props: any) {

    const {
        numInstances = 1000,
        dimensions = 3,
        packAttempts = 500,
        minRadius = 0.05,
        maxRadius = 0.5,
        padding = 0.0025,
        widthSegments = 32,
        heightSegments = 16
    } = props

    // Builds instanced data for the packing
    const objdata = useMemo(() => {
        let sphere = new SphereGeometry(1, widthSegments, heightSegments);

        const settings = {
            dimensions,
            packAttempts,
            maxCount: numInstances,
            minRadius,
            maxRadius,
            padding
        }

        // generate scale/radius + positions
        const circles = pack(settings)
        console.log(circles)
        
        // setup arrays
        let positions = new Float32Array(numInstances * 3)
        let scales = new Float32Array(numInstances)

        // Build per-instance attributes. 
        let count = 0
        circles.forEach((circle, i) => {
            positions[count] = circle.position[0]
            positions[count + 1] = circle.position[1]
            positions[count + 2] = circle.position[2]

            scales[i] = Math.random();

            count += 3
        })

        let ipositions = new InstancedBufferAttribute(positions, 3)
        let iscales = new InstancedBufferAttribute(scales, 1)
        
        return {
            index: sphere.index,
            attribs: {
                iPosition: ipositions,
                iScale: iscales,
                ...sphere.attributes
            }
        }
    }, [])


    const vertex = `
    
        in vec3 position;
        in vec2 uv;
        in vec3 iPosition;
        in float iScale;
        out float vScale;
        out vec3 vPos;
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        void main(){
            vec3 p = position;
            p.x *= iScale;
            p.y *= iScale;
            p.z *= iScale;
            
            vec4 pos = vec4(p + iPosition,1.);
            vPos = iPosition;
            vScale = iScale;
            gl_Position = projectionMatrix * viewMatrix * pos;
        }
    `

    const fragment = `
        precision highp float;
        
        in float vScale;
        in vec3 vPos;
        out vec4 glFragColor;
        void main(){
            glFragColor = vec4(1.0,vScale,0.0,1.);
        }    
    `
    return (
        <mesh>
            <instancedBufferGeometry
                instanceCount={numInstances}
                index={objdata.index}
                attributes={objdata.attribs}/>
            <rawShaderMaterial
                glslVersion={GLSL3}
                vertexShader={vertex}
                fragmentShader={fragment}/>
        </mesh>
    )
}