import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import ComputerCRUD from '../../components/admin/ComputerCRUD.jsx'

function Computer(){
  return(
    <div class="w-full h-full">
      <Header />
        <div class="w-full h-full flex">
            <Navbar />
            <ComputerCRUD />
        </div>
    </div>
  )
}

export default Computer
