import FileManager from "./FileManager.jsx"
import { FileUploadContextProvider, useFileUploadContext } from "../utils/FileUploadContextProvider.jsx";
import { action, useNavigate } from "@solidjs/router";
import { extractDataFromTxt } from "../utils/DataExtraction.jsx";

function UploadFileForm() {
  const { files, setFiles } = useFileUploadContext();

  const handleUploadFiles = action(async (formData) => {
    // console.log(files());
    // console.log(formData.get("acl"));
    // console.log(formData.get("target"));

    const file = formData.get("access_list");

    try {
      const { title, entries } = await extractDataFromTxt(file);
      entries.forEach(entry => {
        console.log("Hostname:", entry.hostname);
        console.log("Owner:", entry.owner);
        console.log("Permissions:", entry.permissions);
      });

      formData.append("title", title);
      formData.append("entries", JSON.stringify(entries));
      for (const file of files()) {
        formData.append("files", file);
      }
      formData.delete("access_list");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

    } catch (err) {
      console.error('File reading failed:', err);
    }

    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entries/oxam`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
      body: formData,
    });
    if (!response.ok && response.status === 401) {
      console.log("UNAUTH!");
    } else {
      const result = await response.json();
      console.log(result);
    }
  })

  return (
    <div class="w-lg">
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
    </div>
  )
}

export default UploadFileForm
