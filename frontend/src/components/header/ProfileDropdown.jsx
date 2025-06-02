import { A, useNavigate, action } from "@solidjs/router";
import { Show } from "solid-js";
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { extractClaims } from "@utils/ExtractClaims";
import { useSseContext } from "@utils/SseContextProvider";

function ProfileDropdown() {
  const { token, setToken } = useAuthContext();
  const { sse, setSse } = useSseContext();
  const { role } = extractClaims(token());
  const navigate = useNavigate()

  const handleLogout = async () => {
    setSse(null);
    setToken("");
    sessionStorage.removeItem("token");
    navigate("/")
  }

  return (
    <div class="mt-11 mr-4 absolute bg-slate-50 w-40 border rounded-md right-0 border-gray-300">
      <nav class="flex flex-col p-2 space-y-2">
        <Show when={role === "superadmin"}>
          <A href="/admin/computer">Admin</A>
          <div class="border-t border-gray-400"></div>
        </Show>
        <button onClick={handleLogout} class="text-start cursor-pointer">Log out</button>
      </nav>
    </div>
  )
}

export default ProfileDropdown
