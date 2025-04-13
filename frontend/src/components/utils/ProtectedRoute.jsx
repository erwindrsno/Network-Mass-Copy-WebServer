import { createResource, Show } from "solid-js";

const checkSession = async () => {
  const res = await fetch("http://localhost:7070/", {
    credentials: "include",
  });

  if (!res.ok || res.status === 401){
    console.log("You are not allowed!");
    return false;
  }
  console.log("You are allowed");
  return true;
  // const data = await res.json();
  // return data.valid === true;
}

function ProtectedRoute(props){
  const [sessionValid] = createResource(checkSession);

  return(
    <Show when={sessionValid()} fallback={<h1>Please sign in first!</h1>}>
      {props.children}
    </Show>
  )
}

export default ProtectedRoute

// Alasan checkSession hanya hit endpoint ke "/" karena, pada backend sudah terdapat before handler untuk menjalankan
// fungsi validasi, sehingga tidak perlu membuat handler baru untuk menangani validasi
