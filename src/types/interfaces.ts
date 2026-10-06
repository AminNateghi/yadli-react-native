import type {
  expensesRecords,
  fuelsRecords,
  servicesRecords,
} from "@/db/schema";
import type { NestedKeyOf, TranslationKeys } from "@/languages/TranslationKeys";

export type ServiceDto = typeof servicesRecords.$inferSelect;
export type FuelDto = typeof fuelsRecords.$inferSelect;
export type ExpenseDto = typeof expensesRecords.$inferSelect;

export type ServiceType =
  | "Other"
  | "GroupEngine"
  | "GroupGearbox"
  | "GroupBody"
  | "GroupUndercarriage"
  | "GroupSuspension"
  | "GroupSteeringSystem"
  | "GroupRadiatorSystem"
  | "GroupElectrical"
  | "GroupOthers"
  | "FuelAdditive"
  | "EngineRepair"
  | "EngineOil"
  | "TimingBelt"
  | "CylinderHeadGasket"
  | "SparkPlug"
  | "GearboxRepair"
  | "GearboxOil"
  | "ClutchPlate"
  | "DifferentialOil"
  | "BodySmoothing"
  | "BodyPainting"
  | "BumperMaking"
  | "Glass"
  | "Wiper"
  | "CarWash"
  | "BodyCover"
  | "SeatRepair"
  | "Silencing"
  | "FrontSystem"
  | "AxlesSystem"
  | "SuspensionSystem"
  | "ExhaustSystem"
  | "Catalyst"
  | "FrontBrakePads"
  | "BackBrakePads"
  | "BrakeOil"
  | "Tires"
  | "TiresRepair"
  | "Ring"
  | "SteeringRepair"
  | "HydraulicOil"
  | "RadiatorRepair"
  | "AirConditioning"
  | "Coolant"
  | "Thermostat"
  | "GasCharging"
  | "ElectricalRepair"
  | "Battery"
  | "Alternator"
  | "Lamp"
  | "VideoSound"
  | "Tuning";

export type ExpenseType =
  | "Reimbursement"
  | "Fine"
  | "Tolls"
  | "Tax"
  | "Parking"
  | "Registration"
  | "CertificateRenewal"
  | "TechnicalInspection"
  | "InsuranceSecondPerson"
  | "InsuranceBody"
  | "Other";

export interface CarStats {
  totalKm: number;
  avgKmPerLiter: number;
  totalFuelCost: number;
  totalServiceCost: number;
  totalExpenses: number;
  nextServiceDue: string | null;
}

export interface ServiceOptionProps {
  value: ServiceType;
  label: string;
  isGroup?: boolean;
}

export interface ExpenseOptionProps {
  value: ExpenseType;
  label: string;
  isGroup?: boolean;
}

export function serviceTypeOptions(
  t: (key: NestedKeyOf<TranslationKeys>) => string,
): ServiceOptionProps[] {
  return [
    {
      value: "GroupEngine",
      label: t("serviceType.GroupEngine"),
      isGroup: true,
    },
    { value: "EngineRepair", label: t("serviceType.EngineRepair") },
    { value: "EngineOil", label: t("serviceType.EngineOil") },
    { value: "TimingBelt", label: t("serviceType.TimingBelt") },
    { value: "CylinderHeadGasket", label: t("serviceType.CylinderHeadGasket") },
    { value: "SparkPlug", label: t("serviceType.SparkPlug") },
    { value: "FuelAdditive", label: t("serviceType.FuelAdditive") },

    {
      value: "GroupGearbox",
      label: t("serviceType.GroupGearbox"),
      isGroup: true,
    },
    { value: "GearboxRepair", label: t("serviceType.GearboxRepair") },
    { value: "GearboxOil", label: t("serviceType.GearboxOil") },
    { value: "ClutchPlate", label: t("serviceType.ClutchPlate") },
    { value: "DifferentialOil", label: t("serviceType.DifferentialOil") },

    { value: "GroupBody", label: t("serviceType.GroupBody"), isGroup: true },
    { value: "BodySmoothing", label: t("serviceType.BodySmoothing") },
    { value: "BodyPainting", label: t("serviceType.BodyPainting") },
    { value: "BumperMaking", label: t("serviceType.BumperMaking") },
    { value: "Glass", label: t("serviceType.Glass") },
    { value: "Wiper", label: t("serviceType.Wiper") },
    { value: "CarWash", label: t("serviceType.CarWash") },
    { value: "BodyCover", label: t("serviceType.BodyCover") },
    { value: "SeatRepair", label: t("serviceType.SeatRepair") },
    { value: "Silencing", label: t("serviceType.Silencing") },

    {
      value: "GroupUndercarriage",
      label: t("serviceType.GroupUndercarriage"),
      isGroup: true,
    },
    { value: "FrontSystem", label: t("serviceType.FrontSystem") },
    { value: "AxlesSystem", label: t("serviceType.AxlesSystem") },
    { value: "SuspensionSystem", label: t("serviceType.SuspensionSystem") },
    { value: "ExhaustSystem", label: t("serviceType.ExhaustSystem") },
    { value: "Catalyst", label: t("serviceType.Catalyst") },

    {
      value: "GroupSuspension",
      label: t("serviceType.GroupSuspension"),
      isGroup: true,
    },
    { value: "FrontBrakePads", label: t("serviceType.FrontBrakePads") },
    { value: "BackBrakePads", label: t("serviceType.BackBrakePads") },
    { value: "BrakeOil", label: t("serviceType.BrakeOil") },

    {
      value: "GroupRadiatorSystem",
      label: t("serviceType.GroupRadiatorSystem"),
      isGroup: true,
    },
    { value: "RadiatorRepair", label: t("serviceType.RadiatorRepair") },
    { value: "AirConditioning", label: t("serviceType.AirConditioning") },
    { value: "Coolant", label: t("serviceType.Coolant") },
    { value: "Thermostat", label: t("serviceType.Thermostat") },
    { value: "GasCharging", label: t("serviceType.GasCharging") },

    {
      value: "GroupSteeringSystem",
      label: t("serviceType.GroupSteeringSystem"),
      isGroup: true,
    },
    { value: "SteeringRepair", label: t("serviceType.SteeringRepair") },
    { value: "HydraulicOil", label: t("serviceType.HydraulicOil") },
    { value: "Tires", label: t("serviceType.Tires") },
    { value: "TiresRepair", label: t("serviceType.TiresRepair") },
    { value: "Ring", label: t("serviceType.Ring") },

    {
      value: "ElectricalRepair",
      label: t("serviceType.GroupElectrical"),
      isGroup: true,
    },
    { value: "Battery", label: t("serviceType.Battery") },
    { value: "Alternator", label: t("serviceType.Alternator") },
    { value: "Lamp", label: t("serviceType.Lamp") },
    { value: "VideoSound", label: t("serviceType.VideoSound") },

    {
      value: "GroupOthers",
      label: t("serviceType.GroupOthers"),
      isGroup: true,
    },
    { value: "Tuning", label: t("serviceType.Tuning") },
    { value: "Other", label: t("serviceType.Other") },
  ];
}

export function expenseTypeOptions(
  t: (key: NestedKeyOf<TranslationKeys>) => string,
): ExpenseOptionProps[] {
  return [
    { value: "Reimbursement", label: t("expenseType.Reimbursement") },
    { value: "Fine", label: t("expenseType.Fine") },
    { value: "Tolls", label: t("expenseType.Tolls") },
    { value: "Tax", label: t("expenseType.Tax") },
    { value: "Parking", label: t("expenseType.Parking") },
    { value: "Registration", label: t("expenseType.Registration") },
    { value: "CertificateRenewal", label: t("expenseType.CertificateRenewal") },
    {
      value: "TechnicalInspection",
      label: t("expenseType.TechnicalInspection"),
    },
    {
      value: "InsuranceSecondPerson",
      label: t("expenseType.InsuranceSecondPerson"),
    },
    { value: "InsuranceBody", label: t("expenseType.InsuranceBody") },
    { value: "Other", label: t(`expenseType.Other`) },
  ];
}

export type LanguageType = "en" | "fa";

export const LANGUAGE_TYPE: { value: LanguageType; label: string }[] = [
  { value: "fa", label: "Persian (فارسی)" },
  { value: "en", label: "English" },
];

export const getServiceTypeTitle = (
  serviceType: string,
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) => serviceTypeOptions(t).find((s) => s.value === serviceType)?.label || "-";

export const getExpenseTypeTitle = (
  expenseType: string,
  t: (key: NestedKeyOf<TranslationKeys>) => string,
) => expenseTypeOptions(t).find((s) => s.value === expenseType)?.label || "-";
