import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const FileUploadContext = createContext();

export function FileUploadContextProvider(props) {
  const [files, setFiles] = createSignal([])

  const value = { files, setFiles };

  return (
    <FileUploadContext.Provider value={value}>
      {props.children}
    </FileUploadContext.Provider>
  )
}

export function useFileUploadContext() {
  return useContext(FileUploadContext);
}

// context ini digunakan untuk menangani files yang akan dicopy ke client.
// file ACL dan file target penanganannya terdapat pada komponen uploadfileform sendiri.
