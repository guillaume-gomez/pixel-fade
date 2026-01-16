/**
 * Dithering shader implementation
 * Applies a dithering effect to the rendered scene
 * 
 * Credits:
 * Original dithering pattern: https://www.shadertoy.com/view/ltSSzW
 */

const LutShader = /*glsl*/`
uniform bool enable;
uniform sampler2D textureNeutral;
uniform sampler2D textureModified;
uniform vec2 pi;
uniform vec2 gamma;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 fragCoord = uv * resolution;
    vec3 baseColor = texture2D(inputBuffer, fragCoord).rgb;

     if(!enable) {
      outputColor = inputColor;
      return;
    }

    vec3 color = inputColor.rgb;

    color = pow(color, vec3(gamma.y));

    float u  =  floor(color.b * 15.0) / 15.0 * 240.0;
        u  = (floor(color.r * 15.0) / 15.0 *  15.0) + u;
        u /= 255.0;
    float v  = 1.0 - (floor(color.g * 15.0) / 15.0);

    vec3 left0 = texture2D(textureNeutral, vec2(u, v)).rgb;
    vec3 left1 = texture2D(textureModified, vec2(u, v)).rgb;

    u  =  ceil(color.b * 15.0) / 15.0 * 240.0;
    u  = (ceil(color.r * 15.0) / 15.0 *  15.0) + u;
    u /= 255.0;
    v  = 1.0 - (ceil(color.g * 15.0) / 15.0);

    vec3 right0 = texture2D(textureNeutral, vec2(u, v)).rgb;
    vec3 right1 = texture2D(textureModified, vec2(u, v)).rgb;

    float sunPosition = 1.0;

    vec3 left  = mix(left0,  left1,  sunPosition);
    vec3 right = mix(right0, right1, sunPosition);

    color.r = mix(left.r, right.r, fract(color.r * 15.0));
    color.g = mix(left.g, right.g, fract(color.g * 15.0));
    color.b = mix(left.b, right.b, fract(color.b * 15.0));

    outputColor.rgb = pow(color.rgb, vec3(gamma.x));
  
}`;

export default LutShader; 