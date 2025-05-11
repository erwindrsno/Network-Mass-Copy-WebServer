import Header from '../components/header/Header.jsx'
import UploadFileForm from '../components/copy-oxam/UploadFileForm.jsx'
import { FileUploadContextProvider, useFileUploadContext } from "../components/utils/FileUploadContextProvider.jsx";

function CopyOxamPage() {
  return (
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <main class="w-lg pt-6 pb-7 mt-30 flex flex-col self-center items-center border border-gray-300 space-y-6 bg-gray-50 shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold">Copy with OXAM generated</h1>
        <FileUploadContextProvider>
          <UploadFileForm />
        </FileUploadContextProvider>
      </main>
    </div>
  )
}

export default CopyOxamPage;
