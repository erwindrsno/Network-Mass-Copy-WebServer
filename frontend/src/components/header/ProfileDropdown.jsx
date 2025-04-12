import { A, useNavigate, action } from '@solidjs/router'

function ProfileDropdown(){
  const navigate = useNavigate()

  const handleLogout = async () => {
    console.log("REACHED!!!!!!")
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    })
    if(!response.ok){
      console.log("BAD");
      console.log(response)
    } else{
      console.log(response)
    }
    navigate("/login", { replace: true })
  }

  // const handleLogout = async () =>{
  //   console.log("REACHED")
  //   const response = await fetch('http://89.116.121.247:7070/users/logout', {
  //     method: "POST",
  //     credentials: "include"
  //   })
  //   if(!response.ok){
  //     console.log("BAD");
  //     console.log(response)
  //   } else{
  //     console.log(response)
  //   }
  //   navigate("/login", { replace: true })
  // }

  return(
    <div class="mt-11 mr-4 absolute bg-slate-50 w-40 border rounded-md right-0 border-gray-300">
      <nav class="flex flex-col p-2 space-y-2">
        <A href="/admin/computer">Admin</A>
        <div class="border-t border-gray-400"></div>
        <button onClick={handleLogout} class="text-start cursor-pointer">Log out</button>
      </nav>
    </div>
  )
}

export default ProfileDropdown
