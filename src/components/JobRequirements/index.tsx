import { Card, Tag, Typography, Empty } from "antd";
import { useTranslation } from "react-i18next";
import type { Job } from "../../types/job";

const categories = ["required", "preferred", "review"] as const;

function JobRequirements({
  requirements
}: {
  requirements: Job["requirements"];
}) {
  const { t } = useTranslation();

  return (
    <Card title={t("jobRequirements.title")}>
      {!requirements?.length ? (
        <Empty description={t("jobRequirements.empty")} />
      ) : (
        categories.map(category => {
          const items = requirements.filter(
            item => item.category === category
          );

          if (!items.length) return null;

          return (
            <div key={category} style={{ marginBottom: 16 }}>
              <h4>{t(`jobRequirements.${category}`)}</h4>

              {items.map((item, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  {item.skills.map((skill, i) => (
                    <Tag key={i}>{skill}</Tag>
                  ))}

                  {item.skills.length === 0 && (
                    <Typography.Text type="secondary">
                      {item.rawContent || t("jobRequirements.needsReview")}
                    </Typography.Text>
                  )}

                  {item.skills.length > 1 && item.operator && (
                    <Tag color="blue">
                      {t(`jobRequirements.${item.operator}`)}
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          );
        })
      )}
    </Card>
  );
}

export default JobRequirements;