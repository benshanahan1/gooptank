uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x += sin(u_time * 0.0001);
    vec4 color = texture(u_texture, uv);
    
    gl_FragColor = color;
}