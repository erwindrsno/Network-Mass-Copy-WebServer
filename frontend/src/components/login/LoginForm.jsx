import { createSignal } from "solid-js";
import { action, useNavigate } from "@solidjs/router";
import { useAuthContext } from "../utils/AuthContextProvider.jsx";
import { OpenedEyeIcon, ClosedEyeIcon } from "../../assets/Icons.jsx";

function LoginForm() {
  // const { userStore, setUserStore } = useAuthContext();
  const { token, setToken } = useAuthContext();

  const [showPassword, setShowPassword] = createSignal(false);
  const navigate = useNavigate();

  function toggleShowPassword(event) {
    event.preventDefault();
    setShowPassword(!showPassword());
  }

  const handleLogin = action(async (formData) => {
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    });
    if (!response.ok && response.status === 401) {
      console.log("UNAUTH!");
    } else {
      console.log(response);
      const result = await response.json();
      sessionStorage.setItem("token", result.token);
      setToken(result.token);

      navigate("/home", { replace: true });
    }
    console.log("Username " + formData.get('username'));
    console.log("Response status is : " + response.status);
  })

  return (
    <main class="flex flex-col gap-5 border border-gray-300 rounded-md px-4 py-6 w-md justify-between">
      <div>
        <h1 class="text-center text-4xl font-semibold">Net Copy</h1>
        <h4 class="text-center text-md font-normal text-gray-400">Login page</h4>
      </div>
      <form action={handleLogin} method="post" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="username">Username</label>
          <input type="text" name="username" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" required />
        </div>
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="password">Password</label>
          <div class="flex flex-row relative">
            <input type={showPassword() ? "text" : "password"} name="password" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal w-full" required />
            <button type="button" onClick={toggleShowPassword} class="absolute inset-y-0 right-3 flex items-center">{showPassword() ? <ClosedEyeIcon /> : <OpenedEyeIcon />}</button>
          </div>
        </div>
        <div class="form-example">
          <input type="submit" value="Log in" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer" />
        </div>
      </form>
      <div class="flex flex-col items-center text-sm text-gray-400">
        <p>Laboratorium Komputasi Fakultas Sains</p>
        <p>Gedung 9 Lt. 1</p>
      </div>
    </main>
  )
}

export default LoginForm
