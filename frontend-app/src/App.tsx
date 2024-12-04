import HomePage from "./pages/root/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/root/LoginPage.tsx";
import SignUpPage from "./pages/users/SignUpPage.tsx";

function App()
{
  return (
    <>
      <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path={"/signup"} element={<SignUpPage />}/>
      </Routes>
    </>
  )
}

export default App
