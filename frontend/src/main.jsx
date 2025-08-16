import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { PostProvider } from "./context/PostContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <NotificationProvider>
            <PostProvider>
              <ChakraProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </ChakraProvider>
            </PostProvider>
          </NotificationProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
