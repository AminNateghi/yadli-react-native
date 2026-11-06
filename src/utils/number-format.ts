interface Props {
  isRTL: boolean;
}

export function numberFormat(value: number, options: Props) {
  return Intl.NumberFormat(options.isRTL ? "fa-IR" : "en-GB", {
    minimumFractionDigits: options.isRTL ? 0 : 2,
    maximumFractionDigits: options.isRTL ? 0 : 2,
  }).format(value);
}

export function convertEnglishNumberToPersian(input: string) {
  return input.replace(/\d/g, (digit) => {
    return new Intl.NumberFormat("fa-IR").format(Number(digit));
  });
}
