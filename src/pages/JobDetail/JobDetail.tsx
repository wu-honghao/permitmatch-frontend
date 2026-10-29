import { Alert, Button, Card, Collapse, Empty, message, Spin, Typography, type CollapseProps } from "antd"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router"
import "./index.css"
import { getAPI, postAPI } from "../../api/api";
import { useEffect, useState } from "react";
import type { Job } from "../../types/job";
import { formatSalary } from "../../utils/jobFormatters";
import JobRequirements from "../../components/JobRequirements";
import dayjs from "dayjs";
import { TIMEFORMAT } from "../../constant";

const panelStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  border: '1px solid #f0f0f0',
  borderRadius: 4,
  borderLeft: '3px solid #91caff',
  padding: '12px 16px',
  fontSize: 12,
  lineHeight: 1.8,
  marginTop: 10,
  color: "#64748b"
};

function JobDetail() {
    const { id } = useParams()
    const { t } = useTranslation()

    const [detail, setDetail] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [analysesLoading, setAnalysesLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    
    const getJobByid = async () => {
        try {
            setLoading(true);
            setError(false);

            const result = await getAPI({
                url: `/jobs/${id}`,
                headersOption: { isAuthorization: true }
            });

            setDetail(result.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        getJobByid()
    },[])

    if (loading) return <Spin />;
    if (error) return <Alert type="error" message={t('common.loading.fail')} />;
    if (!detail) return <Empty description={t('common.data.empty')}/>;

    const {
        title,
        company,
        location,
        salary,
        contract,
        educationRequirement,
        experienceRequirement,
        requirements,
        permitSupport,
        rawDescription,
        latestAnalysisId,
        createdAt
    } = detail;

    const salaryText = formatSalary(salary)

    const rawDescriptionItem: CollapseProps['items'] = [
        {
            key: '1',
            label: t('jobDetail.rawDescription'),
            children: <Typography.Paragraph
                style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8
                }}
                >
                {rawDescription}
            </Typography.Paragraph>,
            style: panelStyle
        },
    ];

    const startAnalyses = async () => {
        setAnalysesLoading(true)

        try{
            const result = await postAPI({
                url: `/jobs/${id}/analyses`,
                headersOption: {
                    isAuthorization: true
                }
            })

            message.success({
                content: t('common.analyses.success'),
                key: 'jobs-analyses-success',
            });

            navigate(`/jobs/${result.data._id}/analyses`)
        } catch(e){
            message.error({
                content: t('common.analyses.fail'),
                key: 'jobs-analyses-error',
            });
        } finally{
            setAnalysesLoading(false)
        }
    }

    return <div className="job-detail">
        {/*  */}

        <h1>{title}</h1>
        <p className="sub">{company} {`· ${location}`}</p>
        <div style={{ marginBottom: "20px" }}>
            <Button style={{ marginRight: "10px" }}>{t("jobDetail.editJob")}</Button>
            <Button loading={analysesLoading} onClick={startAnalyses} type="primary">{t("jobDetail.startAnalysis")}</Button>
        </div>
        <p className="sub">{t("jobDetail.analysisDescription")}</p>
        
        <Card>
            <h3 style={{ marginTop: 0 }}>{t("jobDetail.jobInfo")}</h3>

            <div className="job-detail_basic">
                <p>{t("jobDetail.minAnnualSalary")}: {salaryText}</p>
                {contract && (
                    <p>
                        {t("jobDetail.workHoursAndDuration")}: {contract.type || "-"}
                        {contract.durationMonths != null && ` · ${contract.durationMonths} months`}
                    </p>
                )}
                {experienceRequirement?.minYears != null && (
                    <p>
                        {t("jobDetail.yearsExperience")}: {experienceRequirement.minYears}
                    </p>
                )}
                <p>{t("jobDetail.educationRequirement")}: {educationRequirement?.level} {educationRequirement?.fieldOfStudy}</p>
            </div>
            
            <JobRequirements requirements={requirements}/>

            <Collapse ghost items={rawDescriptionItem} />
        </Card>

        {/*  */}
        <Card style={{ marginTop: "20px" }}>
            <h3 style={{ marginTop: 0 }}>{t("jobDetail.permitInfo")}</h3>

            <div>
                <p>{t("jobDetail.employerPermitSupport")}: {permitSupport?.status}</p>
                <p>{t("jobDetail.permitSupportHint")} </p>
            </div>
        </Card>

        {/*  */}
        <Card style={{ marginTop: "20px" }}>
            <h3 style={{ marginTop: 0 }}>{t("jobDetail.latestAnalysis")}</h3>

            <div>
                <p className="history-score">{t("jobDetail.skillMatch")}: </p>
                <p className="cell-sub">{dayjs(createdAt).format(TIMEFORMAT)} · {t("jobDetail.jobVersion")} </p>
                <Link to={`/jobs/${latestAnalysisId}/analyses`}>
                    <Button>{t("jobDetail.viewSnapshotAnalysis")}</Button>
                </Link>
                <Link to={`/analyses`}>
                    <Button style={{ marginLeft: "10px" }}>{t("jobDetail.allAnalysisHistory")}</Button>
                </Link>
            </div>
        </Card>
    </div>
}

export default JobDetail