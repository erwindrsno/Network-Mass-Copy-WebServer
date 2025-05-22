import { createSignal } from "solid-js"
import FilePreview from "./FilePreview.jsx"
import DropFileZone from "./DropFileZone.jsx"
import { useFileUploadContext } from "../utils/FileUploadContextProvider.jsx";

function FileManager() {
  let dropzoneRef
  // const [files, setFiles] = createSignal([])
  const { files, setFiles } = useFileUploadContext();

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

  //ref={elm => dropzoneRef = elm}. Elm berasal dari props.ref yang ada di component dropfilezone, kemudian assign elm ke dropzoneRef 
  //digunakan untuk menginteraksi DOM secara langsung

  return (
    <>
      <DropFileZone ref={elm => dropzoneRef = elm} onDrop={onDrop} onDragOver={onDragOver} onChange={onChange} />
      <FilePreview removeFile={removeFile} />
    </>
  )
}

export default FileManager
