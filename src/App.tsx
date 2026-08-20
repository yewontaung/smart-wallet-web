import { Route, Routes } from 'react-router-dom'
import './App.css'
import { WalletLayout } from './pages/layouts/wallet-user/wallet.layout'
import { HomePage } from './pages/wallet-user/home'
import { SettingPage } from './pages/wallet-user/setting'
import { TopUpPage } from './pages/wallet-user/top-up'
import { SendPage } from './pages/wallet-user/send'
import { PayPage } from './pages/wallet-user/pay'
import { AuthProvider } from './contexts/auth-context'
import { WalletLoginPage } from './pages/auth/wallet-login'
import { AgentPage } from './pages/wallet-user/agent'
import { WalletRememberPage } from './pages/auth/wallet-remember'
import { WalletActionLayout } from './pages/layouts/wallet-user/action.layout'
import WalletTransactionDetailPage from './pages/wallet-user/transaction/detail'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/auth'>
          <Route path='wallet' element={<WalletLoginPage />} />
          <Route path='wallet/remember' element={<WalletRememberPage />} />
        </Route>
        <Route path='/wallet' element={<WalletLayout />}>
          <Route index element={<HomePage />} />
          <Route path='setting' element={<SettingPage />} />
          <Route path='agent' element={<AgentPage />} />
          <Route path='transaction'>
            <Route path=':trxId' element={<WalletTransactionDetailPage />} />
          </Route>
        </Route>
        <Route path='/action' element={<WalletActionLayout />}>
          <Route path='topup' element={<TopUpPage />} />
          <Route path='send' element={<SendPage />} />
          <Route path='pay' element={<PayPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
