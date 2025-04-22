import { createResource, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router'

import Pagination from '../utils/Pagination.jsx'

const fetchEntries = async () => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entries`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  return response.json();
}

function RecordTable() {
  const [entries, { mutate, refetch }] = createResource(fetchEntries);
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });
  return (
    <div class="w-5/6 flex flex-col justify-self-center self-center gap-3 mt-12">
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="px-4 w-3xs py-3 text-left">No.</th>
              <th scope="col" class="w-3xl py-3 text-left">Title</th>
              <th scope="col" class="w-md py-3 text-left">File</th>
              <th scope="col" class="w-sm py-3 text-left">Permissions</th>
              <th scope="col" class="w-sm py-3 text-left">From OXAM</th>
              <th scope="col" class="w-md py-3 text-left">Copied at</th>
              <th scope="col" class="w-md py-3 text-left">Takeowned at</th>
              <th scope="col" class="w-3xs py-3 text-left">Status</th>
              <th scope="col" class="py-3 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated().items?.map((entry, index) => (
              <tr key={entry.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * 10 + index + 1}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.title}</td>
                <td class="py-3 text-left whitespace-nowrap">u i u a a</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.permissions}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.fromOxam.toString()}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.copied_at}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.takeowned_at}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.completeness}</td>
                <td class="text-center text-sm px-0.5">
                  <button onClick={() => console.log(entry.permissions)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
                  <button onClick={() => console.log(entry.permissions)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Copy</button>
                  <button onClick={() => console.log(entry.permissions)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Takeown</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination items={entries()} onPageChange={setPaginated} />
    </div>
  )
}

export default RecordTable;
