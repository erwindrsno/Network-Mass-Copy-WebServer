import Header from '@components/header/Header.jsx'
import AddComputerForm from '@components/admin/computer/AddComputerForm'

function AddComputerPage() {
  return (
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <main class="w-full flex flex-1 flex-col mt-32 items-center gap-5">
        <h1 class="text-center text-4xl font-semibold">Add Computer</h1>
        <AddComputerForm />
      </main>
    </div>
  )
}

export default AddComputerPage;
