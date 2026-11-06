
import { Button, Input, message, Space } from "antd";
import { postAPI } from "../../api/api";
import type { JobFormValues } from "../../types/job";
import JobForm from "./Form/JobForm";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { cleanJobData } from "../../utils/jobFormatters";
import { useState } from "react";

function JobNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [rawDescription, setRawDescription] = useState("");
  const [draft, setDraft] = useState<JobFormValues | null>(null);

  const handleExtract = async () => {
    if (!rawDescription.trim()) {
      message.warning(t("jobs.enterDescription"));
      return;
    }

    setExtracting(true);

    try {
      const result = await postAPI({
        url: "/jobs/extract",
        data: { rawDescription },
        headersOption: { isAuthorization: true },
      });

      const extracted = result.data;

      // Convert null text fields to empty strings for JobForm.
      setDraft({
        ...extracted,
        title: extracted.title ?? "",
        company: extracted.company ?? undefined,
        location: extracted.location ?? undefined,
        rawDescription,
      });

      message.success(t("jobs.extractSuccess"));
    } catch (error) {
      console.error(error);
      message.error(t("jobs.extractFailed"));
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (values: JobFormValues) => {
    try {
      setLoading(true);

      const payload = cleanJobData(values);

      const result = await postAPI({
        url: "/jobs",
        data: payload,
        headersOption: { isAuthorization: true },
      });

      message.success(t("common.submit.success"));
      navigate(`/jobs/${result.data._id}`);
    } catch (error) {
      console.error(error);
      message.error(t("common.submit.fail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h2>{t("jobs.importTitle")}</h2>

      <p className="muted">
        {t("jobs.importDescription")}
      </p>

      <Input.TextArea
        rows={8}
        value={rawDescription}
        onChange={(event) =>
          setRawDescription(event.target.value)
        }
        placeholder={t("jobs.pasteDescription")}
        style={{ marginBottom: 12 }}
      />

      <Space style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          onClick={handleExtract}
          loading={extracting}
          disabled={loading}
        >
          {t("jobs.extractWithAI")}
        </Button>

        <Button
          onClick={() => navigate("/jobs")}
          disabled={extracting}
        >
          {t("jobs.backToJobs")}
        </Button>
      </Space>

      {draft && (
        <>
          <p className="muted">
            {t("jobs.reviewExtracted")}
          </p>

          <JobForm
            key={rawDescription}
            initialValues={draft}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

export default JobNew;
