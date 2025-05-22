import { createResource, createSignal, Show, createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import { useAuthContext } from "../../../utils/AuthContextProvider.jsx";
import { createStore } from "solid-js/store"
import Pagination from '../../../utils/Pagination.jsx'
import { useParams } from "@solidjs/router";
import { CopyIcon, TakeownIcon, InfoIcon } from '../../../../assets/Icons.jsx';
import { formatDateTime } from '../../../utils/DateTimeDisplayFormatter.jsx';
// import SingleEntrySudoModal from "./SingleEntrySudoModal.jsx";
import { useWebSocketContext } from '../../../utils/WebSocketContextProvider.jsx';
import { useNavigate, action } from "@solidjs/router";

const fetchPerDirectory = async (token, entryId, directoryId) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directoryId}`, {
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

function SingleDirectoryRecordTable() {
  const maxItems = 8;
  const navigate = useNavigate();
  const params = useParams();
  // const title = props.title;
  const { socket, setSocket } = useWebSocketContext();
  const { token, setToken } = useAuthContext();
  const [isCopy, setIsCopy] = createSignal(null);
  // const [entryId, setEntryId] = createSignal(null);
  const [isModalToggled, toggleModal] = createSignal(false);
  // const [directory, setDirectory] = createStore({
  //   id: null,
  //   owner: ""
  // });

  // const [computer, setComputer] = createStore({
  //   ip_addr: "",
  //   host_name: ""
  // })

  const [fileRecordPerDir, { mutate, refetch }] = createResource(
    () => fetchPerDirectory(token, params.entry_id, params.dir_id)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });
  return (
    <>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="w-1/12 px-4 py-3 text-left">No.</th>
              <th scope="col" class="w-1/3 py-3 text-left">File name</th>
              <th scope="col" class="w-1/5 py-3 text-center">Size</th>
              <th scope="col" class="w-1/6 py-3 text-center">Permissions</th>
              <th scope="col" class="w-1/6 py-3 text-center">Copied at</th>
              <th scope="col" class="w-1/2 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(item, index) => (
                <tr key={item.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap truncate">{item.fileRecord.filename}</td>
                  <td class="py-3 text-center whitespace-nowrap">{(item.fileRecord.filesize / 10240).toFixed(2)} MB</td>
                  <td class="py-3 text-center whitespace-nowrap truncate">{item.fileRecord.permissions}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.fileRecordComputer.copiedAt)}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-col gap-1 w-min">
                      <button onClick={() => viewFilePerDirectory(params.id, title, item.directory.id, item.directory.owner)} class="bg-blue-600 hover:bg-blue-700 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer w-full">View</button>
                      <button onClick={() => viewFilePerDirectory(params.id, title, item.directory.id, item.directory.owner)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <Show when={isModalToggled() && isCopy() !== null}>
          <SingleEntrySudoModal entryId={entryId} closeModal={closeModal} authSudoAction={authSudoAction} isCopy={isCopy} directory={directory} computer={computer} title={title} />
        </Show>
      </div>


      <Pagination items={fileRecordPerDir()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default SingleDirectoryRecordTable;
