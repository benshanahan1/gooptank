uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // super simple fragment shader; rotate R, G, & B through colors at a different rate
    vec3 colorWheel = vec3(
        abs(sin(u_time * 0.1)),
        abs(sin(u_time * 0.3)),
        abs(sin(u_time * 0.5))
    );
    
    // modify color by normalized (x,y) coord
    colorWheel = colorWheel * abs(sin(1. * gl_FragCoord.x / u_resolution.x));
    colorWheel = colorWheel * abs(sin(1. * gl_FragCoord.y / u_resolution.y));
    
    // set pixel color
    gl_FragColor = vec4(colorWheel, 1.0);
}