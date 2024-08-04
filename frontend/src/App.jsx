import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DashBoard } from './modules/dashboard/pages/DashBoard'
import './App.css';

const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <DashBoard/>
    </div>
  )
}

export default App