/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import icon from "../assets/icon.png";

const FileRenderer = ({ setFileData, setUrlData }) => {
  const [verticesCount, setVerticesCount] = useState(0);
  const [trianglesCount, setTrianglesCount] = useState(0);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0, z: 0 });
  // const [clippingPlaneZ, setClippingPlaneZ] = useState(100);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clippingPlaneZ, setClippingPlaneZ] = useState(100);
  const [updateClippingPlane, setUpdateClippingPlane] = useState<((value: number) => void) | null>(null);

  /**
  * LIL GUI - DEBUG
  */
  const gui = new GUI({
    width: 300,
    title: 'Viewing options',
    closeFolders: false,
  });

  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas non trouvé.');
      return;
    } else {
      setIsCanvasReady(true); // Une fois le canvas prêt
    }

    // Scene init
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xA3AEF6 );

    // Object Loader
    let object3D: THREE.Object3D | null = null;

    if (setFileData) {
      let loader;
      const fileExtension = setFileData?.name.split('.').pop()?.toLowerCase();
      switch(fileExtension) {
        case 'gltf':
        case 'glb':
          loader = new GLTFLoader();
          break;
        case 'obj':
          loader = new OBJLoader();
          break;
        case'stl':
          loader = new STLLoader();
          break;
        default:
          console.error('Format de fichier non supporté.');
          return;
      }


      // loading of the 3D Object
      loader.load(
        setUrlData,
        (object) => {
        object3D = fileExtension === 'gltf' || fileExtension === 'glb'  || fileExtension === 'stl' ? (object as any).scene : object;

        // Render the scene
        object3D.scale.set(0.5, 0.5, 0.5);
        scene.add(object3D);

        // Calcul de la bounding box
        const box = new THREE.Box3().setFromObject(object3D);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Adjustment to center the camera
        const maxSize = Math.max(size.x, size.y, size.z);

        // Adjust object scale if too small
        const minSize = 0.1;
        if (maxSize < minSize) {
          const scaleFactor = minSize / maxSize;
          object3D.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }
        const distance = maxSize / (2 * Math.tan((camera.fov * Math.PI) / 360));
        camera.position.set(center.x, center.y, center.z + distance * 1.5);
        camera.near = distance / 100;
        camera.far = distance * 10;
        camera.updateProjectionMatrix();

        // Ajuster OrbitControls
        controls.target.copy(center);
        controls.update();

        // GUI
        setTimeout(() => {

          object3D.traverse((child) => {
            if (child.isMesh) {
              child.material.clippingPlanes = [clippingPlane];
              child.material.clipShadows = true; // Ajoute des ombres coupées
              child.material.opacity = 0.8; // Ajuste l'opacité pour montrer l'effet
              child.material.clipIntersection = true;
              const material = child.material;
              //GUI
              gui.add(object3D, 'visible').name('Visible');
              gui.add(material, 'wireframe');
              gui.add(guiControls, 'showAxes')
              .name('Afficher Axes')
              .onChange((value) => {
                axesHelper.visible = value; // Montre ou cache les axes
                scene.add(axesHelper);
              });
              const geometry = child.geometry;
              // Verify if the geometry has vertices
              let totalVertices = 0;
              if (geometry && geometry.attributes.position) {
                totalVertices += geometry.attributes.position.count;
                setVerticesCount(totalVertices);
              }
              // Calculate total triangles
              const trianglesCount = geometry.index
                ? geometry.index.count / 3 // With an index
                : geometry.attributes.position.count / 3; // Without index
              setTrianglesCount(trianglesCount);
            }
            // Size of the 3D Object
            setDimensions({ x: size.x, y: size.y, z: size.z }); // Update dimensions
          })
        }, 100);
      },
      undefined,
      (error) => {
        console.error('Error loading the model:', error);
        window.location.href = 'index.html';
        alert(`Something went wrong. ${error}`);
      });
    }

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 700),
      new THREE.MeshStandardMaterial({
          color: '#444444',
          metalness: 0,
          roughness: 0.5
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = - Math.PI * 0.5;
    scene.add(floor);

    /**
    * Lights
    */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = - 7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = - 7;
    directionalLight.position.set(- 5, 5, 0);
    scene.add(directionalLight);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(2);
    axesHelper.visible = true;
    const guiControls = { showAxes: false }; // Contrôle initial pour les axes


    // Taille du canvas
    const sizes = {
      width: (window.innerWidth / 3) * 2,
      height: (window.innerWidth / 3) * 1.75,
    };

    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(2, 2, 2);
    scene.add(camera);
    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.target.set(0, 0.75, 0);
    controls.enableDamping = true;
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clipping Plane
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), clippingPlaneZ);
    renderer.localClippingEnabled = true;

    const updateClippingPlaneFunc = (value: number) => {
      clippingPlane.constant = value;
      setClippingPlaneZ(value);
    };
    setUpdateClippingPlane(() => updateClippingPlaneFunc);

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const previousTime = elapsedTime;
      previousTime;
      // Update controls
      controls.update();
      // Render
      renderer.render(scene, camera);
      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
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
      gui.destroy();
    };
  }, [isCanvasReady]);

  const goToHome = () => {
    window.location.href = 'index.html';
  }


  return (
    <div id="canva">
      <div className="canva_content">
        <div className="canvas_content">
          <canvas ref={canvasRef} className="webgl"></canvas>
          <div className="informations_content">
            <div>
              <div className='title'>
                <img src={icon} alt="icon" className='icon'/>
                <h1 className="text-lg">3D Viewer</h1>
              </div>
              <h2>Details</h2>
              <h2 id="file_name" className="name">{setFileData.name}</h2>
              <ul>
                <div className='values'><li>Vertices:</li><span>{verticesCount}</span></div>
                <div className='values'><li>Triangles:</li><span>{trianglesCount}</span></div>
                <div className='values'><li>Size X:</li><span>{dimensions.x.toFixed(2)} cm</span></div>
                <div className='values'><li>Size Y:</li><span>{dimensions.y.toFixed(2)} cm</span></div>
                <div className='values'><li>Size Z:</li> <span>{dimensions.z.toFixed(2)} cm</span></div>
              </ul>
              <p>Depending on the size of your object, you might need to zoom in or zoom out.</p>
            </div>
            <label>
              <span>Clipping Z: {clippingPlaneZ}</span>
              <br />
              <input
                type="range"
                min="-100"
                max="100"
                step="1"
                value={clippingPlaneZ}
                onChange={(e) => {
                  const value = e.target.value;
                  setClippingPlaneZ(Number(e.target.value))
                  if (updateClippingPlane) {
                    updateClippingPlane(Number(value));
                  }
                }}
                className="styled-range"
              />
            </label>
          <div className="buttonCss">
            <button onClick={goToHome}>Return</button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default FileRenderer
