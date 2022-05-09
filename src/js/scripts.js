import * as THREE from 'three';

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



// render using scne and camera
renderer.render(scene, camera);
