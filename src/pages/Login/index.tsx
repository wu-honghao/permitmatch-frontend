
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button, Card, Form, Input, Alert, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { USERTOKEN } from "../../constant";
import { postAPI } from "../../api/api";
import "./index.css";

const { Title, Text } = Typography;

type Login = {
  email: string;
  password: string;
};

function JobLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (values: Login) => {
    setLoading(true);
    setError(false);

    try {
      const res = await postAPI({
        url: "/auth/login",
        data: values,
      });

      localStorage.setItem(USERTOKEN, res.data.token);
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <section className="login-brand">
          <div className="login-logo">
            <span className="login-logo-icon">P</span>
            <span>PermitMatch</span>
          </div>

          <div className="login-brand-content">
            <div className="login-eyebrow">
              {t("login.eyebrow")}
            </div>

            <h1>{t("login.headline")}</h1>

            <p>{t("login.description")}</p>

            <div className="login-benefits">
              {[
                "login.benefit1",
                "login.benefit2",
                "login.benefit3",
              ].map((key) => (
                <div className="login-benefit" key={key}>
                  <CheckCircleOutlined />
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="login-brand-footer">
            {t("login.disclaimer")}
          </div>
        </section>

        <section className="login-form-section">
          <div className="login-mobile-logo">
            <span className="login-logo-icon">P</span>
            <span>PermitMatch</span>
          </div>

          <Card className="login-card" variant="borderless">
            <Title level={2} className="login-title">
              {t("login.welcome")}
            </Title>

            <Text type="secondary" className="login-subtitle">
              {t("login.subtitle")}
            </Text>

            {error && (
              <Alert
                type="error"
                showIcon
                message={t("login.invalidCredentials")}
                className="login-error"
              />
            )}

            <Form<Login>
              layout="vertical"
              onFinish={submit}
              requiredMark={false}
              size="large"
              autoComplete="on"
            >
              <Form.Item
                name="email"
                label={t("login.email")}
                rules={[
                  {
                    required: true,
                    message: t("login.emailRequired"),
                  },
                  {
                    type: "email",
                    message: t("login.emailInvalid"),
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t("login.password")}
                rules={[
                  {
                    required: true,
                    message: t("login.passwordRequired"),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("login.passwordPlaceholder")}
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item className="login-submit-item">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<LoginOutlined />}
                >
                  {t("login.signIn")}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-register">
              <Text type="secondary">
                {t("login.noAccount")}{" "}
              </Text>
              <Link to="/register">{t("login.signUp")}</Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default JobLogin;
