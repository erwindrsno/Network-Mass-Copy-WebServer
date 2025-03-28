import { A, useNavigate } from '@solidjs/router'

function ProfileDropdown(){
  const navigate = useNavigate()

  const handleLogout = async () =>{
    // const response = await fetch('http://localhost:7070/users/logout', {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: new URLSearchParams({
    //     username: formData.get('username'),
    //     password: formData.get('password'),
    //   }),
    // })
    navigate("/login", { replace: true })
  }

  return(
    <div class="mt-11 mr-4 absolute bg-slate-50 w-40 border rounded-md right-0 border-gray-300">
      <nav class="flex flex-col p-2 space-y-2">
        <A href="/admin">Admin</A>
        <div class="border-t border-gray-400"></div>
        <button onClick={handleLogout} class="text-start cursor-pointer">Log out</button>
      </nav>
    </div>
  )
}

export default ProfileDropdown