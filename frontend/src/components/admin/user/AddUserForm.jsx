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
        <div>
            <form action={handleAddUser} method="POST">
                <div>
                    <label for="username">Username: </label>
                    <input type="text" name="username" placeholder="admin" />
                </div>
                <div>
                    <label for="password">Password: </label>
                    <input type="password" name="password" placeholder="kakikukeko" />
                </div>
                <div>
                    <label for="display_name">Display name:</label>
                    <input type="text" name="display_name" placeholder="Administrator01" />
                </div>

                <div class="form-example">
                  <input type="submit" value="Add" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer" />
                </div>
            </form>
        </div>
    )
}

export default AddUserForm
