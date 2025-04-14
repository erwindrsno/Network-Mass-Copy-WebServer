import { Show } from "solid-js";
import { useAuthContext } from "./AuthContextProvider.jsx";

function ProtectedRoute(props){
  const { userStore } = useAuthContext();

  return(
    <Show when={userStore.isAuth} fallback={<h1>Please sign in first!</h1>}>
      {props.children}
    </Show>
  )
}

export default ProtectedRoute;
