import { Progress } from "antd"
import type { SkillCoverage } from "../../types/analysis"
import "./index.css"

type SkillProgressProps = {
    title: string,
    skillCoverage: SkillCoverage
}

function SkillProgress (props: SkillProgressProps) {
    const { matched, total } = props.skillCoverage

    const coverage = Math.floor(matched / total * 100)

    return <div className="SkillProgress">
        <span className="muted">{ props.title }</span>
        <div className="coverage-number">{matched}<small> / {total}</small></div>
        <Progress percent={coverage} />
    </div>
}

export default SkillProgress