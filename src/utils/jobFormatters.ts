import type { JobFormValues } from "../types/job";

type Salary = {
  min: number | null;
  max: number | null;
  currency: string | null;
  period: "hour" | "month" | "year" | null;
  rawContent: string | null;
};

export function formatSalary(salary: Salary | null): string {
  if (!salary) return "-";

  const { min, max, currency, period, rawContent } = salary;

  // 没有结构化金额时，优先使用原文
  if (min == null && max == null) {
    return rawContent?.trim() || "-";
  }

  const formatter = new Intl.NumberFormat("en-IE", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  const symbol = currency === "EUR"
    ? "€"
    : currency === "USD"
      ? "$"
      : currency
        ? `${currency} `
        : "";

  let amount = "";

  if (min != null && max != null) {
    amount = `${formatter.format(min)}–${formatter.format(max)}`;
  } else if (min != null) {
    amount = `${formatter.format(min)}+`;
  } else if (max != null) {
    amount = `Up to ${formatter.format(max)}`;
  }

  const periodText = period ? ` / ${period}` : "";

  return `${symbol}${amount}${periodText}`;
}

import _ from "lodash";
export const mapFormToJobPayload = (v: JobFormValues) => ({
  rawDescription: v.rawDescription ?? null,
  title: v.title?.trim() ?? "",
  company: v.company ?? null,
  location: v.location ?? null,

  salary: v.salary ? {
    rawContent: null,
    min: v.salary.min ?? null,
    max: null,
    currency: null,
    period: null,
  } : null,

  contract: v.contract ? {
    rawContent: null,
    type: null,
    durationMonths: v.contract.durationMonths ?? null,
  } : null,

  educationRequirement: v.educationRequirement ? {
    rawContent: null,
    level: v.educationRequirement.level ?? null,
    importance: null,
    fieldOfStudy: null,
  } : null,

  experienceRequirement: v.experienceRequirement ? {
    rawContent: null,
    minYears: v.experienceRequirement.minYears ?? null,
    maxYears: null,
    importance: null,
    scope: v.experienceRequirement.scope ?? null,
  } : null,

  requirements: (v.requirements ?? []).map(r => ({
    rawContent: r.rawContent ?? null,
    category: r.category,
    operator: r.operator ?? null,
    skills: r.skills ?? [],
  })),

  permitSupport: v.permitSupport ? {
    rawContent: null,
    status: v.permitSupport.status ?? "unknown",
  } : null,
});