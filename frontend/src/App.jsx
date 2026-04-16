import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/home'
import Delete_record from './pages/Delete_record'
import CreateRecord from './pages/CreateRecord'
import AddUser from './pages/AddUser'
import DeleteUser from './pages/DeleteUser'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element = {<Login/>}></Route>
        <Route path='/home' element = {<Home/>}></Route>
        <Route path ='/sign_up' element= {<SignUp/>}></Route>
        <Route path='/delete_record' element= {<Delete_record/>}></Route>
        <Route path='/create_record' element= {<CreateRecord/>}></Route>
        <Route path='/add_user' element= {<AddUser/>}></Route>
        <Route path='/delete_user' element= {<DeleteUser/>}></Route>
      </Routes>
    </>
  )
}

export default App
