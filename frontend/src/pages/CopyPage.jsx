import Header from '@components/header/Header.jsx';
import CopyManager from '@components/copy/CopyManager.jsx';
import { FileUploadContextProvider, useFileUploadContext } from '../components/utils/FileUploadContextProvider.jsx';

function CopyPage() {
  return (
    <div class="w-full h-full">
      <Header />
      <main class="flex flex-col mt-10 gap-5">
        <h1 class="text-2xl font-semibold text-center">Copy Page</h1>
        <FileUploadContextProvider>
          <CopyManager />
        </FileUploadContextProvider>
      </main>
    </div>
  )
}

export default CopyPage
