import { createResource, createSignal, createMemo, createEffect, For, Show } from 'solid-js';
import Pagination from '@utils/Pagination.jsx';
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { apiDeleteComputer, apiFetchComputer } from '@apis/ComputerApi.jsx';

function ComputerTable(props) {
  const maxItems = 10;
  const { token, setToken } = useAuthContext();
  const [computers, { mutate, refetch }] = createResource(() => apiFetchComputer(token));

  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const filteredComputers = createMemo(() => {
    //jika computers masih dalam proses fetching
    if (computers.loading) {
      return [];
    } else if (computers()) {
      return computers().filter((c) => c.lab_num === props.labNum);
    }
    //jika computers gagal fetching
    else {
      return [];
    }
  });

  const handleDelete = async (computerId) => {
    if (!confirm("Are you sure you want to delete this computer?")) return;
    console.log("To be deleted is  : " + computerId)
    const result = await apiDeleteComputer(computerId, token);
    if (result.success) {
      refetch();
    }
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
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(computer, index) => (
                <tr key={computer.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap">{computer.host_name}</td>
                  <td class="py-3 text-left whitespace-nowrap">{computer.ip_address}</td>
                  <td class="text-center text-sm px-0.5">
                    <button onClick={() => handleDelete(computer.id)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <Show when={filteredComputers().length > 0} fallback={<p>No computers found or still loading...</p>}>
        <Pagination items={filteredComputers()} onPageChange={setPaginated} maxItems={maxItems} />
      </Show>
    </div>
  )
}

export default ComputerTable
