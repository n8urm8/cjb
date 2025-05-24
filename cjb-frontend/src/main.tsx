import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { UserProfileProvider } from "./context/UserProfileContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

if (!domain || !clientId) {
  throw new Error(
    "Auth0 domain or client ID not set in environment variables."
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
        scope: "openid profile email read:jobs write:jobs",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <UserProfileProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </UserProfileProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </StrictMode>
);
