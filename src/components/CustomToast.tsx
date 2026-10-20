import rnToast from "react-native-simple-toast";
import { Colors } from "@/constants";

type Props = {
  type?: "info" | "warning" | "error" | "success" | "none";
  text: string;
  duration?: number;
};

export function Toast({ text, type = "none", duration = 4 }: Props) {
  if (type === "none") {
    rnToast.show(text, duration);
  }

  if (type === "error") {
    rnToast.show(text, duration, {
      backgroundColor: Colors.danger,
      textColor: Colors.border,
    });
  }

  if (type === "info") {
    rnToast.show(text, duration, {
      backgroundColor: Colors.primary,
      textColor: Colors.border,
    });
  }

  if (type === "success") {
    rnToast.show(text, duration, {
      backgroundColor: Colors.success,
      textColor: Colors.border,
    });
  }

  if (type === "warning") {
    rnToast.show(text, duration, {
      backgroundColor: Colors.warning,
      textColor: Colors.border,
    });
  }
}
