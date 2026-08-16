import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import ProductProvider from "./context/ProductContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { ActivityProvider } from "./context/ActivityContext.jsx";
import SidebarProvider from "./context/SidebarContext.jsx";
import CurrencyProvider from "./context/CurrencyContext.jsx";
import LanguageProvider from "./context/LanguageContext.jsx";
import AccentProvider from "./context/AccentContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import ProfileProvider from "./context/ProfileContext.jsx";
import SearchProvider from "./context/SearchContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ActivityProvider>
          <ThemeProvider>
            <ProfileProvider>
              <AccentProvider>
                <LanguageProvider>
                  <CurrencyProvider>
                    <SearchProvider>
                      <ProductProvider>
                        <SidebarProvider>
                          <RouterProvider router={router} />

                          <Toaster
                            position="top-right"
                            reverseOrder={false}
                            toastOptions={{
                              duration: 3000,
                            }}
                          />
                        </SidebarProvider>
                      </ProductProvider>
                    </SearchProvider>
                  </CurrencyProvider>
                </LanguageProvider>
              </AccentProvider>
            </ProfileProvider>
          </ThemeProvider>
        </ActivityProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
);
