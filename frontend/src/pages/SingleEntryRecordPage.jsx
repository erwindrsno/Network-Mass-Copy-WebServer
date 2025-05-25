import Header from '../components/header/Header.jsx';
import SingleEntryRecordTable from "../components/home/single_entry/SingleEntryRecordTable.jsx";
import { useParams, useLocation, useNavigate } from "@solidjs/router";

function SingleEntryRecordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state.title;
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <div class="flex justify-between">
          <h2 class="text-2xl">{title}</h2>
          <button onClick={() => navigate("add", { state: { title: title } })} class="bg-blue-600 hover:bg-blue-700 text-gray-50 px-1 py-0.5 rounded-xs cursor-pointer">+ Add directory</button>
        </div>
        <SingleEntryRecordTable title={title} />
      </main>
    </div >
  )
}

export default SingleEntryRecordPage;
