import { createResource, createSignal } from 'solid-js';
import { action, useNavigate } from "@solidjs/router";
import Pagination from '../../utils/Pagination.jsx';
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";

const fetchComputer = async (token, selectedLab) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer/lab/${selectedLab}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }

  return response.json();
}


function ComputerTable(props) {
  const navigate = useNavigate()
  const { token, setToken } = useAuthContext();
  //harus pake arrow function di props.selectedLab supaya solidJS dapat melacak reaktivitas props.selectedLab dan
  //melakukan refetch setiap kali nilainya berubah, yang kemudian mengembalikan nilai props.selectedLab ke (lab)
  const [computers, { mutate, refetch }] = createResource(() => props.selectedLab, (lab) => fetchComputer(token, lab));

  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const handleDelete = async (computerId) => {
    if (!confirm("Are you sure you want to delete this computer?")) return;
    console.log("To be deleted is  : " + computerId)
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer/id/${computerId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token()}`
      },
    })
    if (!response.ok && response.status === 401) {
      console.log("UNATUH!")
    } else {
      refetch()
    }
    console.log(response)
  }

  return (
    <div class="w-full flex flex-col justify-center items-center gap-3">
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="px-4 w-1/6 py-3 text-left">No.</th>
              <th scope="col" class="w-md py-3 text-left">Name</th>
              <th scope="col" class="w-md py-3 text-left">IP address</th>
              <th scope="col" class="py-3 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated().items?.map((computer, index) => (
              <tr key={computer.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * 10 + index + 1}</td>
                <td class="py-3 text-left whitespace-nowrap">{computer.host_name}</td>
                <td class="py-3 text-left whitespace-nowrap">{computer.ip_address}</td>
                <td class="text-center text-sm px-0.5">
                  <button onClick={() => handleDelete(computer.id)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <Pagination items={computers()} onPageChange={setPaginated} />
    </div>
  )
}

export default ComputerTable
