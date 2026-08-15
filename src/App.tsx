import { Route, Routes } from 'react-router-dom'
import './App.css'
import { MainLayout } from './pages/layouts/wallet-user/main.layout'
import { HomePage } from './pages/wallet-user/home'
import { SettingPage } from './pages/wallet-user/setting'
import { TopUpPage } from './pages/wallet-user/top-up'
import { SendPage } from './pages/wallet-user/send'
import { PayPage } from './pages/wallet-user/pay'
import { AuthProvider } from './contexts/auth-context'
import { WalletLoginPage } from './pages/auth/wallet-login'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/auth'>
          <Route path='wallet' element={<WalletLoginPage />} />
        </Route>
        <Route path='/wallet' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='setting' element={<SettingPage />} />
        </Route>
        <Route path='/topup' element={<TopUpPage />} />
        <Route path='/send' element={<SendPage />} />
        <Route path='/pay' element={<PayPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
