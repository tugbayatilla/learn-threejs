import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// create top object in the hierarchy 
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // enable shadow

// set size for all window
renderer.setSize(window.innerWidth, window.innerHeight);

// add the rendere to the page
document.body.appendChild(renderer.domElement);



// creating scene
const scene = new THREE.Scene();

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
sphere.position.set(-10,10,0);
sphere.castShadow = true; // enable shadow

// NOTE:  basic material does not require light but other materials do.

// LIGHTS
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
// create directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true; // enable shadow
directionalLight.shadow.camera.bottom = -12;

// create directional light Helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const spotLight = new THREE.SpotLight('Red');
scene.add(spotLight);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

// ADD GUI ELEMENTS
const gui = new dat.GUI();
const options = {
    sphereColor: '#FFEA00',
    wireframe: false,
    speed: 0.01
};
gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});
gui.add(options, 'speed', 0, 0.1);

// BOUNCE THE SPHERE
let step = 0;

// ROTATE THE BOX IN TIME
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    // bouncing logic
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    // render using scne and camera
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);



