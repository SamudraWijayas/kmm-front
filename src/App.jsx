import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; // ✅ Import router dari folder routes
import { DarkModeProvider } from "./context/DarkModeContext"; // Import provider

function App() {
  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  );
}

export default App;
