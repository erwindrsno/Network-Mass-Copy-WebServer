import { createSignal, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AuthContext = createContext();

export function AuthContextProvider(props){
  const [userStore, setUserStore] = createStore({
    isAuth: false,
    display_name: null,
  });

  const value = { userStore, setUserStore };

  return(
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(){
  return useContext(AuthContext); 
}
