require("file-loader?name=[name].[ext]!./src/html/index.html");
import {
  OrthographicCamera,
  Scene,
  Mesh,
  WebGLRenderer,
  WebGLRenderTarget,
  PlaneBufferGeometry,
  ShaderMaterial,
  MeshNormalMaterial,
  Vector2,
  Clock,
  Vector3,
  RGBAFormat,
  FloatType,
  DataTexture
} from "three";
import frag1 from "./src/glsl/frag1.glsl";
import frag2 from "./src/glsl/frag2.glsl";

///////////////////////////////////////////////////////////////////////////////
// basic setup
///////////////////////////////////////////////////////////////////////////////

let u_time = 0;


let camera = new OrthographicCamera(
  -window.innerWidth / 2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  -window.innerHeight / 2,
  0.1,
  1000
);
camera.position.z = 100;

///////////////////////////////////////////////////////////////////////////////
// frag1
///////////////////////////////////////////////////////////////////////////////

let scene1 = new Scene();
let geometry1 = new PlaneBufferGeometry();
let material1 = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    u_time: { value: u_time },
    u_mouse: { type: "v2", value: new Vector2() }
  },
  fragmentShader: frag1,
});

// create a new mesh object and add it to the scene
let mesh1 = new Mesh(geometry1, material1);
mesh1.scale.set(window.innerWidth, window.innerHeight);
scene1.add(mesh1);


let rt1 = new WebGLRenderTarget(10, 10, {
  format: RGBAFormat,
  type: FloatType});

///////////////////////////////////////////////////////////////////////////////
// frag2
///////////////////////////////////////////////////////////////////////////////

let input_data = new Float32Array(10*10*4)
let input_texture = new DataTexture(input_data, 10, 10, RGBAFormat, FloatType);
input_texture.needsUpdate = true;

let scene2 = new Scene();
let geometry2 = new PlaneBufferGeometry();
let material2 = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    u_time: { value: u_time },
    u_mouse: { type: "v2", value: new Vector2(),
    u_texture: input_texture}
  },
  fragmentShader: frag2,
});

// create a new mesh object and add it to the scene
let mesh2 = new Mesh(geometry2, material2);
mesh2.scale.set(window.innerWidth, window.innerHeight, 1);
scene2.add(mesh2);

///////////////////////////////////////////////////////////////////////////////
// basic setup
///////////////////////////////////////////////////////////////////////////////

// clock for keeping track of time
let clock = new Clock();

// create the renderer
let renderer = new WebGLRenderer({ antialias: true, alpha: true });

// set the window size, and make it resize automatically
onWindowResize();
window.addEventListener( 'resize', onWindowResize, false );

// add the renderer to the page
document.body.appendChild(renderer.domElement);

// add mouse listener
document.onmousemove = function(e){
  material1.uniforms.u_mouse.value.x = e.pageX
  material1.uniforms.u_mouse.value.y = e.pageY
}

// function to change the size of the render if the window changes size
function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    material2.uniforms.u_resolution.value.x = renderer.domElement.width;
    material2.uniforms.u_resolution.value.y = renderer.domElement.height;
}

///////////////////////////////////////////////////////////////////////////////
// run the animation
///////////////////////////////////////////////////////////////////////////////

raf();

function raf() {
  requestAnimationFrame(raf);

  // advance the time uniforms
  u_time += clock.getDelta();;

  // render the first frag
  mesh1.visible = true;
  material1.uniforms.u_time.value = u_time;
  renderer.setSize(10, 10);
  renderer.setRenderTarget(rt1);
  renderer.render(scene1, camera)
  renderer.setRenderTarget(null)
  mesh1.visible = false;

  // console.log(rt1.texture);

  // render the second frag
  renderer.setSize( window.innerWidth, window.innerHeight );
  material2.uniforms.u_texture = rt1.texture;
  material2.uniforms.u_time.value = u_time;
  renderer.clear();
  renderer.render(scene2, camera);
}
