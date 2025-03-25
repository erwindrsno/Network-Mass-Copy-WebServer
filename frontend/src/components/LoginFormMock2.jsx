import { createSignal } from 'solid-js'

function LoginFormMock2(){
    const [showPassword, setShowPassword] = createSignal(false) 
    const [username, setUsername] = createSignal('')
    const [password, setPassword] = createSignal('')

    const onClickShowPassword = event => {
        event.preventDefault()
        setShowPassword(!showPassword())
    }

    return(
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 class="mt-10 text-center text-3xl/9 font-medium tracking-tight text-gray-900">Net Copy Login</h1>
          </div>
        
          <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" method="POST">
              <div>
                <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
                <div class="mt-2">
                  <input type="text" name="username" id="username" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-800 sm:text-sm/6"/>
                </div>
              </div>
        
              <div>
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                  <div class="text-sm">
                    <button onClick={onClickShowPassword} class="font-semibold text-indigo-600 hover:text-indigo-500">Show password</button>
                  </div>
                </div>
                <div class="mt-2">
                  <input type={showPassword() ? "text" : "password"} name="password" id="password" autocomplete="current-password" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-800 sm:text-sm/6"/>
                </div>
              </div>
        
              <div>
                <button type="submit" class="flex w-full justify-center cursor-pointer rounded-md bg-blue-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>
              </div>
            </form>
        
            <div class="mt-5 text-center text-sm/6 text-gray-500">
                <p> 
                  Laboratorium Komputasi Fakultas Sains
                </p>
                <p>Gedung 9 Lt. 1</p>
            </div>
          </div>
        </div>
    )
}


export default LoginFormMock2
