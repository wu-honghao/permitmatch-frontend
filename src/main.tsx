import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'

import { ConfigProvider } from 'antd'
import { App as AntdApp } from 'antd';
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'

import { useTranslation } from 'react-i18next'

import store from './store/store.ts'
import ProfilePage from './pages/ProfilePage.tsx'
import Login from './pages/Login.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'

import './i18n'
import AppLayout from './layout/AppLayout.tsx'

import './index.css';
import Jobs from './pages/Jobs/Jobs.tsx'
import Dashboard from './pages/Dashboard.tsx'
import JobDetail from './pages/JobDetail/JobDetail.tsx'
import JobEdit from './pages/Jobs/JobEdit.tsx'
import JobNew from './pages/Jobs/JobNew.tsx'
import JobDetailAnalyses from './pages/JobDetailAnalyses/JobDetailAnalyses.tsx'
import Analyses from './pages/Analyses/index.tsx'

function AppRoot() {
  const { i18n } = useTranslation()

  const antdLocale = i18n.language.startsWith('zh')
    ? zhCN
    : enUS

  return (
    <AntdApp>
      <ConfigProvider locale={antdLocale}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/jobs/:id/analyses" element={<JobDetailAnalyses />} />
                <Route path="/jobs/:id/edit" element={<JobEdit />} />
                <Route path="/jobs/new" element={<JobNew />} />
                <Route path="/analyses" element={<Analyses />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
   </AntdApp>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
)