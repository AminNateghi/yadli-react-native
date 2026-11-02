import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useEffect, useMemo, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from "react-native";
import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";

dayjs.extend(jalaliday);

const ITEM_HEIGHT = 46;
const VISIBLE_ROWS = 5;
const CONTENT_PADDING = (ITEM_HEIGHT * (VISIBLE_ROWS - 1)) / 2;

type WheelColumnProps = {
  label: string;
  options: string[];
  selectedIndex: number;
  isRTL: boolean;
  headerShow: boolean;
  onSelect: (index: number) => void;
};

function WheelColumn({
  label,
  options,
  selectedIndex,
  isRTL,
  headerShow,
  onSelect,
}: WheelColumnProps) {
  const scrollRef = useRef<ScrollViewInstance | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * ITEM_HEIGHT,
      animated: true,
    });
  }, [selectedIndex]);

  const selectAtOffset = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.max(
      0,
      Math.min(
        options.length - 1,
        Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT),
      ),
    );
    onSelect(index);
  };

  return (
    <View style={styles.column}>
      {headerShow && (
        <Text style={[styles.columnLabel, isRTL && styles.rtlText]}>
          {label}
        </Text>
      )}
      <ScrollView
        ref={scrollRef}
        style={styles.wheel}
        contentContainerStyle={styles.wheelContent}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        snapToInterval={ITEM_HEIGHT}
        bounces={false}
        overScrollMode="never"
        onScrollEndDrag={(event) => {
          if (Math.abs(event.nativeEvent.velocity?.y ?? 0) < 0.01) {
            selectAtOffset(event);
          }
        }}
        onMomentumScrollEnd={selectAtOffset}
      >
        {options.map((option, index) => (
          <Pressable
            key={option}
            style={[
              styles.option,
              selectedIndex === index && styles.selectedOption,
            ]}
            onPress={() => {
              scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true,
              });
              onSelect(index);
            }}
          >
            <Text
              style={[
                styles.optionText,
                selectedIndex === index && styles.selectedOptionText,
                isRTL && styles.rtlText,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

type WheelDatePickerProps = {
  value: Date;
  isRTL: boolean;
  headerShow?: boolean;
  onChange: (date: Date) => void;
};

export function WheelDatePicker({
  value,
  isRTL,
  headerShow = false,
  onChange,
}: WheelDatePickerProps) {
  const { t } = useTranslation();
  const calendar = isRTL ? "jalali" : "gregory";
  const locale = isRTL ? "fa" : "en";
  const selectedDate = dayjs(value).calendar(calendar);
  const year = selectedDate.year();
  const month = selectedDate.month();
  const day = selectedDate.date();
  const daysInMonth = selectedDate.daysInMonth();
  const numberFormat = useMemo(
    () =>
      new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US", { useGrouping: false }),
    [isRTL],
  );

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        dayjs(value)
          .calendar(calendar)
          .locale(locale)
          .date(1)
          .month(index)
          .format("MMMM"),
      ),
    [calendar, locale, value],
  );
  const minYear = Math.min(isRTL ? 1200 : 1900, year);
  const maxYear = Math.max(isRTL ? 1500 : 2100, year);
  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => minYear + index,
      ),
    [maxYear, minYear],
  );
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
    [daysInMonth],
  );
  const columns = isRTL
    ? [
        {
          key: "year",
          label: t("common.year"),
          options: years.map((item) => numberFormat.format(item)),
          selectedIndex: years.indexOf(year),
          select: (index: number) => changeDate(years[index], month, day),
        },
        {
          key: "month",
          label: t("common.month"),
          options: months,
          selectedIndex: month,
          select: (index: number) => changeDate(year, index, day),
        },
        {
          key: "day",
          label: t("common.day"),
          options: days.map((item) => numberFormat.format(item)),
          selectedIndex: day - 1,
          select: (index: number) => changeDate(year, month, index + 1),
        },
      ]
    : [
        {
          key: "month",
          label: t("common.month"),
          options: months,
          selectedIndex: month,
          select: (index: number) => changeDate(year, index, day),
        },
        {
          key: "day",
          label: t("common.day"),
          options: days.map((item) => numberFormat.format(item)),
          selectedIndex: day - 1,
          select: (index: number) => changeDate(year, month, index + 1),
        },
        {
          key: "year",
          label: t("common.year"),
          options: years.map((item) => numberFormat.format(item)),
          selectedIndex: years.indexOf(year),
          select: (index: number) => changeDate(years[index], month, day),
        },
      ];

  function changeDate(nextYear: number, nextMonth: number, nextDay: number) {
    const nextDate = dayjs(value)
      .calendar(calendar)
      .date(1)
      .year(nextYear)
      .month(nextMonth);
    onChange(nextDate.date(Math.min(nextDay, nextDate.daysInMonth())).toDate());
  }

  return (
    <View style={styles.container}>
      <View style={styles.columns}>
        {columns.map((column) => (
          <WheelColumn
            key={column.key}
            label={column.label}
            options={column.options}
            selectedIndex={column.selectedIndex}
            isRTL={isRTL}
            headerShow={headerShow}
            onSelect={column.select}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  columns: {
    flexDirection: "row",
    direction: "ltr",
    gap: 0,
  },
  column: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  columnLabel: {
    height: 28,
    color: Theme.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  rtlText: {
    fontFamily: "VazirRegular",
    writingDirection: "rtl",
  },
  wheel: {
    height: ITEM_HEIGHT * VISIBLE_ROWS,
    width: "100%",
  },
  wheelContent: {
    paddingVertical: CONTENT_PADDING,
  },
  option: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.primary,
    backgroundColor: `${Theme.primary}10`,
  },
  optionText: {
    color: Theme.textMuted,
    fontSize: Theme.fontSize,
    textAlign: "center",
  },
  selectedOptionText: {
    color: Theme.primaryDark,
    fontWeight: 600,
  },
});
