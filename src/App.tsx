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
import BusinessRequestListPage from './pages/manager/business-requests/business-request-list'
import ManagerListPage from './pages/manager/managers/manager-list'

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Authentication */}
        <Route path='/auth'>
          <Route path='wallet' element={<WalletLoginPage />} />
          <Route path='wallet/remember' element={<WalletRememberPage />} />
          <Route path='manager' element={<ManagerLoginPage />} />
        </Route>

        {/* Wallet */}
        <Route path='/wallet' element={<WalletLayout />}>
          <Route index element={<HomePage />} />
          <Route path='setting' element={<SettingPage />} />
          <Route path='agent' element={<AgentPage />} />

          <Route path='transaction'>
            <Route
              path=':trxId'
              element={<WalletTransactionDetailPage />}
            />
          </Route>
        </Route>

        {/* Wallet Actions */}
        <Route path='/action' element={<WalletActionLayout />}>
          <Route path='topup' element={<TopUpPage />} />
          <Route path='send' element={<SendPage />} />
          <Route path='pay' element={<PayPage />} />
        </Route>

        {/* Manager */}
        <Route path='/manager' element={<ManagerLayout />}>

          {/* Dashboard */}
          <Route
            path='dashboard'
            element={<DashboardPage />}
          />

          {/* Accounts */}
          <Route path='accounts'>
            <Route
              index
              element={<AccountListPage />}
            />

            <Route
              path=':accountId'
              element={<AccountDetailPage />}
            />
          </Route>

          {/* Businesses */}
          <Route path='businesses'>
            <Route
              index
              element={<BusinessListPage />}
            />
          </Route>

          {/* Business Requests */}
          <Route path='business-requests'>
            <Route
              index
              element={<BusinessRequestListPage />}
            />
          </Route>

          {/* Managers */}
          <Route path='managers'>
            <Route
              index
              element={<ManagerListPage />}
            />
          </Route>

        </Route>

      </Routes>
    </AuthProvider>
  )
}

export default App