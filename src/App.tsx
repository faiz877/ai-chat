import Auth from "./components/Auth";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useEffect } from "react";
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <>
      <Toaster />
      {isAuthenticated ? <Dashboard /> : <Auth />}
    </>
  );
}

export default App;
