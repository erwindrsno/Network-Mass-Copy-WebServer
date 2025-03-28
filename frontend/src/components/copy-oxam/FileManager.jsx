import { createSignal } from "solid-js"
import FilePreview from "./FilePreview.jsx"
import DropFileZone from "./DropFileZone.jsx" 

function FileManager(){
  let dropzoneRef
  const [files, setFiles] = createSignal([])

  const onDrop = (event) => {
    event.preventDefault()
    dropzoneRef.classList.remove("bg-gray-200")
    handleFiles(event.dataTransfer.files)
  }

  const onDragOver = (event) => {
    event.preventDefault()
    dropzoneRef.classList.add("bg-gray-200")
  }

  const onChange = (event) => {
    event.preventDefault()
    handleFiles(event.target.files)
  }

  const handleFiles = (newFiles) => {
    setFiles([...files(), ...Array.from(newFiles)]);
  }

  const removeFile = (index) => {
    setFiles(files().filter((_, i) => i !== index));
  }

  return (
    <>
      <DropFileZone ref={elm => dropzoneRef = elm} onDrop={onDrop} onDragOver={onDragOver} onChange={onChange}/>
      <FilePreview files={files} removeFile={removeFile} />
    </>
  )
}

export default FileManager