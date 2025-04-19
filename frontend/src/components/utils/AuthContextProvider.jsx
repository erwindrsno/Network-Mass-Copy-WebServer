import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AuthContext = createContext();

export function AuthContextProvider(props) {
  const [token, setToken] = createSignal(sessionStorage.getItem("token") || "");

  const value = { token, setToken };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext);
}
