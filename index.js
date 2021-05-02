require("file-loader?name=[name].[ext]!./src/html/index.html");
import {
  OrthographicCamera,
  Scene,
  Mesh,
  WebGLRenderer,
  ShaderMaterial,
  DataTexture,
  RGBFormat,
  PlaneBufferGeometry,
  PlaneGeometry,
  CircleGeometry,
  RingGeometry,
  BufferGeometry,
  BufferAttribute,
  Points,
  MeshBasicMaterial,
} from "three";
import vertexShader from "./src/glsl/vs.glsl";
import fragmentShader from "./src/glsl/fs.glsl";

let camera;
let scene;
let renderer;
let material;
let mesh;
let texture;
let w = window.innerWidth;
let h = window.innerHeight;

// data buffer
let data, uvs;
const bufWidth = 100;
const bufHeight = bufWidth;
const bufSize = bufWidth * bufHeight;

// initialize buffers and start animation loop
initialize();
raf();

// functions
function initialize() {
  renderer = new WebGLRenderer();
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);
  scene = new Scene();
  camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
  camera.position.z = 1;

  // create entirely white data buffer and fill with some random garbage
  data = new Uint8Array(3 * bufSize).fill(0);
  uvs = new Float32Array(2 * bufSize).fill(0);
  for (let i = 0; i < bufSize; i++) {
    // set pixel to random color
    data[i] = data[i + 1] = data[i + 2] = Math.floor(255 * Math.random());
    // compute uv
    const u = (i % bufWidth) / bufWidth;
    const v = ~~(i / bufHeight) / bufHeight; // ~~ is more efficient Math.floor
    const id = i * 2;
    uvs[id] = u;
    uvs[id + 1] = v;
  }
  texture = new DataTexture(data, bufWidth, bufHeight, RGBFormat);

  // material
  // material = new MeshBasicMaterial({ map: texture });
  material = new ShaderMaterial({
    uniforms: {
      input_texture: { value: texture },
    },
    vertexShader,
    fragmentShader,
  });

  // geometry
  let geometry = new PlaneBufferGeometry(w, h, 1, 1);
  // geometry.setAttribute("uv", new BufferAttribute(uvs, 2, true));
  mesh = new Mesh(geometry, material);
  // mesh.scale.set(w, h, 1);

  // add to scene
  scene.add(mesh);
}

function raf() {
  requestAnimationFrame(raf);
  renderer.clear();
  renderer.render(scene, camera);
}
