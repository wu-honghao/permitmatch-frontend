import type { FormProps } from 'antd';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { educationLevels, permitSupport, requirementCategory, requirementOperator } from '../../../constant/jobForm';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { JobFormValues } from '../../../types/job';
import { useEffect } from 'react';

type JobFormProps = {
  initialValues?: JobFormValues;
  loading?: boolean;
  onSubmit: (values: JobFormValues) => Promise<void>;
};

function JobForm({ initialValues, loading, onSubmit }: JobFormProps) {
    const { t } = useTranslation()

    const educationSelectOptions = educationLevels.map((value) => ({
        value,
        label: t(`common.educationLevel.${value}`),
    }));

    const permitSupportSelectOptions = permitSupport.map((value) => ({
        value,
        label: t(`common.permitsupport.${value}`),
    }));

    const requirementCategoryOption = requirementCategory.map((value) => ({
        value,
        label: t(`jobForm.category.${value}`),
    }));

    const requirementOperatorOption = requirementOperator.map((value) => ({
        value,
        label: t(`jobForm.operator.${value}`),
    }));

    const [form] = Form.useForm();
    const requirements = Form.useWatch("requirements", form) ?? [];

    const onFinish: FormProps<JobFormValues>["onFinish"] = (
        values
    ) => {
        const { checked, ...jobData } = values;

        onSubmit(jobData);
    };

    const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    return <Form
        form={form}
        initialValues={initialValues}
        name="basic"
        colon={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
    >
        <Row>
            <Col span={24}>
                <Form.Item
                    label={t("jobForm.rawDescription")}
                    name="rawDescription"
                >
                    <Input.TextArea />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.jobTitle")}
                    name="title"
                    rules={[{ required: true, message: `${t('common.pleaseinput')}${t('jobForm.jobTitle')}` }]}
                    >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.company")}
                    name="company"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.location")}
                    name="location"
                    >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.minAnnualSalary")}
                    name={["salary", "min"]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.offerDurationMonths")}
                    name={["contract", "durationMonths"]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label={t("jobForm.minYearsExperience")}
                    name={["experienceRequirement", "minYears"]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.experienceRange")}
                    name={["experienceRequirement", "scope"]}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label={t("jobForm.educationRequirement")}
                    name={["educationRequirement", "level"]}
                >
                    <Select options={educationSelectOptions} />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    label={t("jobForm.employerPermitSupport")}
                    name={["permitSupport", "status"]}
                >
                    <Select options={permitSupportSelectOptions} />
                </Form.Item>
            </Col>
        </Row>

        <p className='muted small help'>{t('jobForm.permitSupportHint')}</p>

        <h3>{t("jobForm.skillRequirementGroups")}</h3>
        <Form.List name="requirements">
            {(fields, { add, remove }) => (
                <>
                {fields.map(({ key, name, ...restField }) => {
                    const isReview = requirements[name]?.category === "review";

                    return  <Row gutter={16} key={key}>
                        <Col span={8}>
                            <Form.Item
                                {...restField}
                                label={t("jobForm.category")}
                                name={[name, 'category']}
                                rules={[
                                    {
                                        required: true,
                                        message: `${t('common.pleaseinput')}${t('jobForm.category')}`
                                    }
                                ]}
                            >
                                <Select options={requirementCategoryOption} onChange={() => {
                                    void form.validateFields([
                                    ["requirements", name, "operator"],
                                    ["requirements", name, "skills"]
                                    ]).catch(() => {});
                                }}/>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                {...restField}
                                label={t("jobForm.operator")}
                                name={[name, 'operator']}
                                rules={[
                                    {
                                        required: !isReview,
                                        message: `${t('common.pleaseinput')}${t('jobForm.category')}`
                                    }
                                ]}
                            >
                                <Select options={requirementOperatorOption} />
                            </Form.Item>
                        </Col>

                        <Col span={7}>
                            <Form.Item
                                {...restField}
                                label={t("jobForm.skills")}
                                name={[name, 'skills']}
                                rules={[
                                    {
                                        validator: async (_, value: string[]) => {
                                            if (!isReview && (!value || value.length === 0)) {
                                                throw new Error(`${t('common.pleaseinput')}${t('jobForm.skills')}`);
                                            }
                                        }
                                    }
                                ]}
                            >
                            <Select
                                mode="tags"
                                tokenSeparators={[',']}
                            />
                            </Form.Item>
                        </Col>

                        <Form.Item name={[name, "rawContent"]} hidden>
                            <Input />
                        </Form.Item>

                        <MinusCircleOutlined onClick={() => remove(name)} />
                    </Row>
                })}

                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        {t('jobForm.addGroup')}
                    </Button>
                </Form.Item>
                </>
            )}
        </Form.List>


        <Form.Item name="checked" valuePropName="checked" label={null}>
            <Checkbox>{t('jobForm.confirmation')}</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={loading}>
                {t("jobForm.saveJob")}
            </Button>
        </Form.Item>
    </Form>
}

export default JobForm;