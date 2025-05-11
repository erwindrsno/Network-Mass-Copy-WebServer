import EntryRecordTable from '../components/home/EntryRecordTable.jsx';
import Header from '../components/header/Header.jsx';

function HomePage() {
  return (
    <div class="w-full h-full flex flex-col bg-gray-100 gap-8">
      <Header />
      <main class="w-7xl flex flex-col justify-self-center self-center gap-3">
        <EntryRecordTable />
      </main>
    </div >
  )
}

export default HomePage;
