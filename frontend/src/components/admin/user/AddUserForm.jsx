import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { apiAddUser } from "@apis/UserApi.jsx";
import toast, { Toaster } from 'solid-toast';

function AddUserForm() {
  const navigate = useNavigate()
  const { token, setToken } = useAuthContext();

  const handleAddUser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await apiAddUser(formData, token);

    if (result.success) {
      toast.success("new user added.");
      navigate("/admin/user");
    }
  };

  return (
    <div class="flex flex-col gap-5 border border-gray-300 rounded-md px-4 py-4 w-lg justify-between bg-gray-50">
      <form onSubmit={handleAddUser} method="post" class="flex flex-col gap-5">
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
        <div class="flex flex-col gap-1.5 font-medium">
          <label for="role">Role</label>
          <select name="role" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal w-full">
            <option value="superadmin">Super admin</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="form-example">
          <input type="submit" value="Add" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer" />
        </div>
      </form>
    </div>
  )
}

export default AddUserForm
