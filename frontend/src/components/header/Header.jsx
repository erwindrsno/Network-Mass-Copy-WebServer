import Navbar from './Navbar.jsx'
import Profile from './Profile.jsx'

function Header(){
  return (
    <header class="block h-14 bg-slate-800">
      <div class="flex flex-row items-center h-full justify-between">
        <h1 class="text-slate-200 font-extralight text-xl ml-4">Net Copy</h1>
        <Navbar/>
        <Profile />
      </div>
    </header>
  )
}

export default Header
