require("file-loader?name=[name].[ext]!./src/html/index.html");
import {
  OrthographicCamera,
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
import frag1 from "./src/glsl/frag2.glsl";
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

let scene = new Scene();

///////////////////////////////////////////////////////////////////////////////
// frag1
///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// frag2
///////////////////////////////////////////////////////////////////////////////

let geometry = new PlaneBufferGeometry();
let material = new ShaderMaterial({
  uniforms: {
    u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    u_time: { value: u_time },
    u_mouse: { type: "v2", value: new Vector2() }
  },
  fragmentShader: frag2,
});

// create a new mesh object and add it to the scene
let mesh = new Mesh(geometry, material);
mesh.scale.set(window.innerWidth, window.innerHeight, 1);
scene.add(mesh);

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
  material.uniforms.u_mouse.value.x = e.pageX
  material.uniforms.u_mouse.value.y = e.pageY
}

// function to change the size of the render if the window changes size
function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    material.uniforms.u_resolution.value.x = renderer.domElement.width;
    material.uniforms.u_resolution.value.y = renderer.domElement.height;
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
  // mesh1.visible = true;
  // material1.uniforms.u_time.value = u_time;
  // renderer.setSize( width1, height1 )
  // renderer.setRenderTarget(rt1)
  // renderer.render(scene1, camera1)
  // renderer.setRenderTarget(null)
  // mesh1.visible = false;

  // render the second frag
  material.uniforms.u_time.value = u_time;
  renderer.clear();
  renderer.render(scene, camera);
}
