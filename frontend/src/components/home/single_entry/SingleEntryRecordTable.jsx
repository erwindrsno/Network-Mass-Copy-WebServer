import { createResource, createSignal, Show, createEffect } from 'solid-js';
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";
import Pagination from '../../utils/Pagination.jsx'
import { useParams } from "@solidjs/router";
import { useFileDropdownContext } from "../../utils/FileDropdownContextProvider.jsx";

const fetchFileRecord = async (token, id, filename) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${id}/filename/${filename}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  const result = await response.json();
  return result;
}

function SingleEntryRecordTable(props) {
  const params = useParams();
  const { token, setToken } = useAuthContext();
  const { currFilename, setCurrFilename } = useFileDropdownContext();
  const [fileRecords, { mutate, refetch }] = createResource(
    () => currFilename() || undefined,
    (filename) => fetchFileRecord(token, params.id, filename)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });


  return (
    <div class="flex flex-col justify-center items-center gap-3">
      <div class="w-5/6 flex flex-col justify-self-center self-center gap-3 mt-12">
        <div class="shadow-md rounded-lg overflow-hidden">
          <table class="text-sm rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 bg-gray-300">
              <tr>
                <th scope="col" class="px-4 w-3xs py-3 text-left">No.</th>
                <th scope="col" class="w-3xl py-3 text-left">Hostname</th>
                <th scope="col" class="w-md py-3 text-left">Owner</th>
                <th scope="col" class="w-sm py-3 text-left">Copied at</th>
                <th scope="col" class="w-sm py-3 text-left">Takeowned at</th>
                <th scope="col" class="w-3xs py-3 text-left">Permissions</th>
                <th scope="col" class="py-3 w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              <For each={fileRecords()} fallback={<p>w8 a min</p>}>
                {(file, index) => (
                  <tr key={file.fileRecord.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * 10 + index() + 1}</td>
                    <td class="py-3 text-left whitespace-nowrap">{file.computer.host_name}</td>
                    <td class="py-3 text-center whitespace-nowrap">{file.fileRecord.owner}</td>
                    <td class="py-3 text-center whitespace-nowrap justify-items-center">{"null"}</td>
                    <td class="py-3 text-left whitespace-nowrap">{"null"}</td>
                    <td class="py-3 text-left whitespace-nowrap">{file.fileRecord.permissions}</td>
                    <td class="text-center text-sm px-2 py-1.5">{}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>

      <Pagination items={fileRecords()} onPageChange={setPaginated} />
    </div>
  )
}

export default SingleEntryRecordTable;
