import { createSignal, createContext, useContext } from "solid-js";

const AuthContext = createContext();

export function AuthContextProvider(props){
  const [isAuth, setIsAuth] = createSignal(false);

  const value = { isAuth, setIsAuth };

  return(
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(){
  return useContext(AuthContext); 
}
