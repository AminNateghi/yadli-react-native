import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export const DATE_FORMAT = "YYYY-MM-DD";

export function dateFormat(isRTL: boolean, date: string) {
  if (!date) return "";
  return isRTL
    ? dayjs(date).calendar("jalali").locale("fa").format("DD MMMM YYYY")
    : dayjs(date).calendar("gregory").locale("en").format("MMM DD, YYYY");
}
