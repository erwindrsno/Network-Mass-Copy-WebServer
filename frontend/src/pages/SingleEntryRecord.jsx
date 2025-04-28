import Header from '../components/header/Header.jsx';
import SingleEntryRecordTable from "../components/home/single_entry/SingleEntryRecordTable.jsx";
import FileDropdown from '../components/home/single_entry/FileDropdown.jsx';
import { FileDropdownContextProvider } from '../components/utils/FileDropdownContextProvider.jsx';
import { useParams, useLocation } from "@solidjs/router";

function SingleEntryRecord() {
  const location = useLocation();
  return (
    <div class="w-full h-full flex flex-col bg-gray-100">
      <Header />
      <p>{location.state.title}</p>
      <FileDropdownContextProvider>
        <FileDropdown />
        <SingleEntryRecordTable />
      </FileDropdownContextProvider>
    </div>
  )
}

export default SingleEntryRecord;
