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
  FloatType,
  DataTexture,
  RGBAFormat,
} from "three";
import frag1 from "./src/glsl/0010_horiz_warp.glsl";
import frag2 from "./src/glsl/0020_color_change.glsl";
import frag3 from "./src/glsl/0100_postprocess.glsl";

const getWindowSize = () => [window.innerWidth, window.innerHeight];

///////////////////////////////////////////////////////////////////////////////
// basic setup
///////////////////////////////////////////////////////////////////////////////

let [w, h] = getWindowSize();

let dataWidth = w;
let dataHeight = h;
let dataSize = dataWidth * dataHeight;
let dataByteDepth = 4;
let nSeedPixels = 4096;

let u_time = 0;

let camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.01, 1000);
camera.position.z = 100;

///////////////////////////////////////////////////////////////////////////////
// initialize buffers
///////////////////////////////////////////////////////////////////////////////

let inputData = new Float32Array(dataSize * dataByteDepth).fill(0);
for (let i = 0; i < nSeedPixels; i++) {
  const dataIdx = Math.floor(dataSize * dataByteDepth * Math.random());
  inputData[dataIdx] = Math.random();
  inputData[dataIdx + 1] = Math.random();
  inputData[dataIdx + 2] = Math.random();
  inputData[dataIdx + 3] = 1.0;
}
let inputTexture = new DataTexture(
  inputData,
  dataWidth,
  dataHeight,
  RGBAFormat,
  FloatType
);

///////////////////////////////////////////////////////////////////////////////
// frag1
///////////////////////////////////////////////////////////////////////////////

let scene1 = new Scene();
let geometry1 = new PlaneBufferGeometry();
let material1 = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(w, h) },
    u_time: { value: u_time },
    u_mouse: { value: new Vector2() },
    u_texture: { value: inputTexture },
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
    u_mouse: { value: new Vector2() },
    u_texture: { value: inputTexture },
  },
  fragmentShader: frag2,
});

// create a new mesh object and add it to the scene
let mesh2 = new Mesh(geometry2, material2);
mesh2.scale.set(w, h);
scene2.add(mesh2);

let rt2 = new WebGLRenderTarget(w, h, {
  format: RGBAFormat,
  type: FloatType,
});

///////////////////////////////////////////////////////////////////////////////
// frag3
///////////////////////////////////////////////////////////////////////////////

let scene3 = new Scene();
let geometry3 = new PlaneBufferGeometry();
let material3 = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(w, h) },
    u_time: { value: u_time },
    u_mouse: { value: new Vector2() },
    u_texture: { value: null },
  },
  fragmentShader: frag3,
});

// create a new mesh object and add it to the scene
let mesh3 = new Mesh(geometry3, material3);
mesh3.scale.set(w, h, 1);
scene3.add(mesh3);

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
window.addEventListener("mousemove", onMouseMove, false);

// add the renderer to the page
document.body.appendChild(renderer.domElement);

// add mouse listener
function onMouseMove(e) {
  const [w, h] = getWindowSize();
  const { pageX, pageY } = e;
  material1.uniforms.u_mouse = { value: { x: pageX / w, y: pageY / h } };
  material2.uniforms.u_mouse = { value: { x: pageX / w, y: pageY / h } };
}

// function to change the size of the render if the window changes size
function onWindowResize(e) {
  let [w, h] = getWindowSize();
  renderer.setSize(w, h);
  material2.uniforms.u_resolution = {
    value: { x: renderer.domElement.width, y: renderer.domElement.height },
  };
}

///////////////////////////////////////////////////////////////////////////////
// run the animation
///////////////////////////////////////////////////////////////////////////////

raf();

function raf() {
  requestAnimationFrame(raf);

  let [w0, h0] = getWindowSize();

  // advance the time uniforms
  u_time += clock.getDelta();

  // first layer
  mesh1.visible = true;
  material1.uniforms.u_time.value = u_time;
  renderer.setSize(w0, h0);
  renderer.setRenderTarget(rt1);
  renderer.render(scene1, camera);
  renderer.setRenderTarget(null);
  mesh1.visible = false;

  // pass first layer back to second
  material2.uniforms.u_texture.value = rt1.texture;

  // second layer
  mesh2.visible = true;
  material2.uniforms.u_time.value = u_time;
  renderer.setSize(w0, h0);
  renderer.setRenderTarget(rt2);
  renderer.render(scene2, camera);
  renderer.setRenderTarget(null);
  mesh2.visible = false;

  // pass second layer back to first
  material1.uniforms.u_texture.value = rt2.texture;

  // postprocess
  material3.uniforms.u_texture.value = rt2.texture;
  renderer.setSize(w0, h0);
  renderer.clear();
  renderer.render(scene3, camera);
}
