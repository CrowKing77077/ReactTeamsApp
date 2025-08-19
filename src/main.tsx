import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import App from "./App";
import { app } from "@microsoft/teams-js";

// MSAL imports
import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

async function initializeTeamsWithTimeout(
  timeoutMs = 1500
): Promise<{ inTeams: boolean; context?: unknown }> {
  function withTimeout<T>(promise: Promise<T>, ms: number) {
    return Promise.race<T>([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("teams-timeout")), ms)
      ) as Promise<T>,
    ]);
  }

  try {
    await withTimeout(app.initialize(), timeoutMs);
    const context = await withTimeout(app.getContext(), timeoutMs);
    return { inTeams: true, context };
  } catch {
    return { inTeams: false };
  }
}

(async () => {
  const [{ inTeams }, _] = await Promise.all([
    initializeTeamsWithTimeout(1500),
    msalInstance.initialize(),
  ]);

  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

  const RouterComponent = inTeams ? HashRouter : BrowserRouter;

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <RouterComponent>
      <ThemeProvider theme={theme}>
        <App pca={msalInstance} />
      </ThemeProvider>
    </RouterComponent>
  );

  if (inTeams) {
    try {
      app.notifySuccess();
    } catch {
      // no-op
    }
  }
})();
