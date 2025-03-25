import { OpenedEye, ClosedEye } from "./EyeIcon.jsx"
import { createSignal } from "solid-js"

function LoginForm(){
  const [showPassword, setShowPassword] = createSignal(false)

  function toggleShowPassword(event){
    event.preventDefault()
    setShowPassword(!showPassword())
  }

  function handleLogin(event){
    event.preventDefault()
    const username = event.target.elements.username.value
    const password = event.target.elements.password.value

  }

  async function fetchAuth(){
    const response = await fetch()
    
  }

  return (
    <div class="flex flex-col gap-5 border border-gray-300 rounded-md px-4 py-6 w-md justify-between">
      <div>
        <h1 class="text-center text-4xl font-semibold">Net Copy</h1>
        <h4 class="text-center text-md font-normal text-gray-400">Login page</h4>
      </div>
      <form action="" method="get" onSubmit={handleLogin} class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="username">Username</label>
          <input type="text" name="username" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" required />
        </div>
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="password">Password</label>
          <div class="flex flex-row relative">
            <input type={showPassword() ? "text" : "password"} name="password" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal w-full" required />
            <button type="button" onClick={toggleShowPassword} class="absolute inset-y-0 right-3 flex items-center">{showPassword() ? <ClosedEye/> : <OpenedEye/>}</button>
          </div>
        </div>
        <div class="form-example">
          <input type="submit" value="Log in" class="w-full bg-blue-800 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-900 cursor-pointer" />
        </div>
      </form>
      <div class="flex flex-col items-center text-sm text-gray-400">
        <p>Laboratorium Komputasi Fakultas Sains</p>
        <p>Gedung 9 Lt. 1</p>
      </div>
    </div>
  )
}

export default LoginForm