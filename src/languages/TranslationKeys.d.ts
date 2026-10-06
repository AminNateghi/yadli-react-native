export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]:
        | `${Exclude<K, symbol>}`
        | `${Exclude<K, symbol>}.${NestedKeyOf<T[K]>}`;
    }[keyof T]
  : "";

export interface TranslationKeys {
  app: App;
  menus: Menus;
  common: Common;
  dashboard: Dashboard;
  settings: Settings;
  fuel: Fuel;
  reminders: Reminders;
  serviceType: ServiceType;
  services: Services;
  expenses: Expenses;
  expenseType: ExpenseType;
}

interface App {
  name: string;
  rtl: string;
}

interface Common {
  liter: string;
  l: string;
  kilometer: string;
  km: string;
  priceSign: string;
  save: string;
  close: string;
  delete: string;
  update: string;
  yes: string;
  no: string;
  cancel: string;
  ok: string;
  confirm: string;
  loading: string;
  selectDate: string;
  required: string;
  saved: string;
  deleted: string;
}

interface Menus {
  dashboard: string;
  fuel: string;
  services: string;
  expenses: string;
  reminders: string;
}

interface Dashboard {
  myVehicle: string;
  serviceDue: string;
  totalSpent: string;
  avgPerKm: string;
  allTime: string;
  fuelEfficiency: string;
  fuelCosts: string;
  fillUps: string;
  serviceCosts: string;
  servicesCount: string;
  recentServices: string;
  seeAll: string;
  recentExpenses: string;
  recentFillUps: string;
}

interface Settings {
  title: string;
  language: string;
}

interface Reminders {
  title: string;
  noReminders: string;
  noRemindersDescription: string;
  activeReminders: string;
  needAttention: string;
  allOnTrack: string;
  lastService: string;
  overdue: string;
  byDate: string;
  byOdometer: string;
  daysRemaining: string;
  daysOverdue: string;
  dueToday: string;
  dueOn: string;
  dueAt: string;
  remaining: string;
  passed: string;
}

interface Fuel {
  totalFuelCost: string;
  noFuelRecords: string;
  fuelDescription: string;
  confirmValidation: string;
  confirmDelete: string;
  updateTitle: string;
  createTitle: string;
  date: string;
  odometer: string;
  odometerPlaceholder: string;
  liters: string;
  litersPlaceholder: string;
  price: string;
  pricePlaceholder: string;
  totalCost: string;
  fullTank: string;
  fullTankPlaceholder: string;
  station: string;
  stationPlaceHolder: string;
  kmPerLiter: string;
  averageFuelEconomy: string;
  note: string;
  notePlaceholder: string;
}

interface ServiceType {
  FuelAdditive: string;
  GroupEngine: string;
  GroupGearbox: string;
  GroupBody: string;
  GroupUndercarriage: string;
  GroupSuspension: string;
  GroupSteeringSystem: string;
  GroupRadiatorSystem: string;
  GroupElectrical: string;
  GroupOthers: string;
  Other: string;
  EngineRepair: string;
  EngineOil: string;
  TimingBelt: string;
  CylinderHeadGasket: string;
  SparkPlug: string;
  GearboxRepair: string;
  GearboxOil: string;
  ClutchPlate: string;
  DifferentialOil: string;
  BodySmoothing: string;
  BodyPainting: string;
  BumperMaking: string;
  Glass: string;
  Wiper: string;
  CarWash: string;
  BodyCover: string;
  SeatRepair: string;
  Silencing: string;
  FrontSystem: string;
  AxlesSystem: string;
  SuspensionSystem: string;
  ExhaustSystem: string;
  Catalyst: string;
  FrontBrakePads: string;
  BackBrakePads: string;
  BrakeOil: string;
  Tires: string;
  TiresRepair: string;
  Ring: string;
  SteeringRepair: string;
  HydraulicOil: string;
  RadiatorRepair: string;
  AirConditioning: string;
  Coolant: string;
  Thermostat: string;
  GasCharging: string;
  ElectricalRepair: string;
  Battery: string;
  Alternator: string;
  Lamp: string;
  VideoSound: string;
  Tuning: string;
}

interface Services {
  totalServiceCost: string;
  noServicesYet: string;
  servicesDescription: string;
  confirmValidation: string;
  confirmDelete: string;
  updateTitle: string;
  createTitle: string;
  serviceType: string;
  date: string;
  odometer: string;
  cost: string;
  note: string;
  nextServiceDue: string;
  nextDueDate: string;
  nextDueOdometer: string;
  odometerPlaceholder: string;
  costPlaceholder: string;
  notePlaceholder: string;
  nextDueDatePlaceholder: string;
  nextDueOdometerPlaceholder: string;
}

interface Expenses {
  noExpenseYet: string;
  totalExpenses: string;
  expensesDescription: string;
  confirmValidation: string;
  confirmDelete: string;
  updateTitle: string;
  createTitle: string;
  category: string;
  date: string;
  amount: string;
  notes: string;
  odometer: string;
  amountPlaceholder: string;
  notesPlaceholder: string;
  odometerPlaceholder: string;
}

interface ExpenseType {
  Reimbursement: string;
  Fine: string;
  Tolls: string;
  Tax: string;
  Parking: string;
  Registration: string;
  CertificateRenewal: string;
  TechnicalInspection: string;
  InsuranceSecondPerson: string;
  InsuranceBody: string;
  Other: string;
}
