// import DropFileZone from "./DropFileZone.jsx"
import FileManager from "./FileManager.jsx"

function UploadFileForm(){
  return(
    <div class="w-lg">
      <form class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <label for="target" class="text-lg">Target</label>
          <input type="file"
            class="text-slate-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded" />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="acl" class="text-lg">ACL</label>
          <input type="file"
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
