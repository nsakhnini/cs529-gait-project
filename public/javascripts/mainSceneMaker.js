// Find the latest version by visiting https://unpkg.com/three. The URL will
// redirect to the newest stable release.
// import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2)/ (window.innerHeight*0.9) , 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( (window.innerWidth/2),window.innerHeight *0.9);

//Adding orbit controls to rotate , zoom and pan
//scene.controls = new OrbitControls(camera, renderer.domElement);
// scene.controls.mouseButtons = {
//     LEFT: THREE.MOUSE.ROTATE,
//     MIDDLE: THREE.MOUSE.DOLLY,
//     RIGHT: THREE.MOUSE.PAN
// }

document.getElementById("main-scene").appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function onWindowResize() {
    camera.aspect = (window.innerWidth/2) /(window.innerHeight*0.9);
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth/2),window.innerHeight*0.9);
}

window.addEventListener('resize', onWindowResize)

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();
