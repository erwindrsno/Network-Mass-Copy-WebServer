import { createResource, createSignal, Show } from 'solid-js';
import { useAuthContext } from "../utils/AuthContextProvider.jsx";
import FileModal from "./FileModal.jsx";
import { createStore } from "solid-js/store";
import { CopyIcon } from "./CopyIcon.jsx";
import { TakeownIcon } from "./TakeownIcon.jsx";
import { InfoIcon } from './InfoIcon.jsx';

import Pagination from '../utils/Pagination.jsx'

const fetchEntries = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/entry`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  if (!response.ok && response.status === 401) {
    console.log("UNAUTH!")
  }
  const result = await response.json();
  console.log(result);
  return result;
}


function EntryRecordTable() {
  const { token, setToken } = useAuthContext();
  const [entries, { mutate, refetch }] = createResource(() => fetchEntries(token()));
  const [isModalToggled, toggleModal] = createSignal(false);
  const [title, setTitle] = createSignal("" || "N/A");
  const [entryId, setEntryId] = createSignal(null);
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const openModal = (title, id) => {
    setTitle(title);
    setEntryId(id);
    toggleModal(prev => !prev);
  }

  const closeModal = () => {
    setTitle("");
    setEntryId(null);
    toggleModal(prev => !prev);
  }

  return (
    <div class="w-5/6 flex flex-col justify-self-center self-center gap-3 mt-12">
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="px-4 w-3xs py-3 text-left">No.</th>
              <th scope="col" class="w-3xl py-3 text-left">Title</th>
              <th scope="col" class="w-md py-3 text-left">File</th>
              <th scope="col" class="w-sm py-3 text-left">From OXAM</th>
              <th scope="col" class="w-sm py-3 text-left">Created at</th>
              <th scope="col" class="w-3xs py-3 text-left">Status</th>
              <th scope="col" class="py-3 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated().items?.map((entry, index) => (
              <tr key={entry.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * 10 + index + 1}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.title}</td>
                <td class="py-3 text-left whitespace-nowrap"><button onClick={() => openModal(entry.title, entry.id)}>view</button></td>
                <td class="py-3 text-left whitespace-nowrap">{entry.fromOxam.toString()}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.createdAt}</td>
                <td class="py-3 text-left whitespace-nowrap">{entry.completeness}</td>
                <td class="text-center text-sm px-0.5">
                  <button onClick={() => console.log(entry.createdAt)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><CopyIcon></CopyIcon></button>
                  <button onClick={() => console.log(entry.createdAt)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><TakeownIcon></TakeownIcon></button>
                  <button onClick={() => console.log(entry.createdAt)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer"><InfoIcon></InfoIcon></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Show when={isModalToggled()}>
          <FileModal title={title()} entryId={entryId()} closeModal={closeModal} />
        </Show>
      </div>

      <Pagination items={entries()} onPageChange={setPaginated} />
    </div >
  )
}

export default EntryRecordTable;
