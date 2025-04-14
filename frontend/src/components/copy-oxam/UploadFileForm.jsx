import FileManager from "./FileManager.jsx"
import { FileUploadContextProvider, useFileUploadContext } from "../utils/FileUploadContextProvider.jsx";
import { action, useNavigate } from "@solidjs/router";

function UploadFileForm(){
  const { files, setFiles } = useFileUploadContext();

  const handleUploadFiles = action(async (formData) => {
    console.log(formData.get("acl"));
    console.log(formData.get("target"));
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/files`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if(!response.ok && response.status === 401){
      console.log("UNAUTH!");
    } else{
      const result = await response.json();
      console.log(result);
    }
  })

  return(
      <div class="w-lg">
        <form class="flex flex-col space-y-4" action={handleUploadFiles} method="post" enctype="multipart/form-data">
          <div class="flex flex-col space-y-1">
            <label for="target" class="text-lg">Target</label>
            <input type="file" name="target"
              class="text-slate-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded" />
          </div>

          <div class="flex flex-col space-y-1">
            <label for="acl" class="text-lg">ACL</label>
            <input type="file" name="acl"
              class="text-slate-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded" />
          </div>

          <div class="flex flex-col space-y-1">
            <label for="file" class="text-lg">File</label>
            <FileManager />
          </div>

          <button type="submit" class="w-full bg-blue-600 border rounded-md py-1 text-blue-50 font-semibold hover:bg-blue-700 cursor-pointer">Execute</button>
        </form>
      </div>
  )
}

export default UploadFileForm
