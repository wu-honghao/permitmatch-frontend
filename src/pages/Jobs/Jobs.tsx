import { Alert, Button, Empty, Input, message, Popconfirm, Space, Table, Tag } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { deleteAPI, getAPI } from '../../api/api';
import { useEffect, useState } from 'react';
import type { JobListItem } from '../../types/job';

const { Title } = Typography;
import './index.css'
import dayjs from 'dayjs';
import { TIMEFORMAT } from '../../constant';
import { Link } from 'react-router';

function Jobs(){
    const { t } = useTranslation()
    
    const columns: TableProps<JobListItem>['columns'] = [
        {
            title: t('jobs.table.col1'),
            dataIndex: 'title', // title + company
            key: 'title',
            render: (text, record) => <div>
                {text}
                <span className='cell-sub'>{ record.company }</span>
            </div>,
        },
        {
            title: t('jobs.table.col2'),
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: t('jobs.table.col3'),
            key: 'skillScore',
            dataIndex: 'skillScore',
            render: (text, record) => <div>
                <span className='compact-score'>{ text != null ? `${text} / 100` : t('jobs.analyses.fail') }</span>
                <span className='cell-sub'>{ dayjs(record.updatedAt).format(TIMEFORMAT) }</span>
            </div>
        },
        {
            title: t('jobs.table.col4'),
            dataIndex: 'latestAnalysisId',
            render: (id: string | null) => (
                <Tag color={id ? 'green' : 'default'}>
                {id ? t('jobs.analyses.ok') : t('jobs.analyses.fail')}
                </Tag>
            )
        },
        {
            title: t('jobs.table.col5'),
            key: 'action',
            render: (_, record) => (
            <Space size="medium">
                <Link to={`/jobs/${record._id}`}>{t('jobs.table.button1')}</Link>
                <Link to={`/jobs/${record._id}/edit`}>{t('jobs.table.button2')}</Link>
                <Popconfirm
                    title={t('jobs.table.button3')}
                    description={ t('jobs.table.button3.description') + record.title }
                    onConfirm={() => confirm(record._id)}
                    onCancel={cancel}
                    okText={t('jobs.table.button3.yes')}
                    cancelText={t('jobs.table.button3.no')}
                >
                    <Button type="link" danger style={{ padding: 0 }}>
                        {t('jobs.table.button3')}
                    </Button>
                </Popconfirm>
            </Space>
            ),
        },
    ];

    const [jobList, setJobList] = useState<JobListItem[]>([]);

    const getJobList = async () => {
        try {
            setLoading(true)
            setError(false)

            const result = await getAPI({
                url: '/jobs',
                headersOption: {
                    isAuthorization: true
                }
            })

            setJobList(result.data)
        } catch(e){
            console.log(e)
            messageApi.error({
                content: t('common.loading.fail'),
                key: 'jobs-load-error',
            });
            setError(true)
            setJobList([])
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getJobList()
    },[])

    const [messageApi, holder] = message.useMessage();

    const confirm = async (id: string) => {
        try{
            const result = await deleteAPI({ url: `/jobs/${id}`, headersOption: { isAuthorization: true } })

            if(result.status === 204){
                messageApi.success(t('common.delete.success'));
            }

            await getJobList()
        }catch(e){
            messageApi.error(t('common.delete.fail'));
        }
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    return <div>
        {holder}

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
                <Title level={4} style={{ marginTop: 0 }}>{t("jobs.myjobsText")}</Title>
                <div style={{ marginBottom: "10px" }}>{t("jobs.myjobsDescription")}</div>
            </div>

            <Link to="/jobs/new" style={{ marginLeft: 'auto' }}>
                <Button type="primary">
                    {t('jobs.importJob')}
                </Button>
            </Link>
        </div>

        {/* <Input placeholder={t("jobs.searchInputPlacehold")} style={{ marginBottom: "10px" }}/> */}
        
        <Table<JobListItem> rowKey="_id" columns={columns} dataSource={jobList} loading={loading}
            locale={{
                emptyText: error
                ? <Alert type="error" message={t('common.loading.fail')} showIcon />
                : <Empty description={t('common.data.empty')} />
            }}
        />
    </div>
}

export default Jobs;