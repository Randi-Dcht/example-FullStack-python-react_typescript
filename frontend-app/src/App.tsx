import HomePage from "./pages/root/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/root/LoginPage.tsx";

function App()
{
  return (
    <>
      <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/login" element={<LoginPage />}/>
      </Routes>
    </>
  )
}

export default App
