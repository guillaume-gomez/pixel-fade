import React, {useMemo} from "react";
import pack from "pack-spheres"
import {SphereGeometry, GLSL3, BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Vector2} from "three"

interface instancedBufferGeometryProps {
    width: number;
    height: number
}

export default function instancedBufferGeometry({width, height, ...props} : instancedBufferGeometryProps) {
    // const numInstances = width * height;
    // const objectData = useMemo(() => {
    //     const numPoints = width * height;
    //     const data = init(numPoints);
    //     return data;
    // }, [width, height]);

    // function init(numPoints: number) {
    //     const geometry = new InstancedBufferGeometry();
        
    //     // positions
    //     const positions = new BufferAttribute(new Float32Array(4 * 3), 3);
    //     positions.setXYZ(0, -0.5, 0.5, 0.0);
    //     positions.setXYZ(1, 0.5, 0.5, 0.0);
    //     positions.setXYZ(2, -0.5, -0.5, 0.0);
    //     positions.setXYZ(3, 0.5, -0.5, 0.0);
        
    //     // uvs
    //     const uvs = new BufferAttribute(new Float32Array(4 * 2), 2);
    //     uvs.setXYZ(0, 0.0, 0.0);
    //     uvs.setXYZ(1, 1.0, 0.0);
    //     uvs.setXYZ(2, 0.0, 1.0);
    //     uvs.setXYZ(3, 1.0, 1.0);

    //     // index
    //     const indexes = new BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1);

    //     const indices = new Uint16Array(numPoints);
    //     const offsets = new Float32Array(numPoints * 3);
    //     const angles = new Float32Array(numPoints);

    //     for (let i = 0; i < numPoints; i++) {
    //         offsets[i * 3 + 0] = i % width;
    //         offsets[i * 3 + 1] = Math.floor(i / width);

    //         indices[i] = i;

    //         angles[i] = Math.random() * Math.PI;
    //     }
    //     //geometry.addAttribute('position', positions);
    //     //geometry.addAttribute('uv', uvs);
    //     //geometry.addAttribute('pindex', new InstancedBufferAttribute(indices, 1, false));
    //     //geometry.addAttribute('offset', new InstancedBufferAttribute(offsets, 3, false));
    //     //geometry.addAttribute('angle', new InstancedBufferAttribute(angles, 1, false));

    //     const ipositions = new InstancedBufferAttribute(positions, 3);
    //     const iscales = new InstancedBufferAttribute(new Int8Array([0.5]), 1);
    //     const pIndex



    //     return {
    //         index: indexes,
    //         attribs: {
    //             iPosition: positions,
    //             iScale: iscales,
    //             uvs,
    //             //...sphere.attributes
    //         }
    //     }
    // }

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
    const objectData = useMemo(() => {
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

            scales[i] = circle.radius

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

    const uniforms = {
        uTime: { value: 0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 2.0 },
        uSize: { value: 0.0 },
        uTextureSize: { value: new Vector2(width, height) },
        uTexture: { value: null },
        uTouch: { value: null },
    };


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
                index={objectData.index}
                attributes={objectData.attribs}
                uniforms={uniforms}
            />
            <rawShaderMaterial
                glslVersion={GLSL3}
                vertexShader={vertex}
                fragmentShader={fragment}/>
        </mesh>
    )
}