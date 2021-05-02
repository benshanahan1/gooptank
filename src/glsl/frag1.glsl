uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_data_width;
uniform sampler2D u_texture;

void main() {
    float size = u_data_width;
    vec2 pos = floor(size * gl_FragCoord.xy / u_resolution);
    pos = pos / size; // pos must be between 0 and 1, so divide by size
    
    // sample color from texture
    vec4 texel = texture2D(u_texture, pos);
    
    if (u_mouse.x < 100.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    
    gl_FragColor = texel;
}