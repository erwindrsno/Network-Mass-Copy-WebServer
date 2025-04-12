import { createResource, createSignal } from 'solid-js';
import { action, useNavigate } from "@solidjs/router";

const fetchComputer = async (selectedLab) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computers/lab/${selectedLab}`, {
    method: "GET",
    credentials: "include",
  })
  if(!response.ok && response.status === 401){
    console.log("UNAUTH!")
  }

  return response.json();
}


function ComputerTable(props){
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  const navigate = useNavigate()
  //harus pake arrow function di props.selectedLab supaya solidJS dapat melacak reaktivitas props.selectedLab dan
  //melakukan refetch setiap kali nilainya berubah
  const [computers , {mutate, refetch}] = createResource(() => props.selectedLab, fetchComputer)

  const handleDelete = async (computerId) => {
    // if (!confirm("Are you sure you want to delete this computer?")) return;
    console.log("To be deleted is  : " + computerId)
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computers/id/${computerId}`, {
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
    return Math.ceil(computers()?.length / itemsPerPage);
  }

  const paginatedComputers = () => {
    const startIndex = (currentPage() - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return computers()?.slice(startIndex, endIndex);
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
          <th>IP address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedComputers()?.map(computer => (
          <tr key={computer.id}> 
            <td>{computer.id}</td>
            <td>{computer.host_name}</td>
            <td>{computer.ip_address}</td>
            <td>
              <button onClick={() => handleDelete(computer.id)}>Delete</button>
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

export default ComputerTable
