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
    <div>
      <h1>Computer</h1>
      <button onClick={() => navigate('add')}>+</button>
      <select name="lab_num" value={labNum()} onChange={handleLabNumChange}> 
        <option value="1">LAB01 - 9018</option>
        <option value="2">LAB02 - 9017</option>
        <option value="3">LAB03 - 9016</option>
        <option value="4">LAB04 - 9015</option>
      </select>
      <ComputerTable selectedLab={labNum()} />
    </div>
  )
}

export default ComputerCRUD
