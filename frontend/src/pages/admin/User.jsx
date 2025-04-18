import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import UserCRUD from '../../components/admin/user/UserCRUD.jsx'

function User(){
  return(
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <div class="w-full flex flex-col justify-self-center items-center">
        <Navbar />
        <UserCRUD />
      </div>
    </div>
  )
}

export default User
