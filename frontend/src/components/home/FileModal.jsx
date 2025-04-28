import { Portal } from "solid-js/web";
import { createResource, createSignal, Show } from 'solid-js';
import { useAuthContext } from "../utils/AuthContextProvider.jsx";
import { DownloadIcon } from "./DownloadIcon.jsx";
import { CloseModalIcon } from "./CloseModalIcon.jsx";

const fetchFilesInfo = async (token, id) => {
  console.log(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/file/${id}`);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${id}/file`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  const result = await response.json();
  console.log(result);
  return result;
}

function FileModal(props) {
  const title = props.title;
  const { token, setToken } = useAuthContext();
  const [filesInfo, { mutate, refetch }] = createResource(props.entryId, () => fetchFilesInfo(token, props.entryId));

  return (
    <Portal>
      <div class="flex inset-0 fixed self-center justify-center">
        <div class="w-2/5 h-9/10 border rounded-lg bg-gray-50 border-gray-300 shadow-md">
          <div class="flex flex-col h-9/10 my-2 mx-3 gap-4">
            <div class="flex flex-row justify-between border-b-1 pb-2">
              <p>{title}</p>
              <button onClick={props.closeModal} class="cursor-pointer"><CloseModalIcon /></button>
            </div>
            <div class="h-35 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50">
              {filesInfo()?.map((file, index) => (
                <div class="flex items-center justify-between p-2 mb-1 bg-gray-200 rounded-lg font-medium">

                  <span class="text-sm text-gray-700">{index + 1}. {file.filename}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">
                      {(file.filesize / 10240).toFixed(2)} MB
                    </span>
                    <button
                      onClick={() => props.removeFile(index)}
                      class="bg-blue-600 text-white text-xs px-1 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                      <DownloadIcon></DownloadIcon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default FileModal;
