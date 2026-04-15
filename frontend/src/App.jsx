import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import sign_up from './pages/sign_up'
import Login from './pages/Login'
import home from './pages/home'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element = {<login_page/>}></Route>
        <Route path='/login' element = {<login_page/>}></Route>
        <Route path ='/sign_up' element= {<sign_up/>}></Route>
      </Routes>
    </>
  )
}

export default App
