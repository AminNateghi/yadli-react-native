interface Props {
  isRTL: boolean;
  type?: "number" | "decimal";
}

export function numberFormat(value: number, options: Props) {
  return Intl.NumberFormat(options.isRTL ? "fa-IR" : "en-GB", {
    maximumSignificantDigits: options.type === "decimal" ? 2 : undefined,
  }).format(value);
}

// function convertEnglishNumberToPersian(input: string) {
//   return input.replace(/\d/g, (digit) => {
//     return new Intl.NumberFormat("fa-IR").format(Number(digit));
//   });
// }
