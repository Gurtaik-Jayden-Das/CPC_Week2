import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./styles.css";

//resizing screen so js graphics resize when window screens are

let sceneHeight, sceneWidth;

let scene, camera, renderer;
let geometry, material, cube;
let colour, intensity, light;
let ambientLight;

let orbit;

let listener, sound, audioLoader;

let clock, delta, interval;

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", init);

function init() {
  //remove overlay
  let overlay = document.getElementById("overlay");
  overlay.remove();

  //screen reize variables declared
  sceneHeight = window.innerWidth;
  sceneHeight = window.innerHeight;

  //create our clock and set interval at 30 fpx
  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 30;

  //create our scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfdfdf);

  //create our camera //change first parameter '750' to change the size of the camera zoom and size the shape will appear as
  camera = new THREE.PerspectiveCamera(
    750,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  //specify our renderer and add it to out document
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // create the orbit controls instance so we can use the mouse to move around our scene
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = true;

  //lighting
  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // create a box to spin
  geometry = new THREE.BoxGeometry();
  material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  // sound for single source and single listener

  listener = new THREE.AudioListener();
  camera.add(listener);
  sound = new THREE.PositionalAudio(listener);

  audioLoader = new THREE.AudioLoader();
  audioLoader.load("./sounds/synth.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(10);
    sound.setDirectionalCone(180, 230, 0.1);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
  //for resizing the window
  window.addEventListener("resize", onWindowResize, false);
  play();
}
function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function stop() {
  renderer.setAnimationLoop(null);
}

function update() {
  orbit.update();

  cube.rotation.x += 0.01; //what happens when you change cube.rotation to cube.position
  cube.rotation.y += 0.04;
  cube.rotation.z -= 0.01;
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
