import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import ComputerCRUD from '../../components/admin/computer/ComputerCRUD.jsx'
import AddComputerForm from '../../components/admin/computer/AddComputerForm.jsx'

function AddComputer(){
  return(
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <div class="w-full flex flex-1 flex-col mt-32 items-center gap-5">
        <h1 class="text-center text-4xl font-semibold">Add Computer</h1>
        <AddComputerForm />
      </div>
    </div>
  )
}

export default AddComputer
