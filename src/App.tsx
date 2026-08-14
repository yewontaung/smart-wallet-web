import { Route, Routes } from 'react-router-dom'
import './App.css'
import { MainLayout } from './pages/layouts/wallet-user/main.layout'
import { HomePage } from './pages/wallet-user/home'
import { SettingPage } from './pages/wallet-user/setting'

function App() {

  return (
    <Routes>
      <Route path='/wallet' element={<MainLayout />}>
        <Route index element={<HomePage />}/>
        <Route path='setting' element={<SettingPage />}/>
      </Route>
    </Routes>
  )
}

export default App
