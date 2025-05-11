import Header from '../components/header/Header.jsx';
import SingleEntryRecordTable from "../components/home/single_entry/SingleEntryRecordTable.jsx";
import FileDropdown from '../components/home/single_entry/FileDropdown.jsx';
import { FileDropdownContextProvider } from '../components/utils/FileDropdownContextProvider.jsx';
import { useParams, useLocation } from "@solidjs/router";

function SingleEntryRecordPage() {
  const location = useLocation();
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <h2 class="text-2xl">{location.state.title}</h2>
        <FileDropdownContextProvider>
          <FileDropdown />
          <SingleEntryRecordTable />
        </FileDropdownContextProvider>
      </main>
    </div>
  )
}

export default SingleEntryRecordPage;
