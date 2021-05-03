uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec4 color = texture(u_texture, uv);
    
    color *= vec4(abs(sin(u_time)), abs(cos(u_time)), abs(sin(u_time) + cos(u_time)), 1.0);
    
    gl_FragColor = color;
}