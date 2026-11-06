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

export const cleanJobData = (values: JobFormValues) => {
  const { checked, ...jobData } = values;

  const clean = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(clean);
    }

    if (_.isPlainObject(value)) {
      const result = _.mapValues(value, clean);

      return _.pickBy(
        result,
        (v) => v !== undefined && !(_.isPlainObject(v) && _.isEmpty(v))
      );
    }

    return value;
  };

  return clean(jobData);
};