import { useParams } from "react-router"
import { getAPI } from "../../api/api"
import { useEffect, useState } from "react"
import type { Analysis } from "../../types/analysis"
import { Alert, Card, Empty, Flex, Spin, Tag } from "antd"
import { useTranslation } from "react-i18next"
import "./index.css"
import SkillProgress from "../../components/SkillProgress"
import { CoveredSkills, MissingSkills } from "../../components/SkillsShow"

function JobDetailAnalyses(){
    const { id } = useParams()
    const { t } = useTranslation()

    const [analyses, setAnalyses] = useState<Analysis | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getAnalyses = async () => {
        try {
            setLoading(true);
            setError(false);

            const result = await getAPI({ url: `/analyses/${id}`, headersOption: { isAuthorization: true } })

            setAnalyses(result.data)
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getAnalyses()
    },[id])

    if (loading) return <Spin />;
    if (error) {
        return <Alert type="error" message={t('common.loading.fail')} />;
    }
    if (!analyses) {
        return <Empty description={t('common.data.empty')} />;
    }

    const { coveredSkills: coveredSkillsRequired, missingSkills: missingSkillsRequired } = analyses.skillScoreResult.required
    const { coveredSkills: coveredSkillsPreferred, missingSkills: missingSkillsPreferred } = analyses.skillScoreResult.preferred

    const { scoreType, score } = analyses.skillScoreResult

    const reviewSkills = analyses.jobSnapshot.requirements.filter(
        item =>
            item.category === "review" ||
            item.operator === null ||
            item.skills.length === 0
    );

    return <div className="JobDetailAnalyses">
        {/*  */}
        <Card>
            <p className="eyebrow"> {t("jobDetailAnalyses.skillMatch")} </p>
            <p className="skill-hero score">
                {scoreType === "unavailable" || score == null ? (
                    <span>{t("jobDetailAnalyses.unavailable")}</span>
                ) : (
                    <>
                    {score}
                    <span className="score-unit">/100</span>
                    </>
                )}
            </p>
            <p> {t("jobDetailAnalyses.scoreDescription")} </p>
            <p className="smallhelp"> {t("jobDetailAnalyses.scoreDisclaimer")} </p>

            <div className="coverage-grid">
                <SkillProgress title={t("jobDetailAnalyses.requiredCoverage")} skillCoverage={analyses.skillScoreResult.required}/>
                <SkillProgress title={t("jobDetailAnalyses.preferredCoverage")} skillCoverage={analyses.skillScoreResult.preferred}/>
            </div>
        </Card>

        {/*  */}
        <Card style={{ marginTop: "20px" }}>
            <h2>{t("jobDetailAnalyses.matchedSkills")} </h2>
            <CoveredSkills skills={[...coveredSkillsRequired,...coveredSkillsPreferred]} ></CoveredSkills>
            <h2>{t("jobDetailAnalyses.missingSkills")} </h2>
            <h3>{t("jobDetailAnalyses.requiredSkills")} </h3>
            <MissingSkills skills={missingSkillsRequired} ></MissingSkills>
            <h3>{t("jobDetailAnalyses.preferredSkills")} </h3>
            <MissingSkills skills={missingSkillsPreferred} ></MissingSkills>
        </Card>

        <Card style={{ marginTop: "20px" }}>
            <h3>{t("jobDetailAnalyses.skillsNeedsReview")} </h3>

            {reviewSkills.length === 0 ? (
                <p>{t("jobDetailAnalyses.noReview")}</p>
                ) : (
                <Flex vertical gap={8}>
                    {reviewSkills.map((item, index) => (
                        <Tag key={index} color="warning">
                            {item.rawContent || t("jobRequirements.needsReview")}
                        </Tag>
                    ))}
                </Flex>
            )}
        </Card>

        <Card style={{ marginTop: "20px" }}>
            <h3>{t("jobDetailAnalyses.scoreDetails")}</h3>
            <p>{t("jobDetailAnalyses.scoreFormula")}</p>
            <p>{t("jobDetailAnalyses.scoreRules")}</p>
        </Card>
    </div>
}

export default JobDetailAnalyses