uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

void main() {
    float size = 10.0;
    vec2 pos = floor(size * gl_FragCoord.xy / u_resolution);
    pos = pos / size; // pos must be between 0 and 1, so divide by size
    
    // sample color from texture
    vec4 texel = texture2D(u_texture, pos);
    
    gl_FragColor = texel;
}