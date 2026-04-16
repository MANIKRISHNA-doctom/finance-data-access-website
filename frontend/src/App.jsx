import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/home'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element = {<Login/>}></Route>
        <Route path='/home' element = {<Home/>}></Route>
        <Route path ='/sign_up' element= {<SignUp/>}></Route>
      </Routes>
    </>
  )
}

export default App
