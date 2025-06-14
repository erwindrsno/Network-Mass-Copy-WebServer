import { Portal } from "solid-js/web";
import { createResource, createSignal, Show } from 'solid-js';
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { DownloadIcon, CloseModalIcon, TrashcanIcon } from "@icons/Icons.jsx";
import { apiFetchFilesInfo, apiDownloadFile } from "@apis/FileModalApi";

function FileModal(props) {
  const title = props.title;
  const entryId = props.entryId;
  const { token, setToken } = useAuthContext();
  const [filesInfo, { mutate, refetch }] = createResource(entryId(), () => apiFetchFilesInfo(entryId, token));

  const handleDownload = async (filename) => {
    const result = await apiDownloadFile(entryId, filename, token);
    const url = window.URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // nama file yang direkomendasi untuk download
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Portal>
      <div class="fixed inset-0 bg-black opacity-50 z-40" onClick={props.closeModal}>
      </div>

      <div class="flex inset-0 fixed self-center justify-center z-50">
        <div class="w-2/5 h-9/10 border rounded-lg bg-gray-50 border-gray-300 shadow-md inline">
          <div class="flex flex-col my-2 mx-3 gap-4">
            <div class="flex flex-row justify-between border-b-1 pb-2">
              <p>{title()}</p>
              <button onClick={props.closeModal} class="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-sm"><CloseModalIcon /></button>
            </div>
            <div class="overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50">
              <For each={filesInfo()} fallback={<p>Loading...</p>}>
                {(file, index) => (
                  <div class="flex items-center justify-between p-2 mb-1 bg-gray-200 rounded-lg font-medium">

                    <span class="text-sm text-gray-700 truncate">{index() + 1}. {file.filename}</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm text-gray-500">
                        {(file.filesize / 10240).toFixed(2)} MB
                      </span>
                      <button
                        onClick={() => handleDownload(file.filename)}
                        class="bg-blue-600 text-white text-xs px-1 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                      >
                        <DownloadIcon></DownloadIcon>
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default FileModal;
