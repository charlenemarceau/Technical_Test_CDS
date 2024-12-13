import { useState } from 'react'
import FileDrop from './components/fileDrop'
import FileRenderer from './components/fileRenderer'
import icon from "./assets/icon.png"

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [file, setFile] = useState('');
  const [url, setUrl] = useState('');

  const handleFile = (data) => {
    setFile(data)
    setUrl(URL.createObjectURL(data))
  }

  return (
    <>
      <div className='title'>
      <img src={icon} alt="icon" className='icon'/>
      <h1 className="text-lg">3D Viewer</h1>
      </div>
      {file ? <FileRenderer setFileData={file} setUrlData={url}/> : <FileDrop sendFileData={handleFile}/>}
    </>
  )
}

export default App
