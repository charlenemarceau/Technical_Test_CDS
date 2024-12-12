/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const FileDrop = ({ sendFileData }) => {

  const dropzone: any = document.getElementById('dropzone');


  window.onload = (e) => {
    dropzone.addEventListener('dragover', (e) => {
          e.stopPropagation();
          e.preventDefault();
      });
    dropzone.addEventListener('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.files[0]
        sendFileData(file)
    })
  }

  const setFile = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    if (!fileInput.files || fileInput.files.length === 0) {
      return
    }
    const file = fileInput.files[0]
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
          onChange={setFile}
        ></input>
      </div>
    </div>
  )
}

export default FileDrop
