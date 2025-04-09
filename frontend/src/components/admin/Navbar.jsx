import { A } from '@solidjs/router'

function Navbar(){
    return(
        <div class="w-60 h-full bg-slate-600">
         <nav class='flex flex-col w-full p-5 gap-3'>
          <A href="/admin/computer" class="text-gray-50 text-xl">Computer</A>
          <A href="/admin/user" class="text-gray-50 text-xl">User</A>
         </nav>
        </div>
    )
}

export default Navbar;
