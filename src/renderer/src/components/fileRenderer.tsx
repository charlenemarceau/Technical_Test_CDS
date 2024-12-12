/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const FileRenderer = ({ setFileData, setUrlData }) => {


  /**
 * LIL GUI - DEBUG
 */
  const gui = new GUI({
    width: 300,
    title: 'Viewing options',
    closeFolders: false,
  });

  // Référence pour le canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let mixer: THREE.AnimationMixer | null = null;

  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas non trouvé.');
      return;
    }

    // Initialisation de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xA3AEF6 );
    console.log('test', setFileData.path,)
 // Object Loader
  let object3D: THREE.Object3D | null = null;

  if (setFileData) {
    const fileExtension = setFileData?.name.split('.').pop()?.toLowerCase();
    const loader = fileExtension === 'gltf' || fileExtension === 'glb' ? new GLTFLoader() : new OBJLoader();

    console.log('OB', loader, fileExtension, setUrlData);
    loader.load(
      setUrlData,
      (object) => {
        if (object3D) {
          scene.remove(object3D); // Remove the previous object if exists
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        object3D = fileExtension === 'gltf' || fileExtension === 'glb' ? (object as any).scene : object;
        object3D.scale.set(0.5, 0.5, 0.5);
        scene.add(object3D);
        // Animation
        mixer = new THREE.AnimationMixer(object3D.scene)
        const action = mixer.clipAction(object3D.animations[2])
        action.play()
      },
      undefined,
      (error) => {
        console.error('Error loading the model:', error);
      }
    );
    }
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

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // Taille du canvas
    const sizes = {
      width: (window.innerWidth / 3) * 2,
      height: (window.innerWidth / 3) * 1.75,
    };

    // Caméra
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(3, 3, 3)
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current)
    controls.target.set(0, 0.75, 0)
    controls.enableDamping = true

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const clock = new THREE.Clock()
    let previousTime = 0

    const tick = () =>
      {
          const elapsedTime = clock.getElapsedTime()
          const deltaTime = elapsedTime - previousTime
          previousTime = elapsedTime

          // Model animation
          if(mixer)
          {
              mixer.update(deltaTime)
          }

          // Update controls
          controls.update()

          // Render
          renderer.render(scene, camera)

          // Call tick again on the next frame
          window.requestAnimationFrame(tick)
      }

      tick();

    // Gestion du redimensionnement
    const handleResize = () => {
      sizes.width = (window.innerWidth / 3) * 2;
      sizes.height = (window.innerWidth / 3) * 1.75;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div id="canva">
      <div className="canva_content">
        <h2 id="file_name">{setFileData.name}</h2>
        <div className="canvas_content">
          <canvas ref={canvasRef} className="webgl"></canvas>
          <div className="informations_content">
            <h2>Details</h2>
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
