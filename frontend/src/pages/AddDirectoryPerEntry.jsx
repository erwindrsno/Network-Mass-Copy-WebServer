import Header from '../components/header/Header.jsx';
import { useParams, useLocation, useNavigate } from "@solidjs/router";
import AddDirectoryForm from '../components/home/single_entry/AddDirectoryForm.jsx';

function AddDirectoryPerEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-lg pt-6 pb-7 mt-30 flex flex-col self-center items-center border border-gray-300 bg-gray-50 shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold">Add Directory</h1>
        <h2 class="text-md text-gray-400">{location.state.title}</h2>
        <AddDirectoryForm />
      </main>
    </div>
  )
}

export default AddDirectoryPerEntry;
