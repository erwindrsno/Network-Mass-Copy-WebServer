import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import UserCRUD from '../../components/admin/user/UserCRUD.jsx'
import AddUserForm from '../../components/admin/user/AddUserForm.jsx'

function AddUser(){
  return(
    <div class="w-full h-full">
      <Header />
        <div class="w-full h-full flex">
            <Navbar />
            <AddUserForm />
        </div>
    </div>
  )
}

export default AddUser
