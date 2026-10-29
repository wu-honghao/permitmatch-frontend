import { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Select, InputNumber, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { getAPI, putAPI } from '../api/api';

type ProfileFieldType = {
  needsPermit?: boolean
  targetRole?: string
  educationLevel?: string
  yearsExperience?: number
  skills?: string[]
  preferredLocation?: string
};

function ProfilePage () {
    const { t } = useTranslation()
    const { message } = App.useApp();

    const [form] = Form.useForm<ProfileFieldType>()
    
    useEffect(()=>{
        let active = true

        const loadProfile = async () => {
            const result = await getAPI({
                url: '/profile',
                headersOption: {
                    isAuthorization: true
                }
            })

            if(active){
                form.setFieldsValue(result.data)
            }
        }

        loadProfile()

        return () => {
            active = false
        }
    },[])

    const [saving, setSaving] = useState(false);
    const onFinish: FormProps<ProfileFieldType>['onFinish'] = async(values) => {
      if(saving){ return }

      setSaving(true)

      try{
        await putAPI({
          url: '/profile',
          headersOption: { isAuthorization: true },
          data: values
        })

        message.success(t('profilePageForm.update.success'));
      }
      catch(e){
        return message.error(t('profilePageForm.update.fail'));
      }
      finally{
        setSaving(false)
      }
    };

    const onFinishFailed: FormProps<ProfileFieldType>['onFinishFailed'] = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return <Form
    name="basic"
    form={form}
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<ProfileFieldType>
      label={t('profilePage.needsPermit')}
      name="needsPermit"
      rules={[{ required: true, message: 'Please input your needsPermit!' }]}
    >
        <Select
            options={[
                { value: true, label: t('profilePageForm.needsPermit.yes') },
                { value: false, label: t('profilePageForm.needsPermit.no') },
            ]}
        />
    </Form.Item>

    <Form.Item<ProfileFieldType>
      label={t('profilePage.targetRole')}
      name="targetRole"
      rules={[{ required: true, message: 'Please input your targetRole!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<ProfileFieldType>
      label={t('profilePage.educationLevel')}
      name="educationLevel"
      rules={[{ required: true, message: 'Please input your educationLevel!' }]}
    >
      <Select
            options={[
                { value: "high_school", label: t('profilePageForm.educationLevel.high_school') },
                { value: "diploma", label: t('profilePageForm.educationLevel.diploma') },
                { value: "bachelor", label: t('profilePageForm.educationLevel.bachelor') },
                { value: "master", label: t('profilePageForm.educationLevel.master') },
                { value: "phd", label: t('profilePageForm.educationLevel.phd') },
            ]}
        />
    </Form.Item>

    <Form.Item<ProfileFieldType>
      label={t('profilePage.yearsExperience')}
      name="yearsExperience"
      rules={[{ required: true, message: 'Please input your yearsExperience!' }]}
    >
      <InputNumber min={0} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item<ProfileFieldType>
      label={t('profilePage.skills')}
      name="skills"
      rules={[{ required: true, message: 'Please input your skills!' }]}
    >
      <Select
        mode="tags"
        placeholder="Enter skills"
        tokenSeparators={[',']}
    />
    </Form.Item>

    <Form.Item<ProfileFieldType>
      label={t('profilePage.preferredLocation')}
      name="preferredLocation"
      rules={[{ required: true, message: 'Please input your preferredLocation!' }]}
    >
      <Input/>
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit" loading={saving}>
        {t('common.submit')}
      </Button>
    </Form.Item>
  </Form>
}

export default ProfilePage;