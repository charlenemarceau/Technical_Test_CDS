/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useRef } from "react";

const FileDrop = ({ sendFileData }: { sendFileData: (file: File) => void }) => {
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.style.border = "2px dashed #ccc";
    }
  };

  const handleDragLeave = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.style.border = "2px dashed #ccc";
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.style.border = "2px dashed #00f";
    }
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      sendFileData(file);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      sendFileData(file);
    }
  };

  return (
    <div
      id="dropzone"
      ref={dropzoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: "100%",
        padding: "20px",
        border: "2px dashed #00f",
        textAlign: "center",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      <div className="index_content">
        <h3>Drag and drop your 3D Object</h3>
        <p>or</p>
        <h3>Select your 3D Object</h3>
        <input
          type="file"
          id="fileInput"
          accept=".glb, .gltf, .usdz, .fbx, .obj, .stl"
          onChange={handleFileInputChange}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>
    </div>
  )
}

export default FileDrop
