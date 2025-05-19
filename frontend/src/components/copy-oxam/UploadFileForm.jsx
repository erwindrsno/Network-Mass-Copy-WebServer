import FileManager from "./FileManager.jsx"
import { FileUploadContextProvider, useFileUploadContext } from "../utils/FileUploadContextProvider.jsx";
import { action, useNavigate } from "@solidjs/router";
import { extractDataFromTxt } from "../utils/DataExtraction.jsx";
import { useAuthContext } from "../utils/AuthContextProvider.jsx";

function UploadFileForm() {
  const { files, setFiles } = useFileUploadContext();
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate();

  const handleUploadFiles = action(async (formData) => {
    const file = formData.get("access_list");

    try {
      const { title, records } = await extractDataFromTxt(file);

      formData.append("title", title);
      formData.append("records", JSON.stringify(records));
      for (const file of files()) {
        formData.append("files", file);
      }
      formData.append("count", records.length * files().length);
      formData.append("host_count", records.length);
      formData.delete("access_list");

      const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/oxam`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token()}`
        },
        body: formData,
      });
      console.log(response.status);
      console.log(response.ok);
      if (!response.ok && response.status === 401) {
        console.log("UNAUTH!");
      }
      if (response.status === 200) {
        console.log("MUST NAV TO HOME");
        navigate("/home");
      }
    } catch (err) {
      console.error('File reading failed:', err);
    }
  })

  return (
    <form class="flex flex-col space-y-4" action={handleUploadFiles} method="post" enctype="multipart/form-data">
      <div class="flex flex-col space-y-1">
        <label for="access_list" class="text-lg">Access list</label>
        <input type="file" name="access_list"
          class="text-slate-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded" />
      </div>

      <div class="flex flex-col space-y-1">
        <label for="file" class="text-lg">File</label>
        <FileManager />
      </div>

      <button type="submit" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer">Add</button>
    </form>
  )
}

export default UploadFileForm
