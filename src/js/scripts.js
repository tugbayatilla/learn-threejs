import * as THREE from 'three';
import { CameraHelper } from 'three';

// create top object in the hierarchy 
const renderer = new THREE.WebGLRenderer();

// set size for all window
renderer.setSize(window.innerWidth, window.innerHeight);

// add the rendere to the page
document.body.appendChild(renderer.domElement);



// creating scene
const scene = new THREE.Scene();

// creating camera - perspective
const camera = new THREE.PerspectiveCamera(
    75    //fov
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
camera.position.set(0, 2, 5);


// ADDING A BOX
const boxGeomerty = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeomerty, boxMaterial);
scene.add(box);

// ROTATE THE BOX IN TIME
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    // render using scne and camera
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);



