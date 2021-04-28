require("file-loader?name=[name].[ext]!./src/html/index.html");
import {
  PerspectiveCamera,
  Scene,
  Mesh,
  WebGLRenderer,
  PlaneBufferGeometry,
  ShaderMaterial,
  MeshNormalMaterial,
  Vector2,
  Clock,
  Vector3,
} from "three";
import fragmentShader from "./src/glsl/frag.glsl";

let camera;
let scene;
let renderer;
let geometry;
let material;
let mesh;
let clock;

let u_time = 0;

// uniforms are "global" variables accessible from within the shader
let uniforms = {
  u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
  u_time: { value: u_time },
};

init();
raf();

function init() {
  camera = new PerspectiveCamera(
    5,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  scene = new Scene();
  clock = new Clock();

  geometry = new PlaneBufferGeometry();
  material = new ShaderMaterial({
    uniforms,
    fragmentShader,
  });

  mesh = new Mesh(geometry, material);
  mesh.scale.set(window.innerWidth, window.innerHeight, 1);
  scene.add(mesh);

  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // add scroll listener
  window.addEventListener(
    "wheel",
    function (e) {
      camera.position.z += e.deltaY * 0.1;
      if (camera.position.z < 25) camera.position.z = 25;
      else if (camera.position.z > 200) camera.position.z = 200;
      console.log(camera.position.z);
    },
    true
  );
}

function raf() {
  requestAnimationFrame(raf);
  u_time += clock.getDelta();

  // update uniforms
  material.uniforms.u_time.value = u_time;
  material.uniforms.u_resolution.value = new Vector2(
    window.innerWidth,
    window.innerHeight
  );


  // render frame
  renderer.clear();
  renderer.render(scene, camera);
}
