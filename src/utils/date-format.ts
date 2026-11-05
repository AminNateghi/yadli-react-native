import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { convertEnglishNumberToPersian } from "./number-format";

dayjs.extend(jalaliday);

export const DATE_FORMAT = "YYYY-MM-DD";

export function dateFormat(isRTL: boolean, date: string) {
  if (!date) return "";
  return isRTL
    ? convertEnglishNumberToPersian(
        dayjs(date).calendar("jalali").locale("fa").format("D MMMM YYYY"),
      )
    : dayjs(date).calendar("gregory").locale("en").format("MMM D, YYYY");
}
