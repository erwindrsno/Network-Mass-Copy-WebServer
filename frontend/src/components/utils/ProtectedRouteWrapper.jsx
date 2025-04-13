import ProtectedRoute from './ProtectedRoute.jsx';

function ProtectedRouteWrapper(props){
  return(
    <ProtectedRoute>
      {props.children}
    </ProtectedRoute>
  )
}

export default ProtectedRouteWrapper;

// butuh fungsi pembungkus karena jika tidak, kode pada index.jsx akan bloated seperti berikut:
//
// <Route path="/" component={() => (<ProtectedRoute><Home/></ProtectedRoute>)} />
// <Route path="/copy-oxam" component={() => (<ProtectedRoute><CopyOxam/></ProtectedRoute>)}/>
// <Route path="/copy" component={() => (<ProtectedRoute><Copy/></ProtectedRoute>)}/>
//
// dengan menggunakan wrapper, sehingga route pada index.jsx akan menjadi ringkas seperti:
// <Route path="/" component={() => ProtectedRouteWrapper(Home)}/>
