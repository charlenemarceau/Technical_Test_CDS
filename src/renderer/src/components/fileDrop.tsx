/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';


const FileDrop = ({ sendFileData }) => {

  const dropzone: any = document.getElementById('dropzone');

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });
    dropzone.addEventListener('drop', (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('event', e)
      if (!e.files || e.files.length === 0) {
        return
      }
      const file = e.files[0]
      console.log('file: ' + file)
      sendFileData(file)
    })
  }



  const setFile = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    if (!fileInput.files || fileInput.files.length === 0) {
      return
    }
    const file = fileInput.files[0]
    console.log('file: ' + file)
    // Créer un URL temporaire pour le fichier 3D
    // const fileURL = URL.createObjectURL(file);
    // // Sauvegarder l'URL dans le sessionStorage pour passer d'une page à l'autre
    // sessionStorage.setItem('modelURL', fileURL);
    sendFileData(file)
  }
  return (
    <div id="dropzone">
      <div className="index_content">
        <h3>Drag and drop your 3D Object</h3>
        <p>or</p>
        <input
          type="file"
          id="fileInput"
          accept=".glb, .gltf, .usdz, .fbx"
          onChange={(e) => setFile()}
        ></input>
      </div>
    </div>
  )
}

export default FileDrop
