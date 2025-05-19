import { createResource, createSignal, Show, createMemo, createEffect } from 'solid-js';
import { useAuthContext } from "../../utils/AuthContextProvider.jsx";
import { createStore } from "solid-js/store"
import Pagination from '../../utils/Pagination.jsx'
import { useParams } from "@solidjs/router";
import { useFileDropdownContext } from "../../utils/FileDropdownContextProvider.jsx";
import { CopyIcon, TakeownIcon, InfoIcon } from '../../../assets/Icons.jsx';
import { formatDateTime } from '../../utils/DateTimeDisplayFormatter.jsx';
import SingleEntrySudoModal from "./SingleEntrySudoModal.jsx";

const fetchFileRecord = async (token, id) => {
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

const authSudoAction = async (event, token, entryId, isCopy, closeModal, fileRecord, fileRecordComputerId) => {
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
      handleCopySingleFileRecord(token, entryId, fileRecord, fileRecordComputerId, closeModal);
    } else if (isCopy() === false) {
      // handleTakeownByEntry(token, id, closeModal);
      console.log("handle takeown");
    } else {
      console.log("nothing to handle!");
    }
  }
}

const handleCopySingleFileRecord = async (token, entryId, fileRecord, fileRecordComputerId, closeModal) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/file/${fileRecord.id}/copy/file_computer/${fileRecordComputerId()}/entry/${entryId()}`, {
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

function SingleEntryRecordTable(props) {
  const maxItems = 8;
  const params = useParams();
  const { token, setToken } = useAuthContext();
  const { currFilename, setCurrFilename } = useFileDropdownContext();
  const [isCopy, setIsCopy] = createSignal(null);
  const [entryId, setEntryId] = createSignal(null);
  const [isModalToggled, toggleModal] = createSignal(false);
  const [fileRecord, setFileRecord] = createStore({
    id: null,
    owner: ""
  });
  const [fileRecordComputerId, setFileRecordComputerId] = createSignal(null);

  const [computer, setComputer] = createStore({
    ip_addr: "",
    host_name: ""
  })

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

  const openModal = (ip, host_name, owner, fileRecordId, fileRecordComputerId, entryId, flag) => {
    setComputer({
      "ip_addr": ip,
      "host_name": host_name
    })
    setFileRecord({
      "id": fileRecordId,
      "owner": owner
    })
    setFileRecordComputerId(fileRecordComputerId);
    setEntryId(entryId);
    setIsCopy(flag);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setComputer({
      "ip_addr": "",
      "host_name": ""
    })
    setFileRecord({
      "id": null,
      "owner": ""
    })
    setEntryId(null);
    setIsCopy(null);
    toggleModal(prev => !prev);
  }

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
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap">{file.computer.host_name} | {file.computer.ip_address}</td>
                  <td class="py-3 text-center whitespace-nowrap">{file.fileRecord.owner}</td>
                  <td class="py-3 text-center whitespace-nowrap justify-items-center">{formatDateTime(file.fileRecordComputer.copiedAt)}</td>
                  <td class="py-3 text-center whitespace-nowrap">{"null"}</td>
                  <td class="py-3 text-center whitespace-nowrap">{file.fileRecord.permissions}</td>
                  <td class="text-center text-sm px-2 py-1.5">
                    <div class="flex gap-1 justify-center">
                      <button onClick={() => openModal(file.computer.ip_address, file.computer.host_name, file.fileRecord.owner, file.fileRecord.id, file.fileRecordComputer.id, params.id, true)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                      <button onClick={() => console.log(file)} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TakeownIcon></TakeownIcon></button>
                      <button onClick={() => console.log("infoooo")} class="bg-gray-700 hover:bg-gray-900 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><InfoIcon></InfoIcon></button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <Show when={isModalToggled() && isCopy() !== null}>
          <SingleEntrySudoModal entryId={entryId} closeModal={closeModal} authSudoAction={authSudoAction} isCopy={isCopy} fileRecord={fileRecord} fileRecordComputerId={fileRecordComputerId} computer={computer} />
        </Show>
      </div>


      <Pagination items={filteredFiles()} onPageChange={setPaginated} maxItems={maxItems} />
    </>
  )
}

export default SingleEntryRecordTable;
