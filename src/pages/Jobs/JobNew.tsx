
import { Button, Input, message, Space } from "antd";
import { ApiError, postAPI, type ApiResponse } from "../../api/api";
import type { Job, JobFormValues } from "../../types/job";
import JobForm from "./Form/JobForm";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { mapFormToJobPayload } from "../../utils/jobFormatters";
import { useRef, useState } from "react";

function JobNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [rawDescription, setRawDescription] = useState("");
  const [draft, setDraft] = useState<JobFormValues | null>(null);

  const submittingRef = useRef(false);

  const handleExtract = async () => {
    if (!rawDescription.trim()) {
      message.warning(t("jobs.enterDescription"));
      return;
    }

    setExtracting(true);

    try {
      const result = await postAPI<ApiResponse<JobFormValues>>({
        url: "/jobs/extract",
        data: { rawDescription },
        headersOption: { isAuthorization: true },
        timeout: 25000,
      });

      const extracted = result.data;

      setDraft(extracted);

      message.success(t("jobs.extractSuccess"));
    } catch (error) {
        if (error instanceof ApiError) {
          const supportedStatus = [400, 401, 429, 502, 503, 504];

          const key = supportedStatus.includes(error.status)
            ? String(error.status)
            : "default";

          message.error(t(`aiError.${key}`));
        } else if (error instanceof Error && error.name === "TimeoutError") {
          message.error(t("aiError.504"));
        } else {
          message.error(t("aiError.default"));
        }
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (values: JobFormValues) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    
    try {
      setLoading(true);

      const payload = mapFormToJobPayload(values);

      const result = await postAPI<ApiResponse<Job>>({
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
      submittingRef.current = false;
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
