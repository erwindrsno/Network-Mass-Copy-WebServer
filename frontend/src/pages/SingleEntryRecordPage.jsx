import Header from '../components/header/Header.jsx';
// import SingleEntryRecordTable from "../components/home/single_entry/SingleEntryRecordTable.jsx";
import SingleEntryRecordTable2 from "../components/home/single_entry/SingleEntryRecordTable2.jsx";
import { FileDropdownContextProvider } from '../components/utils/FileDropdownContextProvider.jsx';
import { useParams, useLocation } from "@solidjs/router";

function SingleEntryRecordPage() {
  const location = useLocation();
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <h2 class="text-2xl">{location.state.title}</h2>
        <SingleEntryRecordTable2 title={location.state.title} />
      </main>
    </div>
  )
}

export default SingleEntryRecordPage;
