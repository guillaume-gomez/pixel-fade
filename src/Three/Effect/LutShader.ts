/**
 * Dithering shader implementation
 * Applies a dithering effect to the rendered scene
 * 
 * Credits:
 * Original dithering pattern: https://www.shadertoy.com/view/ltSSzW
 */

const SenaarShader = /*glsl*/`
uniform vec2 resolution;
uniform vec3 colorGradiant;
uniform float gradiantCurve; // 1 => linear, 
uniform bool enableStripe;
uniform float stripeDirection;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 fragCoord = uv * resolution;
    vec3 baseColor = texture2D(inputBuffer, fragCoord).rgb;
  
    vec3 top = vec3(0.,0.,0.);
    vec3 bottom = colorGradiant;

    //float fx = uv.y; // linear
     float fx = pow(uv.y, gradiantCurve); // exponential ease-in

    vec3 gradiantPixel = mix(bottom, top, fx) + inputColor.rgb;
    
    if(!enableStripe) {
      outputColor = vec4(gradiantPixel, inputColor.a);
      return;
    }


    // stripes part

    float stripeWidth = 20.; //in pixels
    float colorWidth = .6; // 20 %
    float offset = 0.5 * (1. - colorWidth); //
    float direction = stripeDirection; // 0: vertical, 1. horizontal
    vec3 labelColor =  vec3(1,1,1);
 
    
    float normalizedWidth = resolution.x / stripeWidth;
    float pos = mix(uv.x, uv.y, direction) * normalizedWidth;
    float fracPos = fract(pos);
    float smoothed = smoothstep(offset, offset + 2. / stripeWidth, fracPos) * (1. - smoothstep(1. - offset - 2. / stripeWidth, 1. - offset, fracPos));

    outputColor = vec4(inputColor.rgb + gradiantPixel, smoothed);
}`;

export default SenaarShader; 