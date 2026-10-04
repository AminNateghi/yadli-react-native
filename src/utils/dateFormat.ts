import { format } from "date-fns";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import type { DateType } from "react-native-ui-datepicker";

dayjs.extend(jalaliday);

export function dateFormat(isRTL: boolean, date: DateType) {
  return isRTL
    ? dayjs(date).calendar("jalali").locale("fa").format("DD MMMM YYYY")
    : format(String(date), "MMM d, yyyy");
}
