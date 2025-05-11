import Header from '../components/header/Header.jsx';
import PingBoard from "../components/ping_board/PingBoard.jsx";
import { createResource, createSignal } from 'solid-js';

function PingBoardPage() {
  return (
    <div class="w-full h-full flex flex-col gap-8">
      <Header />
      <main class="w-5xl h-3/4 flex flex-col self-center">
        <PingBoard />
      </main>
    </div >
  )
}

export default PingBoardPage;
