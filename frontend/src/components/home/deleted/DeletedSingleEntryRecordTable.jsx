import { createResource, createSignal, Show, createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";
import { createStore } from "solid-js/store"
import Pagination from '../../utils/Pagination.jsx'
import { useParams } from "@solidjs/router";
import { CopyIcon, TakeownIcon, InfoIcon } from '../../../assets/Icons.jsx';
import { formatDateTime } from '../../utils/DateTimeDisplayFormatter.jsx';
// import SingleEntrySudoModal from "../SingleEntrySudoModal.jsx";
import { useWebSocketContext } from '../../utils/WebSocketContextProvider.jsx';
import { useNavigate, action } from "@solidjs/router";

const fetchPerEntry = async (token, id) => {
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

const authSudoAction = async (event, token, entryId, isCopy, closeModal, directory) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget)
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/user/sudo`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
    body: formData,
  })

  if (!response.ok && response.status === 401) {
    toast.error("Sudo action not permit.");
  }
  if (response.ok && response.status === 200) {
    console.log(isCopy());
    if (isCopy()) {
      console.log("handle copy");
      handleCopyByDirectory(token, entryId, directory, closeModal);
    } else if (isCopy() === false) {
      handleTakeownByDirectory(token, entryId, directory, closeModal);
    } else {
      console.log("nothing to handle!");
    }
  }
}

const handleCopyByDirectory = async (token, entryId, directory, closeModal) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directory.id}/entry/${entryId()}/copy`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  if (response.ok && response.status === 200) {
    console.log("SUCCEED!");
  }
  closeModal();
}

const handleTakeownByDirectory = async (token, entryId, directory, closeModal) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/directory/${directory.id}/entry/${entryId()}/takeown`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token()}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  if (response.ok && response.status === 200) {
    console.log("SUCCEED!");
  }
  closeModal();
}

function DeletedSingleEntryRecordTable(props) {
  const maxItems = 8;
  const navigate = useNavigate();
  const params = useParams();
  const title = props.title;
  const { socket, setSocket } = useWebSocketContext();
  const { token, setToken } = useAuthContext();
  const [isCopy, setIsCopy] = createSignal(null);
  const [entryId, setEntryId] = createSignal(null);
  const [isModalToggled, toggleModal] = createSignal(false);
  const [directory, setDirectory] = createStore({
    id: null,
    owner: ""
  });

  const [computer, setComputer] = createStore({
    ip_addr: "",
    host_name: ""
  })

  const [dirPerEntry, { mutate, refetch }] = createResource(
    () => fetchPerEntry(token, params.entry_id)
  );
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const viewFilePerDirectory = (entryId, title, directoryId, owner) => {
    navigate(`directory/${directoryId}`, { state: { title: title, owner: owner } });
  }

  const openModal = (ip, host_name, owner, directoryId, entryId, flag) => {
    setComputer({
      "ip_addr": ip,
      "host_name": host_name
    })
    setDirectory({
      "id": directoryId,
      "owner": owner
    })
    setEntryId(entryId);
    setIsCopy(flag);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setComputer({
      "ip_addr": "",
      "host_name": ""
    })
    setDirectory({
      "id": null,
      "owner": ""
    })
    setEntryId(null);
    setIsCopy(null);
    toggleModal(prev => !prev);
  }

  onMount(() => {
    const ws = socket();
    if (!ws) return;

    const onMessage = (event) => {
      const message = event.data;

      console.log(message);
      if (message === "refetch") {
        refetch();
      }
    };

    ws.addEventListener("message", onMessage);

    onCleanup(() => {
      ws.removeEventListener("message", onMessage);
    });
  });
  // const filteredFiles = createMemo(() => {
  //   //jika files masih dalam proses fetching
  //   if (fileRecords.loading) {
  //     return [];
  //   } else if (fileRecords()) {
  //     return fileRecords().filter((file) => file.fileRecord.filename === currFilename());
  //   }
  //   //jika files gagal fetching
  //   else {
  //     return [];
  //   }
  // });
  //
  return (
    <>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="w-1/12 px-4 py-3 text-left">No.</th>
              <th scope="col" class="w-1/6 py-3 text-center">Hostname | IP address</th>
              <th scope="col" class="w-1/5 py-3 text-center">Owner</th>
              <th scope="col" class="w-1/4 py-3 text-left">Path</th>
              <th scope="col" class="w-1/6 py-3 text-center">Copied</th>
              <th scope="col" class="w-1/3 py-3 text-center">Takeowned at</th>
              <th scope="col" class="w-1/3 py-3 text-center">Deleted at</th>
              <th scope="col" class="w-1/5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(item, index) => (
                <tr key={item.directory.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-center whitespace-nowrap">{item.computer.host_name} | {item.computer.ip_address}</td>
                  <td class="py-3 text-center whitespace-nowrap">{item.directory.owner}</td>
                  <td class="py-3 text-left whitespace-nowrap truncate">{item.directory.path}</td>
                  <td class="py-3 text-center whitespace-nowrap">{`${item.directory.copied} / ${item.directory.fileCount}`}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.directory.takeOwnedAt)}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(item.directory.deletedAt)}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex flex-col gap-1 w-min">
                      <button onClick={() => viewFilePerDirectory(params.entry_id, title, item.directory.id, item.directory.owner)} class="bg-blue-600 hover:bg-blue-700 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">View</button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>


      <Pagination items={dirPerEntry()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default DeletedSingleEntryRecordTable;
