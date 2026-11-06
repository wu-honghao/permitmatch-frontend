import { Alert, Empty, message, Spin } from "antd"
import { getAPI, patchAPI } from "../../api/api"
import type { Job, JobFormValues } from "../../types/job"
import JobForm from "./Form/JobForm"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import _ from "lodash";

const buildPatch = (originJob: Job, initialValues: JobFormValues, values: JobFormValues) => {
    const patch: Record<string, unknown> = {};

    for(const key of Object.keys(values) as (keyof JobFormValues)[]){
        if (key === "checked") continue;

        if (_.isEqual(initialValues[key], values[key])) continue;

        if (key === "requirements") {
            const normalize = (items: JobFormValues["requirements"]) =>
                (items ?? []).map(({ category, operator, skills }) => ({
                    category,
                    operator,
                    skills
                }));

            if (!_.isEqual(
                normalize(initialValues.requirements),
                normalize(values.requirements)
            )) {
                patch.requirements = values.requirements ?? [];
            }

            continue;
        }

        if (["salary", "contract", "experienceRequirement",
            "educationRequirement", "permitSupport"].includes(key)) {
            patch[key] = _.merge({}, originJob[key], values[key]);
        } else {
            patch[key] = values[key];
        }
    }

    return patch;
}

function JobEdit () {
    const { id } = useParams()
    const { t } = useTranslation()
    
    const [initJob, setInitJob] = useState<JobFormValues | null>(null)
    const [originJob, setOriginJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const getData = async () =>  {
        try {
            setLoading(true);
            setError(false);

            const { data: job } = await getAPI({
                url: `/jobs/${id}`,
                headersOption: { isAuthorization: true }
            });

            setOriginJob(job)

            const initialValues: JobFormValues = {
                title: job.title,
                company: job.company ?? undefined,
                location: job.location ?? undefined,
                rawDescription: job.rawDescription ?? undefined,

                salary: {
                    min: job.salary?.min ?? undefined
                },
                contract: {
                    durationMonths: job.contract?.durationMonths ?? undefined
                },
                experienceRequirement: {
                    minYears: job.experienceRequirement?.minYears ?? undefined,
                    scope: job.experienceRequirement?.scope ?? undefined
                },
                educationRequirement: {
                    level: job.educationRequirement?.level ?? undefined
                },
                permitSupport: {
                    status: job.permitSupport?.status ?? "unknown"
                },
                requirements: job.requirements?.map(item => ({
                    category: item.category,
                    operator: item.operator,
                    skills: item.skills,
                    rawContent: item.rawContent
                })) ?? []
            };

            setInitJob(initialValues)
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void getData();
    }, [id]);

    const navigate = useNavigate();

    const handleSubmit = async (values: JobFormValues) => {
        if (!originJob || !initJob) return;
        const patch = buildPatch(originJob, initJob, values)
        
        if(Object.keys(patch).length === 0){
            return message.info(`${t("common.submit.empty")}`)
        }

        try{
            await patchAPI({ url: `/jobs/${id}`, data: patch, headersOption: { isAuthorization: true }})
            
            message.success(`${t("common.submit.success")}`)

            navigate(`/jobs/${id}`);
        }catch(e){
            console.log(e)

            message.error(`${t("common.submit.fail")}`)
        }
    }

    if (loading) return <Spin />;
    if (error) {
        return <Alert type="error" message={t("common.loading.fail")} />;
    }
    if (!initJob) return <Empty />;

    return <div>
        <JobForm onSubmit={handleSubmit} initialValues={initJob} loading={loading}/>
    </div>
}

export default JobEdit