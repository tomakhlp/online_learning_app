import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import {router} from "./router/Router.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import '../src/locales/i18n.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <RouterProvider router={router}/>
      </AuthProvider>
  </StrictMode>,
)
