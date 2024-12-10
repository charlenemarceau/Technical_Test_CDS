/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { arrayBuffer } from 'stream/consumers';


const FileRenderer = ({ setFileData }) => {

/**
 * LIL GUI - DEBUG
 */
// const gui = new GUI({
//   width: 300,
//   title: 'Options',
//   closeFolders: false,
// });

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

// sizes
const sizes = {
  width: 500,
  height: 400
}

//camera is an object
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera)

//lookAt rotates the object so that its -z faces the target you provided
// camera.lookAt(new THREE.Vector3(0, -1, 0));
// camera.lookAt(mesh.position);

//renderer (provides a picture)
const container = document.getElementById('canva');
if (container) {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  // Redimensionner le canvas
  window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  });
}

// if (setFileData) {
//     // Déterminer l'extension du fichier pour choisir le bon loader
//     const ext = setFileData ? setFileData.path.split('.').pop()?.toLowerCase() : undefined;
//     if (ext === 'glb' || ext === 'gltf') {
//       console.log('ext', ext);
//         const loader = new GLTFLoader();
//         loader.load(setFileData, function(gltf) {
//             const model = gltf.scene;
//             scene.add(model);
//             model.scale.set(2, 2, 2);  // Mise à l'échelle du modèle
//             model.position.set(0, 0, 0);  // Position initiale
//         }, undefined, function(error) {
//             console.error('Erreur lors du chargement du modèle GLTF:', error);
//         });
//     } else if (ext === 'obj') {
//         const loader = new OBJLoader();
//         loader.load(setFileData, function(obj) {
//             scene.add(obj);
//             obj.scale.set(1, 1, 1);  // Mise à l'échelle
//             obj.position.set(0, 0, 0);  // Position initiale
//         }, undefined, function(error) {
//             console.error('Erreur lors du chargement du modèle OBJ:', error);
//         });
//     } else {
//       // Rediriger l'utilisateur vers la page de démarrage
//       window.location.href = 'index.html';
//       alert('Format de fichier non pris en charge');
//     }
// } else {
//     alert('Aucun modèle trouvé dans sessionStorage.');
// }

const file = setFileData;
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = setFileData;
      const loader = new GLTFLoader();
      console.log("Modèle :", e);

      // Charger le modèle à partir du buffer
      loader.parse(
        arrayBuffer,
        "",
        (gltf) => {
          console.log("Modèle chargé :", gltf);
          scene.add(gltf.scene); // Ajoutez le modèle à votre scène
        },
        (error) => {
          console.error("Erreur de chargement :", error);
        }
      );
    };

    reader.readAsArrayBuffer(file);
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
