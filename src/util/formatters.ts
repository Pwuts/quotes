import type { Subquote } from "@prisma/client";
import { getDateFormatter, getLanguage } from "./localization";

const dayDuration = 24 * 3600 * 1000;
const weekDuration = 7 * dayDuration;
const yearDuration = 365 * dayDuration;

export function formatDate(date: Date | string): string {
  const locale = getLanguage();

  if (typeof date == "string") {
    date = new Date(date);
  }
  const now = new Date(),
    nowT = now.getTime(),
    dateT = date.getTime();

  if (nowT - dateT < dayDuration) {
    return now.getDay() == date.getDay()
      ? locale.strings.today
      : locale.strings.yesterday;
  } else if (nowT - dateT < weekDuration) {
    return getDateFormatter({ weekday: "long" }).format(date);
  } else if (
    now.getFullYear() == date.getFullYear() ||
    nowT - dateT < yearDuration / 2
  ) {
    return getDateFormatter({ day: "numeric", month: "long" }).format(date);
  } else {
    return getDateFormatter({
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
}

export function formatSubquoteText(subquote: Omit<Subquote, "quoteId">): string {
  return subquote.isAction ? `*${subquote.text}*` : `"${subquote.text}"`;
}
