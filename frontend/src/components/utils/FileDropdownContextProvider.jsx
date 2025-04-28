import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const FileDropdownContext = createContext();

export function FileDropdownContextProvider(props) {
  const [currFilename, setCurrFilename] = createSignal("");

  const value = { currFilename, setCurrFilename };

  return (
    <FileDropdownContext.Provider value={value}>
      {props.children}
    </FileDropdownContext.Provider>
  )
}

export function useFileDropdownContext() {
  return useContext(FileDropdownContext);
}

// context ini digunakan untuk menangani file name pada halaman single entry record table.
