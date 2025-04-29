import { useFileUploadContext } from "../utils/FileUploadContextProvider.jsx";
import { TrashcanIcon } from "../../assets/Icons.jsx";

function FilePreview(props) {
  const { files, setFiles } = useFileUploadContext();

  return (
    <>
      <Show when={files().length !== 0} fallback={<p class="text-center">No File yet.</p>}>
        <div id="fileList" class="mt-1 h-35 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50">
          {files().map((file, index) => (
            <div class="flex items-center justify-between p-2 mb-1 bg-gray-200 rounded-lg font-medium">

              <span class="text-sm text-gray-700">{index + 1}. {file.name}</span>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">
                  {(file.size / 10240).toFixed(2)} MB
                </span>
                <button
                  onClick={() => props.removeFile(index)}
                  class="bg-red-500 text-white text-xs px-1 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                >
                  <TrashcanIcon></TrashcanIcon>
                </button>
              </div>
            </div>
          ))}
        </div>

      </Show>
    </>
  )
}

export default FilePreview
