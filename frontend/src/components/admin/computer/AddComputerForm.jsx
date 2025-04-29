import { action, useNavigate } from "@solidjs/router";
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";

function AddComputerForm() {
  const navigate = useNavigate()
  const { token, setToken } = useAuthContext();

  const handleAddComputer = action(async (formData) => {
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token()}`
      },
      body: new URLSearchParams({
        host_name: formData.get('host_name'),
        ip_address: formData.get('ip_address'),
        lab_num: formData.get('lab_num')
      }),
    })
    if (!response.ok && response.status === 401) {
      console.log("UNAUTH!")
    } else if (response.ok && response.status === 200) {
      navigate('/admin/computer')
    }
  })
  return (
    <div class="flex flex-col gap-5 border border-gray-300 rounded-md px-4 py-4 w-lg justify-between bg-gray-50">
      <form action={handleAddComputer} method="POST" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="host_name">Host name: </label>
          <input type="text" name="host_name" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" placeholder="Example: LAB01-01" />
        </div>
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="ip_address">IP Address</label>
          <input type="text" name="ip_address" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" placeholder="Example: 10.100.71.101" />
        </div>
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="lab_num">Lab Num</label>
          <input type="text" name="lab_num" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" placeholder="Example: 1" />
        </div>

        <div class="form-example">
          <input type="submit" value="Add" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer" />
        </div>
      </form>
    </div>
  )
}

export default AddComputerForm
