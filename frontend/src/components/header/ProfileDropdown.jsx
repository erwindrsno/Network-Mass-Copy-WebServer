import { A, useNavigate, action } from "@solidjs/router";
import { useAuthContext } from "../utils/AuthContextProvider.jsx";

function ProfileDropdown() {
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (!confirm(`Are you sure you want to log out?`)) return;
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      },
    })
    if (!response.ok) {
      console.log("BAD");
      console.log(response)
    } else {
      console.log(response)
      setToken("");
      sessionStorage.removeItem("token");
      console.log(sessionStorage.getItem("token"));
    }
    navigate("/", { replace: true })
  }

  return (
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
