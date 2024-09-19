import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { OutputPass } from "three/examples/jsm/Addons.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);
let control = new TransformControls(camera, renderer.domElement);
let control2 = new TransformControls(camera, renderer.domElement);
// control.setRotationSnap(3.14);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
// const GUI = lil.GUI;
const gui = new GUI();

const bloomLayer = new THREE.Layers();
bloomLayer.set(1);

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.43,
  0,
  0
  // 0.5,
  // 0.2,
  // 0.2
);

const manager = new THREE.LoadingManager();

manager.onLoad = function () {
  document.getElementById("loading").style.backgroundColor = "white";
  alert("loaded");
};
composer.addPass(bloomPass);
const outputPass = new OutputPass();
composer.addPass(outputPass);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var f = true;
function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
document.addEventListener("pointerdown", render);
function render() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  // const intersects = raycaster.intersectObjects(scene.children);
  const intersects = raycaster.intersectObjects(scene.children, false);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects.length > 0) {
      // if (f) window.open("https://www.youraddress.com", "_self");
      // f = false;
      // intersects[i].object.material.color.set(0xff0000);
      // intersects[i].object.layers.toggle(1);
      control2.attach(intersects[i].object);

      // scene.add(control2);
      console.log(intersects[i].object.position, intersects[i].object.rotation);
      // composer.render();
    }
    // break;
    // else control2.detach(intersects[i].object);
  }
  renderer.render(scene, camera);
}

window.addEventListener("pointermove", onPointerMove);

const geometry_floor = new THREE.PlaneGeometry(120, 120, 120, 120);
const geometry_wall = new THREE.BoxGeometry(2, 20, 20, 5, 5, 5);
const material_floor = new THREE.MeshPhongMaterial();

const wall1 = new THREE.TextureLoader().load("./wall2.jpg");
const wall1_normal = new THREE.TextureLoader().load("./wall2_normal.jpg");
wall1.wrapS = THREE.RepeatWrapping;
wall1.wrapT = THREE.RepeatWrapping;
wall1.repeat.set(10, 10);
wall1_normal.wrapS = THREE.RepeatWrapping;
wall1_normal.wrapT = THREE.RepeatWrapping;
wall1_normal.repeat.set(10, 10);
material_floor.map = wall1;
material_floor.normalMap = wall1_normal;

const material_wall = new THREE.MeshPhongMaterial();
const wall2 = new THREE.TextureLoader().load("./wall3.jpg");
const wall2_normal = new THREE.TextureLoader().load("./wall3_normal.jpg");
wall2.wrapS = THREE.RepeatWrapping;
wall2.wrapT = THREE.RepeatWrapping;
wall2.repeat.set(2, 2);
wall2_normal.wrapS = THREE.RepeatWrapping;
wall2_normal.wrapT = THREE.RepeatWrapping;
wall2_normal.repeat.set(2, 2);
material_wall.map = wall2;
material_wall.normalMap = wall2_normal;

const light = new THREE.AmbientLight(0x404040, 1); // soft white light
scene.add(light);
const floor = new THREE.Mesh(geometry_floor, material_floor);
floor.rotation.x = 4.71239;
// floor.rotateX(4.71239);

const wall_1 = new THREE.Mesh(geometry_wall, material_wall);
// wall.position.x = -10;
wall_1.position.y = 10;
// wall.position.z = -10;
wall_1.rotateY(1.5708);

const wall_2 = new THREE.Mesh(geometry_wall, material_wall);
// wall_2.position.x = 20;
wall_2.position.y = 10;
// wall_2.position.z = 10;
// wall_2.rotateY(0.785398);

const wall_3 = new THREE.Mesh(geometry_wall, material_wall);
wall_3.position.x = 50;
wall_3.position.y = 10;
wall_3.position.z = -10;
// wall_3.rotateY(-0.785398);
scene.add(floor, wall_2, wall_3);

let font = undefined;
const loader = new FontLoader();
loader.load("./font.json", function (font) {
  const material = new THREE.MeshBasicMaterial({ color: 0xff3ea5 });
  const geometry = new TextGeometry("Abolfazl Samini", {
    font: font,
    size: 130,
    depth: 80,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry.scale(0.01, 0.02, 0.01);
  const text = new THREE.Mesh(geometry, material);
  text.position.x = -6.2;
  text.position.y = 17;
  text.position.z = 0.6;
  // text.rotateY(0.5);
  // text.rotateY(-0.785398);

  const material_mail = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const geometry_mail = new TextGeometry("contact @ abolfazls.ir", {
    font: font,
    size: 130,
    depth: 80,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry_mail.scale(0.01, 0.02, 0.01);
  const text_email = new THREE.Mesh(geometry_mail, material_mail);
  text_email.position.x = -7;
  text_email.position.y = 10;
  text_email.position.z = 0.6;
  // text_email.rotateY(1.908);
  const material_detail = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const geometry_detail = new TextGeometry("Full-Stack developer", {
    font: font,
    size: 130,
    depth: 80,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry_detail.scale(0.01, 0.02, 0.01);
  const text_detail = new THREE.Mesh(geometry_detail, material_detail);
  text_detail.position.x = -7;
  text_detail.position.y = 1;
  text_detail.position.z = 0.6;

  // text_email.rotateY(-0.785398);
  // scene.add(text, text_email);

  // control.attach(text);
  // scene.add(control);
  const pointLight = new THREE.PointLight(0xff3ea5, 20, 50, 2);
  pointLight.position.set(0, 18, 5);
  // scene.add(control);
  scene.add(pointLight, text_detail);
  const pointLight_email = new THREE.PointLight(0xffffff, 10, 50, 2);
  pointLight_email.position.set(0, 11, 5);
  // scene.add(control);
  scene.add(pointLight, pointLight_email);
  // const sphereSize = 1;
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  // scene.add(pointLightHelper);
  wall_1.attach(text);
  wall_1.attach(text_email);
  wall_1.attach(pointLight);
  wall_1.attach(pointLight_email);
  document.getElementById("loading").style.display = "none";
  // console.log(text.position, text.rotation);
});
const point = new THREE.Object3D();
const point2 = new THREE.Object3D();
// point.position.x = -10;
// point.position.y = -10;
// point.position.z = -10;
// wall.attach(point);
point.attach(wall_1);
// point.translateX(-7);
// point.rotateY(1.908);
control.attach(point);

point2.attach(wall_2);
point2.rotateY(1);
point2.translateX(15);
scene.add(point, point2);
// point.position.z = 15;
const pointLight = new THREE.PointLight(0xffffff, 10, 50, 2);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
// scene.add(pointLightHelper);

camera.position.set(0, 20, 50);
// camera.rotateX(-1.86694);
// camera.rotateY(-1.5);
// controls.update();
// camera.rotateZ(-1.871);

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -100, 100);
cameraFolder.add(camera.position, "y", -100, 100);
cameraFolder.add(camera.position, "z", -100, 100);
cameraFolder.add(camera.rotation, "x", -50, Math.PI * 2, 0.1);
cameraFolder.add(camera.rotation, "y", -50, Math.PI * 2, 0.1);
cameraFolder.add(camera.rotation, "z", -50, Math.PI * 2, 0.1);
cameraFolder.close();
const bloom = gui.addFolder("Bloom");
bloom.add(bloomPass, "strength", -10, 10, 0.01);
bloom.add(bloomPass, "radius", -10, 10, 0.01);
bloom.add(bloomPass, "threshold", -10, 10, 0.01);

// camera.lookAt(0, -25, 0);
// camera.rotateZ(3.14159);
// camera.position.set(-22, 17, 1.8);
// camera.lookAt(20, 10, 8);
// function updateCamera(event) {
//   event.preventDefault();
//   // camera.position.z += ev.deltaY / 100;
//   camera.position.z += 1;
// }
// window.addEventListener("mousewheel", updateCamera, false);
var toggle = false;
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 32) {
    controls.enabled = toggle;
    toggle = !toggle;
  }
  if (keyCode == 82) {
    control.setMode("rotate");
    control2.setMode("rotate");
  }
  if (keyCode == 69) {
    control.setMode("translate");
    control2.setMode("translate");
  }
  if (keyCode == 84) {
    control.setMode("scale");
    control2.setMode("scale");
  }
  if (keyCode == 67) {
    console.log(camera.position, camera.rotation);
  }
  if (keyCode == 16) {
    control.setTranslationSnap(1);
    control.setRotationSnap(THREE.MathUtils.degToRad(15));
    control.setScaleSnap(0.25);
  }
}
window.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "Shift":
      control.setTranslationSnap(null);
      control.setRotationSnap(null);
      control.setScaleSnap(null);
      break;
  }
});

window.addEventListener("wheel", function (event) {
  // camera.position.z += event.deltaY * 0.05;
});

controls.update();
function animate() {
  composer.render();
  // console.log(pointLight.position);
  // point.position.x += 0.1;
  requestAnimationFrame(animate);
}

animate();
