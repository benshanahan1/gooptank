uniform sampler2D input_texture;

varying vec2 vUv;
void main() {
    vec4 src = texture2D(input_texture, vUv);
    
    gl_FragColor = src;
}