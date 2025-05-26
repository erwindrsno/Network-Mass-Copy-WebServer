import { useNavigate, useParams } from "@solidjs/router";
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { createSignal } from "solid-js";
import { apiAddDirectory } from "@apis/AddDirectoryApi";

function AddDirectoryForm(props) {
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate();
  const params = useParams();
  const entryId = params.entry_id;
  const [labNum, setLabNum] = createSignal(1);

  const handleAddDirectory = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("entry_id", entryId);
    const encodedForm = new URLSearchParams(formData);

    const result = await apiAddDirectory(encodedForm, token);
    if (result.success) {
      navigate("/home");
    }
  }

  const handleLabNumChange = (event) => {
    setLabNum(Number(event.target.value));
    console.log("Selected lab num is : " + labNum())
  }

  return (
    <form onSubmit={handleAddDirectory} class="flex flex-col space-y-4 w-full px-5" method="post">
      <div class="w-full flex flex-col space-y-1">
        <label for="lab_num" class="text-lg">Lab number</label>
        <select name="lab_num" value={labNum()} onChange={handleLabNumChange} class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal">
          <option value="1">LAB01 - 9018</option>
          <option value="2">LAB02 - 9017</option>
          <option value="3">LAB03 - 9016</option>
          <option value="4">LAB04 - 9015</option>
        </select>
      </div>

      <div class="w-full flex flex-col space-y-1">
        <label for="host_num" class="text-lg">Host number</label>
        <input type="number" name="host_num" min="1" max="45" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" />
      </div>

      <div class="w-full flex flex-col space-y-1">
        <label for="owner" class="text-lg">Owner</label>
        <input type="text" name="owner" class="outline-1 outline-gray-300 rounded-md py-1 px-2 font-normal" placeholder="E.g: i20002" />
      </div>

      <button type="submit" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer">Add</button>
    </form>
  )
}

export default AddDirectoryForm;
