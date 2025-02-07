import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TemplateSelect from './pages/TemplateSelect'
import DataContext from "./context/data.context"
import Editor from './pages/Editor'
import LoginPage from './pages/LoginPage'
import TemplateManager from './pages/TemplateManager'
import ViewDesign from './pages/ViewDesign'
import { SnackbarProvider } from 'notistack'
import DisableZoom from './utils/DisableZoom'
import Designs from './pages/Designs'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <TemplateSelect />
    },
    {
      path: '/editor/:name',
      element: <Editor />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/manage-templates',
      element: <TemplateManager />
    },
    {
      path: '/design/:id',
      element: <ViewDesign />
    },
    {
      path: '/designs',
      element: <Designs />
    }
  ])

  return (
    <React.StrictMode>
      <DataContext>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </DataContext>

      <DisableZoom />
    </React.StrictMode>
  )
}

export default App
