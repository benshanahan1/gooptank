uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_data_width;
uniform sampler2D u_texture;

float dot(vec3 a, vec3 b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

void main() {
    float size = u_data_width;
    vec2 pos = floor(size * gl_FragCoord.xy / u_resolution);
    pos = pos / size; // pos must be between 0 and 1, so divide by size
    
    // sample color from texture, ignore alpha channel for this example
    vec3 texel = vec3(texture2D(u_texture, pos));
    
    // convert rgb to grayscale
    // see: https://gist.github.com/yiwenl/1c2ce935e66b82c7df5f
    float gray = dot(texel, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(gray), 1.0);
}