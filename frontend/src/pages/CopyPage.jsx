import Header from '../components/header/Header.jsx';
import CopyManager from '../components/copy/CopyManager.jsx';
import { FileUploadContextProvider, useFileUploadContext } from '../components/utils/FileUploadContextProvider.jsx';

function CopyPage() {
  return (
    <div class="w-full h-full">
      <Header />
      <FileUploadContextProvider>
        <CopyManager />
      </FileUploadContextProvider>
    </div>
  )
}

export default CopyPage
