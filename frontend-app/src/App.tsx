import HomePage from "./pages/root/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/root/LoginPage.tsx";
import SignUpPage from "./pages/users/SignUpPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import UserPage from "./pages/users/UserPage.tsx";
import WorkerPage from "./pages/workers/WorkerPage.tsx";

function App()
{
  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path={"/signup"} element={<SignUpPage />}/>

          <Route path={"/admin"} element={<AdminPage/>}/>
          <Route path={"/customer"} element={<UserPage/>}/>
          <Route path={"/worker"} element={<WorkerPage/>}/>
      </Routes>
    </>
  )
}

export default App
