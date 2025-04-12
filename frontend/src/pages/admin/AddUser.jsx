import Header from '../../components/header/Header.jsx'
import Navbar from '../../components/admin/Navbar.jsx'
import UserCRUD from '../../components/admin/user/UserCRUD.jsx'
import AddUserForm from '../../components/admin/user/AddUserForm.jsx'

function AddUser(){
  return(
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <div class="w-full flex flex-1 flex-col mt-32 items-center gap-5">
        <h1 class="text-center text-4xl font-semibold">Add User</h1>
        <AddUserForm />
      </div>
    </div>
  )
}

export default AddUser
