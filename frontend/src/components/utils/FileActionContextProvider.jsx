import { createSignal, createContext, useContext } from "solid-js";

const FileActionContext = createContext();

export function FileActionContextProvider(props) {
  const [isCopy, setIsCopy] = createSignal(null);

  const value = { isCopy, setIsCopy };

  return (
    <FileActionContext.Provider value={value}>
      {props.children}
    </FileActionContext.Provider>
  )
}

export function useFileActionContext() {
  return useContext(FileActionContext);
}
