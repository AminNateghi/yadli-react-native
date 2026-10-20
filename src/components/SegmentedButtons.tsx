import { Colors } from "@/constants";
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
      <View style={[styles.container, containerStyle]}>
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
                isFirst && styles.firstButton,
                isLast && styles.lastButton,
                !isFirst && styles.middleButton,
                isSelected && styles.buttonActive,
              ]}
            >
              <Text style={[styles.text, isSelected && styles.textActive]}>
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
    height: 50,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: Colors.text,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: Colors.primary + 35,
    borderColor: Colors.primary + 35,
  },
  text: {
    fontSize: 16,
  },
  textActive: {
    color: Colors.primary,
  },
});
