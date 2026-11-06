import { Button } from "@/components/Button";
import { useTranslation } from "@/languages/useTranslation";
import type { ReminderDto } from "@/types/interfaces";
import { router } from "expo-router";

type Props = {
  reminder: ReminderDto;
};

export function CompleteReminderModal({ reminder }: Props) {
  const { t } = useTranslation();
  const sourcePath = reminder.service ? "/services/form" : "/expenses/form";

  return (
    <Button
      title={`${t("common.done")}...`}
      variant="solid"
      color="green"
      onPress={() =>
        router.navigate({
          pathname: sourcePath,
          params: { reminderId: String(reminder.id) },
        })
      }
      style={{ flex: 1 }}
    />
  );
}
