import { Alert, Empty, Table } from 'antd';
import type { TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { getAPI } from '../../api/api';
import { useEffect, useState } from 'react';

interface DataType {
  skills: string[];
  requiredCount: number;
  preferredCount: number;
  totalCount: number;
}

function SkillGaps(){
    const { t } = useTranslation();

    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    
    const getSkillsGap = async () => {
        try{
            setLoading(true)
            const result = await getAPI({ url: "/skillsGap", headersOption: { isAuthorization: true } })

            setData(result.data.gaps)
        }catch(e){
            console.log(e)
            setError(true)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{ getSkillsGap() },[])
    
    const columns: TableProps<DataType>['columns'] = [
        {
            title: t("skillsgap.skills"),
            dataIndex: 'skills',
            key: 'skills',
            render: (text)=>(text.join(' OR '))
        },
        {
            title: t("skillsgap.requiredCount"),
            dataIndex: 'requiredCount',
            key: 'requiredCount',
        },
        {
            title: t("skillsgap.preferredCount"),
            dataIndex: 'preferredCount',
            key: 'preferredCount',
        },
        {
            title: t("skillsgap.totalCount"),
            dataIndex: 'totalCount',
            key: 'totalCount',
        },
    ];

    return <div>
        <h2 style={{ marginTop: 0, marginBottom: "5px" }}>{t("skillsgap.title")}</h2>
        <div style={{ marginBottom: "10px" }}>{ t("skillsgap.description") }</div>
        <Table<DataType> rowKey={(record) => JSON.stringify(record.skills)} columns={columns} dataSource={data} loading={loading}             
            locale={{
                emptyText: error
                ? <Alert type="error" message={t('common.loading.fail')} showIcon />
                : <Empty description={t('common.data.empty')} />
            }}/>
    </div>
}

export default SkillGaps;