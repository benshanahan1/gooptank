uniform vec2 u_resolution;
uniform sampler2D u_texture;

float dot(vec3 a, vec3 b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 color = texture(u_texture, uv);
    
    // convert rgb to grayscale
    // see: https://gist.github.com/yiwenl/1c2ce935e66b82c7df5f
    // float gray = dot(texel, vec3(0.299, 0.587, 0.114));
    // gl_FragColor = vec4(vec3(gray), 1.0);
    gl_FragColor = color;
}