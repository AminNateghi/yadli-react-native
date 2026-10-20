import { useState, useRef, type ReactElement } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  type ListRenderItemInfo,
} from "react-native";
import { router } from "expo-router";
import { useCompleteOnboarding } from "@/repositories/profile-repository";
import { Button } from "@/components/Button";
import { Colors } from "@/constants";
import {
  FuelIcon,
  LayoutDashboardIcon,
  TimerIcon,
  WrenchIcon,
} from "lucide-react-native";
import { useTranslation } from "@/languages/useTranslation";
import { Text } from "@/components/Text";

const { width } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  image: ReactElement;
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const { mutateAsync: saveCompleteOnboarding } = useCompleteOnboarding();

  const completeOnboarding = async () => {
    await saveCompleteOnboarding();
    router.replace("/(tabs)/(home)");
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>{item.image}</View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const slides: Slide[] = [
    {
      id: "1",
      title: t("onboarding.slide1Title"),
      description: t("onboarding.slide1Description"),
      image: <FuelIcon width={60} height={60} color={Colors.primary} />,
    },
    {
      id: "2",
      title: t("onboarding.slide2Title"),
      description: t("onboarding.slide2Description"),

      image: (
        <LayoutDashboardIcon width={60} height={60} color={Colors.primary} />
      ),
    },
    {
      id: "3",
      title: t("onboarding.slide3Title"),
      description: t("onboarding.slide3Description"),
      image: <WrenchIcon width={60} height={60} color={Colors.primary} />,
    },
    {
      id: "4",
      title: t("onboarding.slide4Title"),
      description: t("onboarding.slide4Description"),
      image: <TimerIcon width={60} height={60} color={Colors.primary} />,
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index.toString()}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <Button
              title={t("onboarding.buttonNext")}
              variant="outline"
              onPress={nextSlide}
              style={styles.button}
            />
          ) : (
            <Button
              title={t("onboarding.buttonGetStarted")}
              onPress={completeOnboarding}
              style={styles.button}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary + 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 30,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    width: "100%",
  },
});
