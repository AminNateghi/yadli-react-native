import { Theme } from "@/constants";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { Text } from "./Text";

export type SegmentedButtonOption = {
  label: string;
  value: string;
};

interface BaseProps {
  buttons: SegmentedButtonOption[];
  containerStyle?: ViewStyle;
  size?: "default" | "small";
}

interface SingleSelectProps extends BaseProps {
  multiSelect?: false;
  value: string;
  label?: string;
  onValueChange: (value: string) => void;
}

interface MultiSelectProps extends BaseProps {
  multiSelect: true;
  value: string[];
  label?: string;
  onValueChange: (value: string[]) => void;
}

type SegmentedButtonsProps = SingleSelectProps | MultiSelectProps;

export const SegmentedButtons: React.FC<SegmentedButtonsProps> = (props) => {
  const { buttons, multiSelect, value, onValueChange, containerStyle } = props;

  const handlePress = (buttonValue: string) => {
    if (multiSelect) {
      const currentValues = value as string[];
      if (currentValues.includes(buttonValue)) {
        onValueChange(currentValues.filter((v) => v !== buttonValue));
      } else {
        onValueChange([...currentValues, buttonValue]);
      }
    } else {
      if (value !== buttonValue) {
        onValueChange(buttonValue);
      }
    }
  };

  return (
    <>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View
        style={[
          styles.container,
          containerStyle,
          props.size === "small" && styles.containerSmall,
        ]}
      >
        {buttons.map((button, index) => {
          const isSelected = multiSelect
            ? (value as string[]).includes(button.value)
            : value === button.value;

          const isFirst = index === 0;
          const isLast = index === buttons.length - 1;

          return (
            <TouchableOpacity
              key={button.value}
              activeOpacity={0.7}
              onPress={() => handlePress(button.value)}
              style={[
                styles.button,
                props.size === "small" && styles.buttonSmall,
                isFirst && styles.firstButton,
                isLast && styles.lastButton,
                !isFirst && styles.middleButton,
                isSelected && styles.buttonActive,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isSelected && styles.textActive,
                  props.size === "small" && styles.textSmall,
                ]}
              >
                {button.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: Theme.height,
    marginBottom: 16,
  },
  containerSmall: {
    height: 45,
    padding: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: Theme.text,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmall: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  firstButton: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  lastButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  middleButton: {
    borderLeftWidth: 0,
  },
  buttonActive: {
    backgroundColor: Theme.primary + 35,
    borderColor: Theme.primary + 35,
  },
  text: {
    fontSize: Theme.fontSize,
  },
  textSmall: {
    fontSize: 14,
  },
  textActive: {
    color: Theme.primary,
  },
});
