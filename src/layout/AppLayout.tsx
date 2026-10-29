import { useState } from 'react';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PicRightOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { authInitialState, saveUserData } from '../features/auth/authSlice';
import { USERTOKEN } from '../constant';
import './AppLayout.css';

const { Header, Sider, Content } = Layout;

function AppLayout(){
  // sider
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // menu init
  const navigate = useNavigate();
  const handleSelect = ({ key }: { key: string }) => {
    navigate(key)
  }

  const location = useLocation()
  const selectedKeys = [location.pathname];

  // header
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const logout = () => {
    dispatch(saveUserData(authInitialState.userData))
    localStorage.removeItem(USERTOKEN)
    navigate('/login')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <div className="app-logo">
          <span className="app-logo-icon">P</span>
          {!collapsed && <span>PermitMatch</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
          items={[
            { key: "/", icon: <HomeOutlined />, label: t('nav.dashboard') },
            { key: "/jobs", icon: <UnorderedListOutlined />, label: t('nav.myjobs') },
            { key: "/analyses", icon: <PicRightOutlined />, label: t('nav.myanalyses') },
            { key: "/profile", icon: <UserOutlined />, label: t('nav.myprofile') }
          ]}
        />
      </Sider>

      <Layout style={{ minWidth: 0 }}>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <div style={{ marginLeft: 'auto' }}>
            <LanguageSwitcher />
            <Button type="link" onClick={logout}>{t('nav.logout')}</Button>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minWidth: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;