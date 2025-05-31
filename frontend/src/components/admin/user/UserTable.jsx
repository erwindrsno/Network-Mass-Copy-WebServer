import { createResource, createSignal, Show } from 'solid-js';
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { apiFetchUser, apiDeleteUser } from '@apis/UserApi.jsx';
import { extractClaims } from '@utils/ExtractClaims.jsx';
import Pagination from '@utils/Pagination.jsx'
import toast, { Toaster } from 'solid-toast';
import Modal from '@components/admin/Modal';

function UserTable() {
  const maxItems = 10;
  const { token, setToken } = useAuthContext();
  const [isModalToggled, toggleModal] = createSignal(false);
  const [user, setUser] = createSignal(null);
  const { id, role } = extractClaims(token());
  const [users, { mutate, refetch }] = createResource(() => apiFetchUser(token));
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const openModal = (userId, name) => {
    setUser({ id: userId, name: name });
    toggleModal(true);
  }

  const closeModal = () => {
    toggleModal(false);
    setUser(null);
  }

  const deleteUser = async (event) => {
    event.preventDefault();
    const result = await apiDeleteUser(user().id, token);
    if (result.success) {
      console.log("user deletion ok");
      refetch();
      closeModal();
    }
  }

  return (
    <div class={`w-full flex flex-col justify-center items-center gap-3`}>
      <div class="shadow-md rounded-lg overflow-hidden">
        <table class="text-sm rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 bg-gray-300">
            <tr>
              <th scope="col" class="px-4 w-1/6 py-3 text-left">No.</th>
              <th scope="col" class="w-md py-3 text-left">Name</th>
              <th scope="col" class="w-md py-3 text-left">User name</th>
              <th scope="col" class="w-md py-3 text-left">Role</th>
              <th scope="col" class="py-3 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={paginated().items} fallback={<p>Loading...</p>}>
              {(user, index) => (
                <tr key={user.id} class="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-3 text-left">{(paginated().currentPage - 1) * maxItems + index() + 1}</td>
                  <td class="py-3 text-left whitespace-nowrap">{user.username}</td>
                  <td class="py-3 text-left whitespace-nowrap">{user.display_name}</td>
                  <td class="py-3 text-left whitespace-nowrap">{user.role}</td>
                  <td class="text-center text-sm px-0.5">
                    <button onClick={() => {
                      if (id !== user.id) {
                        openModal(user.id, user.display_name)
                      } else {
                        toast.error("Cannot delete yourself.")
                      }
                    }} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Show when={isModalToggled()}>
        <Modal closeModal={closeModal} deleteItem={deleteUser} item={user} />
      </Show>

      <Pagination items={users()} onPageChange={setPaginated} maxItems={maxItems} />
    </div>
  )
}

export default UserTable
