import { createResource, createSignal } from 'solid-js';

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
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

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
    <div>
      <table class="table-auto">
        <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>User name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedUsers()?.map(user => (
          <tr key={user.id}> 
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.display_name}</td>
            <td>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>

      <div>
        <button onClick={() => handlePageChange(currentPage() - 1)} disabled={currentPage() === 1}>
          Previous
        </button>
        <span>Page {currentPage()} of {totalPages()}</span>
        <button onClick={() => handlePageChange(currentPage() + 1)} disabled={currentPage() === totalPages()}>
          Next
        </button>
      </div>
    </div>
  )
}

export default UserTable
