uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

void main() {

    // u_texture is 10x10, so compute an index between 0 and 9
    vec2 pos = floor(10. * gl_FragCoord.xy / u_resolution);

    // make sure we're computing pos correctly
    // gl_FragColor = vec4(pos.x/10., pos.y/10., 1, 1.0);

    // use pos to index into u_texture
    gl_FragColor = texture2D(u_texture, pos);
}