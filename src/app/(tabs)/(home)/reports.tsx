import { useEffect, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { ScrollView, View } from "react-native";
import { useTranslation } from "@/languages/useTranslation";
import { useGetProfile } from "@/repositories/profile-repository";
import { GlobalStyles, ReportStyles } from "@/constants";
import { SegmentedButtons } from "@/components/SegmentedButtons";
import ReportGeneral from "@/components/forms/ReportGeneral";
import ReportFuel from "@/components/forms/ReportFuel";
import ReportServices from "@/components/forms/ReportServices";
import ReportExpense from "@/components/forms/ReportExpense";
import ReportDistance from "@/components/forms/ReportDistance";

type ReportType = "general" | "fuel" | "services" | "expense" | "distance";

export default function ReportsScreen() {
  const navigation = useNavigation();
  const { t, isRTL } = useTranslation();
  const { data: profile } = useGetProfile();

  const reportOptions = [
    { value: "general", label: t("reports.general") },
    { value: "fuel", label: t("reports.fuel") },
    { value: "services", label: t("reports.services") },
    { value: "expense", label: t("reports.expense") },
    { value: "distance", label: t("reports.distance") },
  ];
  const [currentSegment, setCurrentSegment] = useState<ReportType>("general");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("reports.title"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
    });
  }, [navigation, t]);

  useEffect(() => {
    if (profile) {
      if (!profile.onboarding) {
        router.push("/(tabs)/(home)/onboarding");
      }
    }
  }, [profile]);

  return (
    <View style={[ReportStyles.wrapper, isRTL && GlobalStyles.rtl]}>
      <SegmentedButtons
        buttons={reportOptions}
        value={currentSegment}
        size="small"
        onValueChange={(value) => setCurrentSegment(value as ReportType)}
      />
      <ScrollView
        style={ReportStyles.container}
        contentContainerStyle={ReportStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentSegment === "general" && <ReportGeneral />}
        {currentSegment === "fuel" && <ReportFuel />}
        {currentSegment === "services" && <ReportServices />}
        {currentSegment === "expense" && <ReportExpense />}
        {currentSegment === "distance" && <ReportDistance />}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
