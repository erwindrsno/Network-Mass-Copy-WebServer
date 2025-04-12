import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import ComputerCRUD from '../../components/admin/computer/ComputerCRUD.jsx'

function Computer(){
  return(
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <div class="w-full flex flex-col justify-self-center items-center">
        <Navbar />
        <ComputerCRUD />
      </div>
    </div>
  )
}

export default Computer
