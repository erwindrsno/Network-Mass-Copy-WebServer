import { createSignal, createEffect, createResource, createMemo } from "solid-js";
import { useAuthContext } from "../utils/AuthContextProvider.jsx";

function ComputerSelector(props) {
  const selectedComputers = props.selectedComputers;
  const setSelectedComputers = props.setSelectedComputers;
  const { token, setToken } = useAuthContext();
  const [labNum, setLabNum] = createSignal(1);
  const [computers, { mutate, refetch }] = createResource(() => fetchComputer(token));

  const filteredComputers = createMemo(() => {
    //jika computers masih dalam proses fetching
    if (computers.loading) {
      return [];
    } else if (computers()) {
      return computers().filter((c) => c.lab_num === labNum());
    }
    //jika computers gagal fetching
    else {
      return [];
    }
  });

  const handleLabNumChange = (event) => {
    setLabNum(Number(event.target.value))
  }

  const handleClickedComputer = (host_name, ip_address, isSelected) => {
    const computer = { host_name, ip_address };

    if (!isSelected()) {
      setSelectedComputers((prev) => prev.toSpliced(prev.length, 0, computer));
    } else {
      setSelectedComputers((prev) => {
        const index = prev.findIndex(
          (comp) =>
            comp.ip_address === computer.ip_address &&
            comp.host_name === computer.host_name
        );
        if (index === -1) return prev;
        return prev.toSpliced(index, 1);
      });
    }
  };

  return (
    <div class="flex flex-col gap-4">
      <select name="lab_num" onChange={handleLabNumChange} value={labNum()} class="bg-gray-50 rounded-sm border border-slate-300">
        <option value="1">LAB01 - 9018</option>
        <option value="2">LAB02 - 9017</option>
        <option value="3">LAB03 - 9016</option>
        <option value="4">LAB04 - 9015</option>
      </select>

      <div class="w-full h-full px-4 py-4 shadow-md bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div class="grid grid-cols-7 w-full h-3/4 gap-2">
          <For each={filteredComputers()} fallback={<p>Loading...</p>}>
            {(item, index) => {
              const isSelected = () => {
                return selectedComputers().some((comp) => comp.ip_address === item.ip_address);
              }

              return (
                <div class={`w-32 text-center flex flex-col border rounded-sm border-gray-300 relative p-0 z-40 cursor-pointer ${isSelected() ? "bg-green-300" : "bg-sky-100"
                  }`} onClick={() => handleClickedComputer(item.host_name, item.ip_address, isSelected)}>
                  <p class="text-lg">{item.host_name}</p>
                  <p class="text-sm">{item.ip_address}</p>
                </div>
              )
            }}
          </For>
        </div>
      </div>
    </div>
  )
}

const fetchComputer = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_LOCALHOST_BACKEND_URL}/computer/`, {
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
  return result
}

export default ComputerSelector;
