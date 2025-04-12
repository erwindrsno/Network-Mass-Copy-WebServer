import { useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'

import UserTable from './UserTable.jsx'

function UserCRUD(){
  const navigate = useNavigate()

  // const [labNum, setLabNum] = createSignal("1");


  return(
    <div>
      <h1>User</h1>
      <button onClick={() => navigate('add')}>+</button>
      <UserTable />
    </div>
  )
}

export default UserCRUD
