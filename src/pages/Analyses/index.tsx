import { Alert, Empty, message, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getAPI } from '../../api/api';
import { useEffect, useState } from 'react';

const { Title } = Typography;
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { TIMEFORMAT } from '../../constant';
import type { AnalysisListItem } from '../../types/analysis';

function Analyses(){
    const { t } = useTranslation()
    
    const columns: TableProps<AnalysisListItem>['columns'] = [
        {
            title: t('Analyses.analysisDateAndSnapshot'),
            dataIndex: 'jobSnapshot', // title + company
            key: 'jobSnapshot',
            render: (text) => <div>
                { text.title }
                <span className='cell-sub'>{ text.company }</span>
            </div>,
        },
        {
            title: t('Analyses.skillScore'),
            dataIndex: 'skillScoreResult',
            key: 'skillScoreResult',
            render: (text, record) => <div>
                <span className='compact-score'>{ text.score != null ? `${text.score} / 100` : t('jobs.analyses.fail') }</span>
                <span className='cell-sub'>{ dayjs(record.createdAt).format(TIMEFORMAT) }</span>
            </div>
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="medium">
                    <Link to={`/analyses/${record._id}`}>{t('Analyses.viewFullResult')}</Link>
                    
                    {
                        record.jobExists && <Link to={`/jobs/${record.jobId}`}>{t('Analyses.currentJob')}</Link>
                    }
                </Space>
            ),
        },
    ];

    const [AnalysesList, setAnalysesList] = useState<AnalysisListItem[]>([]);

    const getAnalysesList = async () => {
        try {
            setLoading(true)
            setError(false)

            const result = await getAPI({
                url: '/analyses',
                headersOption: {
                    isAuthorization: true
                }
            })

            setAnalysesList(result.data)
        } catch(e){
            console.log(e)
            messageApi.error({
                content: t('common.loading.fail'),
                key: 'Analysess-load-error',
            });
            setError(true)
            setAnalysesList([])
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getAnalysesList()
    },[])

    const [messageApi, holder] = message.useMessage();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    return <div>
        {holder}

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
                <Title level={4} style={{ marginTop: 0 }}>{t("Analyses.title")}</Title>
                <div style={{ marginBottom: "10px" }}>{t("Analyses.description")}</div>
            </div>
        </div>

        <Table<AnalysisListItem> rowKey="_id" columns={columns} dataSource={AnalysesList} loading={loading}
            locale={{
                emptyText: error
                ? <Alert type="error" message={t('common.loading.fail')} showIcon />
                : <Empty description={t('common.data.empty')} />
            }}
        />
    </div>
}

export default Analyses;