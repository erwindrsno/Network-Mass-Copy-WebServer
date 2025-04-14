import { Show } from "solid-js";
import { useAuthContext } from "./AuthContextProvider.jsx";

function ProtectedRoute(props){
  const { isAuth } = useAuthContext();

  return(
    <Show when={isAuth()} fallback={<h1>Please sign in first!</h1>}>
      {props.children}
    </Show>
  )
}

export default ProtectedRoute;
