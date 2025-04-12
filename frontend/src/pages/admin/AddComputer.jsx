import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import ComputerCRUD from '../../components/admin/computer/ComputerCRUD.jsx'
import AddComputerForm from '../../components/admin/computer/AddComputerForm.jsx'

function AddComputer(){
  return(
    <div class="w-full h-full">
      <Header />
        <div class="w-full h-full flex">
            <Navbar />
            <AddComputerForm />
        </div>
    </div>
  )
}

export default AddComputer
