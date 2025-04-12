import { createSignal } from "solid-js";
import { action, useNavigate } from "@solidjs/router";


function AddComputerForm(){
    const navigate = useNavigate()
    const handleAddComputer = action(async (formData) => {
      const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          host_name: formData.get('host_name'),
          ip_address: formData.get('ip_address'),
          lab_num: formData.get('lab_num')
        }),
      })
      if(!response.ok && response.status === 401){
        console.log("UNAUTH!")
      } else if(response.ok && response.status === 200){
        navigate('/admin/computer')  
      }       
      console.log(formData)
    })
    return(
        <div>
            <form action={handleAddComputer} method="POST">
                <div>
                    <label for="host_name">Host name: </label>
                    <input type="text" name="host_name" placeholder="LB01-" />
                </div>
                <div>
                    <label for="ip_address">IP Address</label>
                    <input type="text" name="ip_address" placeholder="LB01-" />
                </div>
                <div>
                    <label for="lab_num">Lab Num</label>
                    <input type="text" name="lab_num" placeholder="LB01-" />
                </div>

                <div class="form-example">
                  <input type="submit" value="Add" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer" />
                </div>
            </form>
        </div>
    )
}

export default AddComputerForm
