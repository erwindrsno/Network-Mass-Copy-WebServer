import { action, useNavigate } from "@solidjs/router";
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { apiAddComputer } from "@apis/ComputerApi.jsx";
import toast, { Toaster } from 'solid-toast';

function AddComputerForm() {
  const navigate = useNavigate()
  const { token, setToken } = useAuthContext();

  const handleAddComputer = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await apiAddComputer(formData, token);

    if (result.success) {
      toast.success("a new computer added.");
      navigate("/admin/computer");
    }
  }

  return (
    <div class="flex flex-col gap-5 border border-gray-300 rounded-md px-4 py-4 w-lg justify-between bg-gray-50">
      <form onSubmit={handleAddComputer} method="POST" class="flex flex-col gap-5">
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
