/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react'
import FileDrop from './components/fileDrop'
import FileRenderer from './components/fileRenderer'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [file, setFile] = useState('');
  const [url, setUrl] = useState('');

  const handleFile = (data) => {
    console.log(data)
    setFile(data)
    setUrl(URL.createObjectURL(data))
  }

  return (
    <>
      <h1 className="text-lg">3D Viewer</h1>
      {file ? <FileRenderer setFileData={file} setUrlData={url}/> : <FileDrop sendFileData={handleFile}/>}
    </>
  )
}

export default App
