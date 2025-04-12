import { createResource, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router'

const fetchUser = async () => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/users`, {
    method: "GET",
    credentials: "include",
  })
  if(!response.ok && response.status === 401){
    console.log("UNAUTH!")
  }

  return response.json();
}

function UserTable(){
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = createSignal(1)
  const itemsPerPage = 10

  const [users, {mutate, refetch}] = createResource(fetchUser)

  const handleDelete = async (userId) => {
    // if (!confirm("Are you sure you want to delete this computer?")) return;
    console.log("To be deleted is  : " + userId)
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/users/id/${userId}`, {
      method: "DELETE",
      credentials: "include",
    })
    if(!response.ok && response.status === 401){
      console.log("UNATUH!")
    } else{
      refetch()
    }
    console.log(response)
  }

  const totalPages = () => {
    return Math.ceil(users()?.length / itemsPerPage);
  }

  const paginatedUsers = () => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users()?.slice(startIndex, endIndex);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages()) {
      setCurrentPage(page);
    }
  }
  return(
    <div class = "w-full flex flex-col justify-center items-center gap-3">
      <div class = "shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
          <tr>
            <th scope="col" class="px-4 w-1/6 py-3 text-left">No.</th>
            <th scope="col" class="w-md py-3 text-left">Name</th>
            <th scope="col" class="w-md py-3 text-left">User name</th>
            <th scope="col" class="py-3 w-1/6">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers()?.map((user,index) => (
            <tr key={user.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3 text-left">{(currentPage() - 1) * itemsPerPage + index + 1}</td>
              <td class="py-3 text-left whitespace-nowrap">{user.username}</td>
              <td class="py-3 text-left whitespace-nowrap">{user.display_name}</td>
              <td class="text-center text-sm px-0.5">
                <button onClick={() => handleDelete(user.id)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div class="w-full flex flex-row justify-between">
        <button onClick={() => handlePageChange(currentPage() - 1)} disabled={currentPage() === 1} class="ml-0.5 cursor-pointer">
          Previous
        </button>
        <span>Page {currentPage()} of {totalPages()}</span>
        <button onClick={() => handlePageChange(currentPage() + 1)} disabled={currentPage() === totalPages()} class="cursor-pointer">
          Next
        </button>
      </div>
    </div>
  )
}

export default UserTable
