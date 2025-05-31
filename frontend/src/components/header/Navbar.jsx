import { A } from '@solidjs/router'
import Profile from './Profile.jsx'

function Navbar() {
  return (
    <div class="flex h-full w-1/2 items-center">
      <nav class='flex justify-around w-full font-medium'>
        <A href='/home' end={true} class="text-slate-200" activeClass="underline">Home</A>
        <A href="/home/copy-oxam" class="text-slate-200" activeClass="underline">Copy (OXAM)</A>
        <A href="/home/copy" class="text-slate-200" activeClass="underline">Copy</A>
        <A href="/home/status_board" class="text-slate-200" activeClass="underline">Status Board</A>
      </nav>
    </div>
  )
}

export default Navbar
