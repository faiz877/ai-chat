import Auth from "./components/Auth";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";
import { useAuthStore } from "./store/authStore";
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <>
      <Toaster />
      {isAuthenticated ? <Dashboard /> : <Auth />}
    </>
  );
}

export default App;
