import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'

import UserTable from './UserTable.jsx'

function UserCRUD(){

  const navigate = useNavigate()
  return(
    <div class="w-3xl flex flex-col items-center">
      <div class="w-full mb-2 flex flex-row justify-between">
        <h1 class="ml-0.5 text-2xl">User</h1>
        <button onClick={() => navigate('add')} class="bg-blue-700 font-semibold text-blue-50 py-1 px-3 rounded-sm">+ Create User</button>
      </div>
      <UserTable />
    </div>
  )
}

export default UserCRUD
