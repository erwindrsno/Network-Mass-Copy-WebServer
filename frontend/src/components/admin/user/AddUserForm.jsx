import { createSignal } from "solid-js";
import { action, useNavigate } from "@solidjs/router";

function AddUserForm(){
    const navigate = useNavigate()

    const handleAddUser = action(async (formData) => {
      const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: formData.get('username'),
          password: formData.get('password'),
          display_name: formData.get('display_name')
        }),
      })
      if(!response.ok && response.status === 401){
        console.log("UNAUTH!")
      } else if(response.ok && response.status === 201){
        console.log("OKKKK")
        navigate('/admin/user')  
      }       
      console.log(formData)
    })
    return(
    <div class="flex flex-col gap-5 border border-gray-300 rounded-md px-4 py-4 w-lg justify-between">
      <form action={handleAddUser} method="post" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="username">Username</label>
          <input type="text" name="username" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" placeholder="admin" required />
        </div>
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="password">Password</label>
          <input type="password" name="password" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal w-full" placeholder="Secret" required />
        </div>
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="display_name">Display name</label>
          <input type="text" name="display_name" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal w-full" placeholder="Administrator" required />
        </div>
        <div class="form-example">
          <input type="submit" value="Add" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer" />
        </div>
      </form>
    </div>
    )
}

export default AddUserForm
