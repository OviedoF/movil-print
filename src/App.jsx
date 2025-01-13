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
      path: '/view/:name',
      element: <ViewDesign />
    }
  ])

  return (
    <React.StrictMode>
      <DataContext>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </DataContext>
    </React.StrictMode>
  )
}

export default App
