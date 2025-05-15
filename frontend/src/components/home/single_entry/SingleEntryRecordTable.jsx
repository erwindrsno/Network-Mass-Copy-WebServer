import { createResource, createSignal, Show, createMemo, createEffect } from 'solid-js';
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";
import Pagination from '../../utils/Pagination.jsx'
import { useParams } from "@solidjs/router";
import { useFileDropdownContext } from "../../utils/FileDropdownContextProvider.jsx";
import { CopyIcon, TakeownIcon, InfoIcon } from '../../../assets/Icons.jsx';
import { formatDateTime } from '../../utils/DateTimeDisplayFormatter.jsx';

const fetchFileRecord = async (token, id) => {
  console.log("id at fetchFileRecords is: " + id);
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry/${id}`, {
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
  console.log(result);
  return result;
}

function SingleEntryRecordTable(props) {
  const params = useParams();
  const { token, setToken } = useAuthContext();
  const { currFilename, setCurrFilename } = useFileDropdownContext();
  const [fileRecords, { mutate, refetch }] = createResource(
    () => fetchFileRecord(token, params.id)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const filteredFiles = createMemo(() => {
    //jika files masih dalam proses fetching
    if (fileRecords.loading) {
      return [];
    } else if (fileRecords()) {
      return fileRecords().filter((file) => file.fileRecord.filename === currFilename());
    }
    //jika files gagal fetching
    else {
      return [];
    }
  });

  return (
    <>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="w-1/12 px-4 py-3 text-left">No.</th>
              <th scope="col" class="w-1/5 py-3 text-left">Hostname | IP address</th>
              <th scope="col" class="w-1/5 py-3 text-center">Owner</th>
              <th scope="col" class="w-1/6 py-3 text-center">Copied at</th>
              <th scope="col" class="w-1/6 py-3 text-center">Takeowned at</th>
              <th scope="col" class="w-min py-3 text-center">Permissions</th>
              <th scope="col" class="w-1/6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(file, index) => (
                <tr key={file.fileRecord.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * 10 + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap">{file.computer.host_name} | {file.computer.ip_address}</td>
                  <td class="py-3 text-center whitespace-nowrap">{file.fileRecord.owner}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(file.fileRecordComputer.copiedAt)}</td>
                  <td class="py-3 text-center whitespace-nowrap">{"null"}</td>
                  <td class="py-3 text-center whitespace-nowrap">{file.fileRecord.permissions}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex gap-1 justify-center">
                      <button onClick={() => openSudoModal(entry.id, entry.title, entry.count)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                      <button onClick={() => console.log("yoyoyo")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TakeownIcon></TakeownIcon></button>
                      <button onClick={() => console.log("infoooo")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><InfoIcon></InfoIcon></button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Pagination items={filteredFiles()} onPageChange={setPaginated} />
    </>
  )
}

export default SingleEntryRecordTable;
