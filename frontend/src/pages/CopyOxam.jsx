import Header from '../components/header/Header.jsx'
import UploadFileForm from '../components/copy-oxam/UploadFileForm.jsx'

function CopyOxam(){
  return(
    <div class="w-full h-full flex flex-col">
      <Header />
      <main class="flex-1 flex flex-col mt-30 items-center space-y-3">
        <h1 class="text-2xl font-semibold">Copy from OXAM generated</h1>
        <UploadFileForm />
      </main>
    </div>
  )
}

export default CopyOxam
