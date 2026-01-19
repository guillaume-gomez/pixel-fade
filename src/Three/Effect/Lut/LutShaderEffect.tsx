import { Effect } from "postprocessing";
import * as THREE from "three";
import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import LutShader from './LutShader';
import { useLoader } from "@react-three/fiber";


/**
 * Interface for dithering effect options
 */
export interface SenaarEffectOptions {
  time?: number;
  resolution?: THREE.Vector2;
  color: THREE.Color;
  enableStripe: boolean;
}

/**
 * Implementation of the dithering effect
 * Applies a dithering pattern to the rendered scene
 */
class SenaarEffect extends Effect {
  /**
   * Map of uniforms used by the shader
   */
  uniforms: Map<string, THREE.Uniform<number | THREE.Vector2>>;
  /**
   * Creates a new dithering effect instance
   * @param options - Configuration options for the effect
   */
  constructor({
    time = 0,
    enable = true,
    textureNeutral,
    textureModified,
    pi = new THREE.Vector2(1., 1.),
    gamma = new THREE.Vector2(1., 1.)
  }: SenaarEffectOptions) {
    // Initialize uniforms with default values
    const uniforms = new Map<string, THREE.Uniform<number | THREE.Vector2 | THREE.Color >>([
      ["time", new THREE.Uniform(time)],
      ["enable", new THREE.Uniform(enable ? 1 : 0)],
      ["textureNeutral", new THREE.Uniform(textureNeutral)],
      ["textureModified", new THREE.Uniform(textureModified)],
      ["pi", new THREE.Uniform(pi)],
      ["gamma", new THREE.Uniform(gamma)]
    ]);

    super("SenaarEffect", LutShader, {
      // blendFunction: BlendFunction.SCREEN,
      uniforms
    });

    this.uniforms = uniforms;
  }

  /**
   * Updates the effect parameters on each frame
   * @param renderer - The WebGL renderer
   * @param inputBuffer - The input render target
   * @param deltaTime - Time elapsed since the last frame
   */
  update(
    renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ): void {
    // Update time uniform
    const timeUniform = this.uniforms.get("time");
    if (timeUniform !== undefined && typeof timeUniform.value === 'number') {
      timeUniform.value += deltaTime;
    }

    // Update resolution uniform to match current render target
    const resolutionUniform = this.uniforms.get("resolution");
    if (resolutionUniform !== undefined && resolutionUniform.value instanceof THREE.Vector2) {
      resolutionUniform.value.set(
        inputBuffer.width,
        inputBuffer.height
      );
    }
  }

  /**
   * Performs initialization tasks
   * @param renderer - The WebGL renderer
   * @param alpha - Whether the renderer uses the alpha channel
   * @param frameBufferType - The type of the main frame buffers
   */
  initialize(
    renderer: THREE.WebGLRenderer,
    alpha: boolean,
    frameBufferType: number
  ): void {
    // No special initialization required for this effect
  }

  setEnable(value: boolean): void {
    const enable = this.uniforms.get("enable");
    console.log(enable)
    if (enable !== undefined) {
      enable.value = value;
    }
  }

  setGamma(value: Vector2): void {
    const gamma = this.uniforms.get("gamma");
    console.log(gamma)
    if (gamma !== undefined) {
      gamma.value = value;
    }
  }

  // add setters
  

}


// Effect component
const SenaarEffectWrapper = forwardRef(({ param } : SenaarEffectOptions, ref) => {
  const [textureNeutral, textureModified] = useLoader(THREE.TextureLoader, [
    '/lookup-table-0.png',
    '/lookup-table-1.png'
  ]);
  const effect = useMemo(() => new SenaarEffect({param, ...textureNeutral, textureModified}), [param, textureNeutral, textureModified])
  return <primitive ref={ref} object={effect} dispose={null} />
});

export default SenaarEffectWrapper;