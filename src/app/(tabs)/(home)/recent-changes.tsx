import { ScrollView, StyleSheet, View } from "react-native";
import changelogEn from "../../../../CHANGELOG-EN.md";
import changelogFa from "../../../../CHANGELOG-FA.md";
import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";

type ChangelogEntry = {
  key: string;
  text: string;
  type: "version" | "section" | "item" | "paragraph";
};

const parseChangelog = (changelog: string) =>
  changelog.split("\n").flatMap<ChangelogEntry>((line, index) => {
    let text = line.trim();

    if (!text) {
      return [];
    }

    text = text.replace(/<\/?[^>]+>/g, "").trim();

    if (!text) {
      return [];
    }

    const type = text.startsWith("# ")
      ? "version"
      : text.startsWith("- ")
        ? "item"
        : "paragraph";

    return [
      {
        key: `${index}-${text}`,
        text: text
          .replace(/^#+\s*/, "")
          .replace(/^- /, "")
          .replace(/`/g, ""),
        type,
      },
    ];
  });

export default function ChangelogScreen() {
  const { isRTL } = useTranslation();
  const entries = parseChangelog(isRTL ? changelogFa : changelogEn);

  return (
    <ScrollView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {entries.map((entry) => (
        <Text
          key={entry.key}
          style={[
            styles.entry,
            entry.type === "version" && styles.version,
            entry.type === "item" && styles.item,
            isRTL && entry.type === "version" && styles.versionRTL,
            isRTL && entry.type === "item" && styles.itemRTL,
          ]}
        >
          {entry.type === "item" ? `• ${entry.text}` : entry.text}
        </Text>
      ))}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    padding: 20,
  },
  entry: {
    color: Theme.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8,
  },
  version: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 10,
  },
  versionRTL: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 10,
    direction: "rtl",
  },
  item: {
    paddingStart: 12,
    marginBottom: 4,
    fontSize: 14,
  },
  itemRTL: {
    paddingStart: 12,
    marginBottom: 4,
    fontSize: 14,
    direction: "rtl",
  },
  footer: {
    height: 24,
  },
});
