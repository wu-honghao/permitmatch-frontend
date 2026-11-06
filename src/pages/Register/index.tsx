
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Typography,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import "../Login/index.css";
import { postAPI } from "../../api/api";

const { Title, Text } = Typography;

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

function JobRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(false);

    try {
      await postAPI({
        url: "/auth/register",
        data: {
          email: values.email,
          password: values.password,
        },
      });

      // Register success → Sign in
      navigate("/login", { replace: true });
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

        {/* Left branding panel */}
        <section className="login-brand">
          <div className="login-logo">
            <span className="login-logo-icon">P</span>
            <span>PermitMatch</span>
          </div>

          <div className="login-brand-content">
            <div className="login-eyebrow">
              {t("register.eyebrow")}
            </div>

            <h1>{t("register.headline")}</h1>

            <p>{t("register.description")}</p>

            <div className="login-benefits">
              {[
                "register.benefit1",
                "register.benefit2",
                "register.benefit3",
              ].map((key) => (
                <div className="login-benefit" key={key}>
                  <CheckCircleOutlined />
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="login-brand-footer">
            {t("register.disclaimer")}
          </div>
        </section>

        {/* Right registration form */}
        <section className="login-form-section">
          <div className="login-mobile-logo">
            <span className="login-logo-icon">P</span>
            <span>PermitMatch</span>
          </div>

          <Card className="login-card" variant="borderless">
            <Title level={2} className="login-title">
              {t("register.title")}
            </Title>

            <Text type="secondary" className="login-subtitle">
              {t("register.subtitle")}
            </Text>

            {error && (
              <Alert
                type="error"
                showIcon
                message={t("register.failed")}
                className="login-error"
              />
            )}

            <Form<RegisterFormValues>
              layout="vertical"
              onFinish={submit}
              requiredMark={false}
              size="large"
              autoComplete="on"
            >
              <Form.Item
                label={t("register.email")}
                name="email"
                rules={[
                  {
                    required: true,
                    message: t("register.emailRequired"),
                  },
                  {
                    type: "email",
                    message: t("register.emailInvalid"),
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
                label={t("register.password")}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("register.passwordRequired"),
                  },
                  {
                    min: 8,
                    message: t("register.passwordMin"),
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("register.passwordPlaceholder")}
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                label={t("register.confirmPassword")}
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t("register.confirmRequired"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue("password") === value
                      ) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(t("register.passwordMismatch"))
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("register.confirmPlaceholder")}
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item className="login-submit-item">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<UserAddOutlined />}
                >
                  {t("register.createAccount")}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-register">
              <Text type="secondary">
                {t("register.hasAccount")}{" "}
              </Text>
              <Link to="/login">
                {t("register.signIn")}
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default JobRegister;