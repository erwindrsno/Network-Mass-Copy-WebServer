import { createResource, createSignal } from 'solid-js';
import { useAuthContext } from "@utils/AuthContextProvider.jsx";
import { apiFetchUser, apiDeleteUser } from '@apis/UserApi.jsx';
import Pagination from '@utils/Pagination.jsx'

function UserTable() {
  const maxItems = 10;
  const { token, setToken } = useAuthContext();
  const [users, { mutate, refetch }] = createResource(() => apiFetchUser(token));
  const [paginated, setPaginated] = createSignal({
    currentPage: 1,
    items: [],
    totalPages: 1
  });

  const handleDelete = async (userId) => {
    if (!confirm(`Are you sure you want to delete this user with name ${userId}?`)) return;
    const result = await apiDeleteUser(userId, token);
    if (result.success) {
      console.log("user deletion ok");
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
              <th scope="col" class="w-md py-3 text-left">User name</th>
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
                  <td class="text-center text-sm px-0.5">
                    <button onClick={() => handleDelete(user.id)} class="bg-red-500 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">Delete</button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Pagination items={users()} onPageChange={setPaginated} maxItems={maxItems} />
    </div>
  )
}

export default UserTable
