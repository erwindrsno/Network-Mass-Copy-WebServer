import ComputerTable from './ComputerTable.jsx'
import { useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'

function ComputerCRUD(){
  const navigate = useNavigate()

  const [labNum, setLabNum] = createSignal("1");

  const handleLabNumChange = (event) => {
    setLabNum(event.target.value)
    console.log("Selected lab num is : " + labNum())
  }

  return(
    <div class="w-3xl flex flex-col items-center">
      <div class="w-full mb-2 flex flex-row justify-between">
        <div class="flex flex-row justify-center items-center gap-3">
          <h1 class="ml-0.5 text-2xl">Computer</h1>
          <select name="lab_num" value={labNum()} onChange={handleLabNumChange} class="bg-gray-50 rounded-sm border border-slate-300"> 
            <option value="1">LAB01 - 9018</option>
            <option value="2">LAB02 - 9017</option>
            <option value="3">LAB03 - 9016</option>
            <option value="4">LAB04 - 9015</option>
          </select>
        </div>

        <button onClick={() => navigate('add')} class="bg-blue-700 font-semibold text-blue-50 py-1 px-3 rounded-sm">+ Add Computer</button>
      </div>
      <ComputerTable selectedLab={labNum()} />
    </div>
  )
}

export default ComputerCRUD
