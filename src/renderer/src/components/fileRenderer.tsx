/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const FileRenderer = ({ setFileData }) => {
  // Référence pour le canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas non trouvé.');
      return;
    }

    // Initialisation de la scène
    const scene = new THREE.Scene();
    const gltfLoader = new GLTFLoader()


    gltfLoader.load(
      setFileData.path,
      (gltf) =>
      {
          gltf.scene.scale.set(0.025, 0.025, 0.025)
          scene.add(gltf.scene)

          // Animation
          // mixer = new THREE.AnimationMixer(gltf.scene)
          // const action = mixer.clipAction(gltf.animations[2])
          // action.play()
      }
  )

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
      height: (window.innerWidth / 3) * 2,
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
          // const deltaTime = elapsedTime - previousTime
          previousTime = elapsedTime

          // Model animation
          // if(mixer)
          // {
          //     mixer.update(deltaTime)
          // }

          // Update controls
          // controls.update()

          // Render
          renderer.render(scene, camera)

          // Call tick again on the next frame
          window.requestAnimationFrame(tick)
      }

      tick();

    // Gestion du redimensionnement
    const handleResize = () => {
      sizes.width = (window.innerWidth / 3) * 2;
      sizes.height = (window.innerWidth / 3) * 2;

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
