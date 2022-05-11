import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import nebula from '../img/nebula.jpeg'
import stars from '../img/stars.jpeg'

// create top object in the hierarchy 
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // enable shadow

// set size for all window
renderer.setSize(window.innerWidth, window.innerHeight);
// change backgroud
renderer.setClearColor(0xFFEA00);

// add the rendere to the page
document.body.appendChild(renderer.domElement);

// creating scene
const scene = new THREE.Scene();

// Background TEXTURE using image
const textureLoader = new THREE.TextureLoader(); // 1. way
//scene.background = textureLoader.load(nebula);

// cube texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader(); // 2. way
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
]);

// when you zoom out, objects will disappear
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200); // 1. way: between 0 and 200
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01); // 2. way: exponancially changes the value


// creating camera - perspective
const camera = new THREE.PerspectiveCamera(
    45    //fov
    , window.innerWidth / window.innerHeight // aspect
    , 0.1   // near
    , 1000  // far
);


// create axesHelper
const axesHelper = new THREE.AxesHelper(3);
// add to scene
scene.add(axesHelper);
// change camera position to see the axesHelper
camera.position.z = 5;
// OR use set method
camera.position.set(-10, 30, 30);

// CONTROL CAMERA
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// ADDING A BOX
const boxGeomerty = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeomerty, boxMaterial);
scene.add(box);

// ADDING A BOX with TEXTURE
const boxGeomerty2 = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial2 = new THREE.MeshStandardMaterial({
    //color: 0x00FF00,
    map: textureLoader.load(nebula)
});
const box2 = new THREE.Mesh(boxGeomerty2, boxMaterial2);
scene.add(box2);
box2.position.set(0, 15, 10);

// ADD PLANE
const planeGeomerty = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeomerty, planeMaterial);
scene.add(plane);
plane.receiveShadow = true; // enable shadow

// ADD GRID 
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
// fix: plane and grid merged
plane.rotation.x = -0.5 * Math.PI;

// ADD SPHERE
const sphereGeomerty = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial(
    {
        color: 0x0000FF,
        wireframe: false // makes sphere surface smooth
    });
const sphere = new THREE.Mesh(sphereGeomerty, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true; // enable shadow

// NOTE:  basic material does not require light but other materials do.

// LIGHTS
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// // create directional light
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true; // enable shadow
// directionalLight.shadow.camera.bottom = -12;

// // create directional light Helper
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);


// ADD GUI ELEMENTS
const gui = new dat.GUI();
const options = {
    sphereColor: '#FFEA00',
    wireframe: false,
    speed: 0.01,
    light: {
        angle: 0.2,
        penumbra: 0,
        intensity: 1
    }
};
gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
});
gui.add(options, 'speed', 0, 0.1);

// light
gui.add(options.light, 'angle', 0, 1);
gui.add(options.light, 'penumbra', 0, 1);
gui.add(options.light, 'intensity', 0, 1);


// BOUNCE THE SPHERE
let step = 0;

// ROTATE THE BOX IN TIME
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    // bouncing logic
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.light.angle;
    spotLight.penumbra = options.light.penumbra;
    spotLight.intensity = options.light.intensity;
    spotLightHelper.update();

    // render using scne and camera
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);



