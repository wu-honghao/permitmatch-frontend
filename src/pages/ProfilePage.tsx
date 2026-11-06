
import { useEffect, useState } from "react";
import type { FormProps } from "antd";
import {
  Alert,
  App,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { getAPI, putAPI } from "../api/api";
import { educationLevels } from "../constant/jobForm";

type ProfileFieldType = {
  needsPermit?: boolean;
  targetRole?: string;
  educationLevel?: string;
  yearsExperience?: number;
  skills?: string[];
  preferredLocation?: string;
};

function ProfilePage() {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [form] = Form.useForm<ProfileFieldType>();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const result = await getAPI({
          url: "/profile",
          headersOption: {
            isAuthorization: true,
          },
        });

        if (!active) return;

        const profile = result.data;

        // No existing profile: show an empty form.
        if (!profile || Object.keys(profile).length === 0) {
          form.resetFields();
          setIsNew(true);
        } else {
          form.setFieldsValue(profile);
          setIsNew(false);
        }
      } catch (error) {
        if (!active) return;

        console.error("Failed to load profile:", error);
        setLoadError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [form, retryCount]);

  const onFinish: FormProps<ProfileFieldType>["onFinish"] = async (
    values
  ) => {
    if (saving) return;

    setSaving(true);

    try {
      await putAPI({
        url: "/profile",
        headersOption: {
          isAuthorization: true,
        },
        data: values,
      });

      setIsNew(false);
      message.success(t("profilePageForm.update.success"));
    } catch (error) {
      console.error("Failed to save profile:", error);
      message.error(t("profilePageForm.update.fail"));
    } finally {
      setSaving(false);
    }
  };

  const educationSelectOptions = educationLevels.map((value) => ({
    value,
    label: t(`common.educationLevel.${value}`),
  }));

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert
        type="error"
        showIcon
        message={t("profilePage.loadFailed")}
        action={
          <Button
            size="small"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            {t("profilePage.retry")}
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ marginTop: 0 }}>
        {t("profilePage.title")}
      </h2>

      {isNew && (
        <Alert
          type="info"
          showIcon
          message={t("profilePage.completeTitle")}
          description={t("profilePage.completeDescription")}
          style={{ marginBottom: 24 }}
        />
      )}

      <Form<ProfileFieldType>
        name="profile"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t("profilePage.needsPermit")}
              name="needsPermit"
              rules={[
                {
                  required: true,
                  message: `${t("common.pleaseinput")}${t("profilePage.needsPermit")}`,
                },
              ]}
            >
              <Select
                options={[
                  {
                    value: true,
                    label: t("profilePageForm.needsPermit.yes"),
                  },
                  {
                    value: false,
                    label: t("profilePageForm.needsPermit.no"),
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={t("profilePage.targetRole")}
              name="targetRole"
              rules={[
                {
                  required: true,
                  message: `${t("common.pleaseinput")}${t("profilePage.targetRole")}`,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t("profilePage.educationLevel")}
              name="educationLevel"
              rules={[
                {
                  required: true,
                  message: `${t("common.pleaseinput")}${t("profilePage.educationLevel")}`,
                },
              ]}
            >
              <Select options={educationSelectOptions} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={t("profilePage.yearsExperience")}
              name="yearsExperience"
              rules={[
                {
                  required: true,
                  message: `${t("common.pleaseinput")}${t("profilePage.yearsExperience")}`,
                },
              ]}
            >
              <InputNumber
                min={0}
                precision={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t("profilePage.skills")}
              name="skills"
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message: `${t("common.pleaseinput")}${t("profilePage.skills")}`,
                },
              ]}
            >
              <Select
                mode="tags"
                placeholder={t("profilePage.skillsPlaceholder")}
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={t("profilePage.preferredLocation")}
              name="preferredLocation"
              rules={[
                {
                  required: true,
                  message: `${t("common.pleaseinput")}${t("profilePage.preferredLocation")}`,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
          >
            {t("common.submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ProfilePage;