require("file-loader?name=[name].[ext]!./src/html/index.html");
import * as THREE from "three";

let camera, scene, renderer;
let geometry, material, mesh;

init();

function init() {
  camera = new THREE.PerspectiveCamera(
    5,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  scene = new THREE.Scene();

  geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);
}

function animation(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;
  mesh.rotation.z = time / 500;

  renderer.render(scene, camera);
}
