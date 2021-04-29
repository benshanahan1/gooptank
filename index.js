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
  u_mouse: { type: "v2", value: new Vector2() }
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

  // create a new mesh object and add it to the scene
  mesh = new Mesh(geometry, material);
  mesh.scale.set(window.innerWidth, window.innerHeight, 1);
  scene.add(mesh);

  // create the renderer
  renderer = new WebGLRenderer({ antialias: true, alpha: true });

  // set the window size, and make it resize automatically
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );

  // add the renderer to the page
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

  // add mouse listener
  document.onmousemove = function(e){
    uniforms.u_mouse.value.x = e.pageX
    uniforms.u_mouse.value.y = e.pageY
  }
}

var delta;
function raf() {
  requestAnimationFrame(raf);

  // advance the time uniforma and print the framerate
  delta = clock.getDelta();
  // console.log(1./delta);
  u_time += delta;

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

// function to change the size of the render if the window changes size
function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}
