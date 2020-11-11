const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerWidth, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth*0.5,window.innerWidth*0.4 );
document.getElementById("main-scene").appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth*0.5, window.innerWidth*0.5)
}

window.addEventListener('resize', onWindowResize)

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();