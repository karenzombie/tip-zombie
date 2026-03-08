import { getRegionData, parseLocation, tippingDatabase, type RegionData, type FlatSuggestion, type OptionalPercentages } from "./tipping-data";
import { getCurrencyForCountry, formatCurrencyAmount, DEFAULT_CURRENCY, type CurrencyInfo } from "./currency-data";

export interface TipTier {
  percentage: number | null;
  tipAmount: number;
  totalAmount: number;
  perPersonTip: number;
  perPersonTotal: number;
  note?: string;
}

export interface TipResultSet {
  label?: string;
  sublabel?: string;
  dissatisfied: TipTier;
  average: TipTier;
  exceptional: TipTier;
  isFlat?: boolean;
}

export interface TipResult {
  sets: TipResultSet[];
  currencySymbol: string;
  currency: CurrencyInfo;
  numberOfPeople: number;
  noTipping: boolean;
  noTipMessage?: string;
  isNoneMode?: boolean;
  noneMessage?: string;
  isOptional?: boolean;
  regionNote?: string;
  serviceNote?: string;
}

export type ChargeMode = "percentage" | "dollar";

export interface ChargeInput {
  enabled: boolean;
  mode: ChargeMode;
  value: number;
}

export interface BillInput {
  preTax: number;
  tax: number;
  postTax: number;
}

function toTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateDeductionPercent(
  charge: ChargeInput,
  billAmount: number
): number {
  if (!charge.enabled || charge.value <= 0) return 0;

  if (charge.mode === "percentage") {
    return charge.value;
  } else {
    return (charge.value / billAmount) * 100;
  }
}

const CRUISE_SERVICE_NOTE = "Note: Most cruise lines charge automatic gratuities of $15-$20 per person, per day. This calculation shows discretionary tips for exceptional service.";

function getServiceNote(serviceKey: string): string | undefined {
  if (serviceKey.startsWith("cruise_")) {
    return CRUISE_SERVICE_NOTE;
  }
  return undefined;
}

function computeTier(
  billBasis: number,
  totalBasis: number,
  pct: number,
  numberOfPeople: number
): TipTier {
  const tipAmount = toTwoDecimals((billBasis * pct) / 100);
  const totalAmount = toTwoDecimals(totalBasis + tipAmount);
  const perPersonTip = toTwoDecimals(tipAmount / numberOfPeople);
  const perPersonTotal = toTwoDecimals(totalAmount / numberOfPeople);
  return {
    percentage: Math.round(pct * 100) / 100,
    tipAmount,
    totalAmount,
    perPersonTip,
    perPersonTotal,
  };
}

function computeResultSet(
  billBasis: number,
  totalBasis: number,
  dissatisfiedPct: number,
  averagePct: number,
  exceptionalPct: number,
  numberOfPeople: number,
  label?: string,
  sublabel?: string
): TipResultSet {
  return {
    label,
    sublabel,
    dissatisfied: computeTier(billBasis, totalBasis, dissatisfiedPct, numberOfPeople),
    average: computeTier(billBasis, totalBasis, averagePct, numberOfPeople),
    exceptional: computeTier(billBasis, totalBasis, exceptionalPct, numberOfPeople),
  };
}

function getPercentages(
  tipRange: { min: number; max: number },
  totalDeduction: number
): { dissatisfiedPct: number; averagePct: number; exceptionalPct: number } {
  return {
    dissatisfiedPct: Math.max(0, tipRange.min - 3 - totalDeduction),
    averagePct: Math.max(0, tipRange.max - totalDeduction),
    exceptionalPct: Math.max(0, tipRange.max + 8 - totalDeduction),
  };
}

function buildFlatTier(
  suggestion: FlatSuggestion,
  totalBasis: number,
  numberOfPeople: number
): TipTier {
  const tipAmount = toTwoDecimals(suggestion.tipAmount);
  const totalAmount = toTwoDecimals(totalBasis + tipAmount);
  const perPersonTip = toTwoDecimals(tipAmount / numberOfPeople);
  const perPersonTotal = toTwoDecimals(totalAmount / numberOfPeople);
  return {
    percentage: null,
    tipAmount,
    totalAmount,
    perPersonTip,
    perPersonTotal,
    note: suggestion.note,
  };
}

function buildFlatResultSet(
  flatSuggestions: FlatSuggestion[],
  totalBasis: number,
  numberOfPeople: number
): TipResultSet {
  return {
    dissatisfied: buildFlatTier(flatSuggestions[0], totalBasis, numberOfPeople),
    average: buildFlatTier(flatSuggestions[1], totalBasis, numberOfPeople),
    exceptional: buildFlatTier(flatSuggestions[2], totalBasis, numberOfPeople),
    isFlat: true,
  };
}

export function calculateTip(
  location: string,
  serviceKey: string,
  bill: BillInput,
  numberOfPeople: number,
  serviceCharge: ChargeInput = { enabled: false, mode: "percentage", value: 0 },
  autoGratuity: ChargeInput = { enabled: false, mode: "percentage", value: 0 }
): TipResult {
  const regionData = getRegionData(location);
  const parsed = parseLocation(location);
  const currency = getCurrencyForCountry(parsed.country);

  const hasPreTax = bill.preTax > 0;
  const hasTax = bill.tax > 0;
  const hasPostTax = bill.postTax > 0;

  const tipBasis = hasPreTax ? bill.preTax : bill.postTax;

  let totalBasis: number;
  if (hasPostTax) {
    totalBasis = bill.postTax;
  } else if (hasPreTax && hasTax) {
    totalBasis = bill.preTax + bill.tax;
  } else {
    totalBasis = hasPreTax ? bill.preTax : bill.postTax;
  }

  if (!regionData) {
    return createDefaultResult(tipBasis, totalBasis, numberOfPeople, currency, hasPreTax, hasPostTax, bill);
  }

  if (regionData.flatServices && regionData.flatServices[serviceKey]) {
    const flatSuggestions = regionData.flatServices[serviceKey];
    const set = buildFlatResultSet(flatSuggestions, totalBasis, numberOfPeople);
    return {
      sets: [set],
      currencySymbol: currency.symbol,
      currency,
      numberOfPeople,
      noTipping: false,
      regionNote: regionData.regionNote,
      serviceNote: getServiceNote(serviceKey),
    };
  }

  if (regionData.isOptional && regionData.optionalPercentages) {
    const opt = regionData.optionalPercentages;
    const scDeduction = calculateDeductionPercent(serviceCharge, tipBasis);
    const agDeduction = calculateDeductionPercent(autoGratuity, tipBasis);
    const totalDeduction = scDeduction + agDeduction;
    const adjustedPcts = {
      dissatisfiedPct: Math.max(0, opt.skip - totalDeduction),
      averagePct: Math.max(0, opt.good - totalDeduction),
      exceptionalPct: Math.max(0, opt.exceptional - totalDeduction),
    };
    const sets = buildSets(adjustedPcts, tipBasis, totalBasis, numberOfPeople, hasPreTax, hasPostTax, bill);
    return {
      sets,
      currencySymbol: currency.symbol,
      currency,
      numberOfPeople,
      noTipping: false,
      isOptional: true,
      regionNote: regionData.regionNote,
      serviceNote: getServiceNote(serviceKey),
    };
  }

  if (regionData.noTipping) {
    if (regionData.flatServices && regionData.flatServices[serviceKey]) {
      const flatSuggestions = regionData.flatServices[serviceKey];
      const set = buildFlatResultSet(flatSuggestions, totalBasis, numberOfPeople);
      return {
        sets: [set],
        currencySymbol: currency.symbol,
        currency,
        numberOfPeople,
        noTipping: false,
        regionNote: regionData.regionNote,
        serviceNote: getServiceNote(serviceKey),
      };
    }

    const countryData = tippingDatabase[parsed.country];
    const exceptions = countryData?.exceptions;

    if (exceptions && exceptions[serviceKey]) {
      const exception = exceptions[serviceKey];

      if (!exception.showCalculation) {
        return {
          sets: [],
          currencySymbol: currency.symbol,
          currency,
          numberOfPeople,
          noTipping: true,
          noTipMessage: exception.note,
        };
      }

      const tipRange = exception.range;
      const scDeduction = calculateDeductionPercent(serviceCharge, tipBasis);
      const agDeduction = calculateDeductionPercent(autoGratuity, tipBasis);
      const totalDeduction = scDeduction + agDeduction;
      const pcts = getPercentages(tipRange, totalDeduction);

      const sets = buildSets(pcts, tipBasis, totalBasis, numberOfPeople, hasPreTax, hasPostTax, bill);

      return {
        sets,
        currencySymbol: currency.symbol,
        currency,
        numberOfPeople,
        noTipping: false,
        regionNote: exception.note,
        serviceNote: getServiceNote(serviceKey),
      };
    }

    const noneMsg = regionData.noneMessage || regionData.noTipMessage;
    return {
      sets: [],
      currencySymbol: currency.symbol,
      currency,
      numberOfPeople,
      noTipping: true,
      noTipMessage: noneMsg,
      isNoneMode: !!regionData.noneMessage,
      noneMessage: regionData.noneMessage,
    };
  }

  const tipRange = regionData.services[serviceKey];
  if (!tipRange) {
    return createDefaultResult(tipBasis, totalBasis, numberOfPeople, currency, hasPreTax, hasPostTax, bill);
  }

  const scDeduction = calculateDeductionPercent(serviceCharge, tipBasis);
  const agDeduction = calculateDeductionPercent(autoGratuity, tipBasis);
  const totalDeduction = scDeduction + agDeduction;
  const pcts = getPercentages(tipRange, totalDeduction);

  const sets = buildSets(pcts, tipBasis, totalBasis, numberOfPeople, hasPreTax, hasPostTax, bill);

  return {
    sets,
    currencySymbol: currency.symbol,
    currency,
    numberOfPeople,
    noTipping: false,
    regionNote: regionData.regionNote,
    serviceNote: getServiceNote(serviceKey),
  };
}

function buildSets(
  pcts: { dissatisfiedPct: number; averagePct: number; exceptionalPct: number },
  tipBasis: number,
  totalBasis: number,
  numberOfPeople: number,
  hasPreTax: boolean,
  hasPostTax: boolean,
  bill: BillInput
): TipResultSet[] {
  const isDualDisplay = hasPreTax && hasPostTax && bill.tax <= 0;

  if (isDualDisplay) {
    const postTaxBase = bill.postTax;
    const setA = computeResultSet(
      bill.preTax, postTaxBase,
      pcts.dissatisfiedPct, pcts.averagePct, pcts.exceptionalPct,
      numberOfPeople,
      "Based on Pre-Tax Amount",
      formatBasisAmount(bill.preTax)
    );

    const setB = computeResultSet(
      bill.postTax, postTaxBase,
      pcts.dissatisfiedPct, pcts.averagePct, pcts.exceptionalPct,
      numberOfPeople,
      "Based on Post-Tax Amount",
      formatBasisAmount(bill.postTax)
    );

    return [setA, setB];
  }

  return [computeResultSet(
    tipBasis, totalBasis,
    pcts.dissatisfiedPct, pcts.averagePct, pcts.exceptionalPct,
    numberOfPeople
  )];
}

function formatBasisAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function createDefaultResult(
  tipBasis: number,
  totalBasis: number,
  numberOfPeople: number,
  currency: CurrencyInfo = DEFAULT_CURRENCY,
  hasPreTax: boolean = false,
  hasPostTax: boolean = false,
  bill?: BillInput
): TipResult {
  const defaultPcts = { dissatisfiedPct: 12, averagePct: 20, exceptionalPct: 28 };
  const sets = bill
    ? buildSets(defaultPcts, tipBasis, totalBasis, numberOfPeople, hasPreTax, hasPostTax, bill)
    : [computeResultSet(tipBasis, totalBasis, 12, 20, 28, numberOfPeople)];

  return {
    sets,
    currencySymbol: currency.symbol,
    currency,
    numberOfPeople,
    noTipping: false,
  };
}
