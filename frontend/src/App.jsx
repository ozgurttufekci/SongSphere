import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Outlet, Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import SimilarSongsPage from './pages/SimilarSongsPage';
import SmartPlayListPage from './pages/SmartPlaylistPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SimilarSongsPage />,
    errorElement: <ErrorPage />,
    // loader: null,
    // children: [
    //   {
    //     path: "songs/:songId",
    //     element: <Songs />,
    //   },
    // ],
  },
  {
    path: "smart-playlist",
    element: <SmartPlayListPage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App
