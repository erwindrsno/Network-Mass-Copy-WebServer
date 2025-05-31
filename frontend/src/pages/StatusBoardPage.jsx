import Header from '@components/header/Header.jsx';
import StatusBoard from "@components/status_board/StatusBoard.jsx";

function StatusBoardPage() {
  return (
    <div class="w-full h-full flex flex-col gap-8">
      <Header />
      <main class="w-5xl h-3/4 flex flex-col self-center">
        <StatusBoard />
      </main>
    </div >
  )
}

export default StatusBoardPage;
