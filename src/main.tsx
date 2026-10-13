import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'

import { ConfigProvider, DatePicker } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'

import { useTranslation } from 'react-i18next'

import Header from './layout/Header.tsx'
import store from './store/store.ts'
import ProfilePage from './pages/ProfilePage.tsx'
import Login from './pages/Login.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'

import './i18n'

function AppRoot() {
  const { i18n } = useTranslation()

  const antdLocale = i18n.language.startsWith('zh')
    ? zhCN
    : enUS

  return (
    <ConfigProvider locale={antdLocale}>
      <Provider store={store}>
        <BrowserRouter>
          <Header />

          {/* 临时测试 Ant Design 语言，验证完可以删除 */}
          <DatePicker />

          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
)