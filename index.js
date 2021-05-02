require("file-loader?name=[name].[ext]!./src/html/index.html");
import {
  OrthographicCamera,
  Scene,
  Mesh,
  WebGLRenderer,
  WebGLRenderTarget,
  PlaneBufferGeometry,
  ShaderMaterial,
  Vector2,
  Clock,
  RGBAFormat,
  FloatType,
  DataTexture,
} from "three";
import frag1 from "./src/glsl/frag1.glsl";
import frag2 from "./src/glsl/frag2.glsl";

const getWindowSize = () => [window.innerWidth, window.innerHeight];

///////////////////////////////////////////////////////////////////////////////
// basic setup
///////////////////////////////////////////////////////////////////////////////

let [w, h] = getWindowSize();

let dataWidth = 10;
let dataHeight = 10;

let u_time = 0;

let camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000);
camera.position.z = 100;

///////////////////////////////////////////////////////////////////////////////
// frag1
///////////////////////////////////////////////////////////////////////////////

// create a data texture
let input_data = new Float32Array(dataWidth * dataHeight * 4).map((o) =>
  Math.random()
);
let input_texture = new DataTexture(
  input_data,
  dataWidth,
  dataHeight,
  RGBAFormat,
  FloatType
);
// input_texture.needsUpdate = true;

let scene1 = new Scene();
let geometry1 = new PlaneBufferGeometry();
let material1 = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(w, h) },
    u_time: { value: u_time },
    u_mouse: { type: "v2", value: new Vector2() },
    u_texture: { value: input_texture },
  },
  fragmentShader: frag1,
});

// create a new mesh object and add it to the scene
let mesh1 = new Mesh(geometry1, material1);
mesh1.scale.set(w, h);
scene1.add(mesh1);

let rt1 = new WebGLRenderTarget(w, h, {
  format: RGBAFormat,
  type: FloatType,
});

///////////////////////////////////////////////////////////////////////////////
// frag2
///////////////////////////////////////////////////////////////////////////////

let scene2 = new Scene();
let geometry2 = new PlaneBufferGeometry();
let material2 = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(w, h) },
    u_time: { value: u_time },
    u_mouse: { type: "v2", value: new Vector2() },
    u_texture: { value: null },
  },
  fragmentShader: frag2,
});

// create a new mesh object and add it to the scene
let mesh2 = new Mesh(geometry2, material2);
mesh2.scale.set(w, h, 1);
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
window.addEventListener("resize", onWindowResize, false);

// add the renderer to the page
document.body.appendChild(renderer.domElement);

// add mouse listener
document.onmousemove = function (e) {
  material1.uniforms.u_mouse.value.x = e.pageX;
  material1.uniforms.u_mouse.value.y = e.pageY;
};

// function to change the size of the render if the window changes size
function onWindowResize(event) {
  let [w, h] = getWindowSize();
  renderer.setSize(w, h);
  material2.uniforms.u_resolution.value.x = renderer.domElement.width;
  material2.uniforms.u_resolution.value.y = renderer.domElement.height;
}

///////////////////////////////////////////////////////////////////////////////
// run the animation
///////////////////////////////////////////////////////////////////////////////

raf();

function raf() {
  requestAnimationFrame(raf);

  let [w2, h2] = getWindowSize();

  // advance the time uniforms
  u_time += clock.getDelta();

  // render the first frag
  mesh1.visible = true;
  material1.uniforms.u_time.value = u_time;
  renderer.setSize(w2, h2);
  renderer.setRenderTarget(rt1);
  renderer.render(scene1, camera);
  renderer.setRenderTarget(null);
  mesh1.visible = false;

  // console.log(rt1.texture);

  // render the second frag
  renderer.setSize(w2, h2);
  material2.uniforms.u_texture.value = rt1.texture;
  material2.uniforms.u_time.value = u_time;
  renderer.clear();
  renderer.render(scene2, camera);
}
