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
import ManagerLoginPage from './pages/auth/manager-login'
import ManagerLayout from './pages/layouts/manager/manager.layout'
import DashboardPage from './pages/manager/dashboard'
import AccountDetailPage from './pages/manager/accounts/account-detail'
import AccountListPage from './pages/manager/accounts/account-list'
import BusinessListPage from './pages/manager/businesses/business-list'
import WalletRoot from './pages/layouts/wallet-user/wallet.root'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/auth'>
          <Route path='wallet' element={<WalletLoginPage />} />
          <Route path='wallet/remember' element={<WalletRememberPage />} />
          <Route path='manager' element={<ManagerLoginPage />} />
        </Route>
        <Route element={<WalletRoot />}>
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
        </Route>
        <Route path='/manager' element={<ManagerLayout />}>
          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='accounts'>
            <Route index element={<AccountListPage />} />
            <Route path=':accountId' element={<AccountDetailPage />} />
          </Route>
          <Route path='businesses'>
            <Route index element={<BusinessListPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
