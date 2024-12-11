/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React, { useEffect, useRef } from 'react';


const FileRenderer = ({ setFileData }) => {

/**
 * LIL GUI - DEBUG
 */
// const gui = new GUI({
//   width: 300,
//   title: 'Options',
//   closeFolders: false,
// });

// gui.add(options, 'mode', ['Normal', 'Wireframe', 'Shaded']).name('Mode');
// gui.add(model.scale, 'x', 0.1, 5).name('Scale X');
//   gui.add(model.scale, 'y', 0.1, 5).name('Scale Y');
//   gui.add(model.scale, 'z', 0.1, 5).name('Scale Z');
// Clipping plane : un plan horizontal initial
// const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0); // Orientation Y descendante
// renderer.localClippingEnabled = true; // Activer les clipping planes
// const planeFolder = gui.addFolder('Clipping Plane');
//     const planeParams = {
//       constant: 0, // Décale le plan
//       x: 0, // Orientation X
//       y: -1, // Orientation Y
//       z: 0, // Orientation Z
//     };

//     planeFolder.add(planeParams, 'constant', -1, 1, 0.01).name('Plane Offset').onChange((value) => {
//       plane.constant = value;
//     });

//     planeFolder.add(planeParams, 'x', -1, 1, 0.01).name('Plane Normal X').onChange((value) => {
//       plane.normal.x = value;
//       plane.normal.normalize(); // Normaliser pour éviter les artefacts
//     });

//     planeFolder.add(planeParams, 'y', -1, 1, 0.01).name('Plane Normal Y').onChange((value) => {
//       plane.normal.y = value;
//       plane.normal.normalize();
//     });

//     planeFolder.add(planeParams, 'z', -1, 1, 0.01).name('Plane Normal Z').onChange((value) => {
//       plane.normal.z = value;
//       plane.normal.normalize();
//     });

//     planeFolder.open();
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// ----------------------------------------------------------------
// FIRST SCENE ----------------------------------------------------------------
//object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 'red'});
const mesh = new THREE.Mesh(geometry, material);
//position
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;

mesh.position.set(0.7, -0.6, 1)
scene.add(mesh);

//Scale
// mesh.scale.set(0.5, 0.5, 0.5);
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;

//Rotation : updatating one will update the other. Have to be careful with the order of rotation. Gimbal Lock.
//Quaternion: expresses a rotationbut in a more mathematical way.
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

// let mixer = null;
// const gltfLoader = new GLTFLoader()
// // if (setFileData) {
//   console.log('setFileData.path', setFileData.path)

//   gltfLoader.load(
//     setFileData.path,
//     (gltf) =>
//       {
//         console.log('glTF', gltf)
//         gltf.scene.scale.set(0.025, 0.025, 0.025)
//         window.onload = (e) => {
//         scene.add(gltf.scene)
//       }

//         // Animation
//         // mixer = new THREE.AnimationMixer(gltf.scene)
//         // const action = mixer.clipAction(gltf.animations[2])
//         // action.play()
//     },
//     undefined,
//     (error) => {
//         console.error('Erreur de chargement GLTF:', error);
//     }
//   )

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.onload = (e) => {
  window.addEventListener('resize', () =>
  {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
  /**
   * Camera
  */
 // Base camera
 const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
 camera.position.set(2, 2, 2)
 scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
*/
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
  {
    const elapsedTime = clock.getElapsedTime()
    previousTime = elapsedTime

    // Model animation
    // if(mixer)
    // {
    //     mixer.update(deltaTime)
    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
}

  return (
    <div id="canva">
      <div className="canva_content">
        <h2 id="file_name">{setFileData.name}</h2>
        <div className="canvas_content">
          <canvas className="webgl"></canvas>
          <div className="informations_content">
            <h3>Informations</h3>
            <ul>
              <li>Vertices: </li>
              <li>Triangles: </li>
              <li>Size X: </li>
              <li>Size Y: </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileRenderer
