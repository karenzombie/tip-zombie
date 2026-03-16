import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { SERVICE_TYPES } from "@/lib/tipping-data";
import { calculateTip, type TipResult, type TipResultSet, type ChargeMode, type ChargeInput, type BillInput } from "@/lib/tip-calculator";
import { getCurrencyForCountry, formatCurrencyAmount, DEFAULT_CURRENCY, type CurrencyInfo } from "@/lib/currency-data";
import { parseLocation } from "@/lib/tipping-data";
import { getApiUrl } from "@/lib/query-client";
import { getBannerMessages, shouldHideCards, type BannerMessage, type BannerType } from "@/lib/banner-data";
import { searchLocations } from "@/lib/city-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ServiceOption {
  label: string;
  value: string;
  subOptions?: { label: string; value: string }[];
}

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  locationData?: {
    city: string | null;
    state: string | null;
    country: string | null;
    countryCode: string | null;
  };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const scrollRef = useRef<ScrollView>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQueryRef = useRef<string>("");

  const [location, setLocation] = useState("");
  const [locationDisplay, setLocationDisplay] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const [serviceType, setServiceType] = useState("");
  const [serviceLabel, setServiceLabel] = useState("");
  const [serviceSubLabel, setServiceSubLabel] = useState("");
  const [preTaxAmount, setPreTaxAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [postTaxAmount, setPostTaxAmount] = useState("");
  const [taxError, setTaxError] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [serviceChargeChecked, setServiceChargeChecked] = useState(false);
  const [autoGratuityChecked, setAutoGratuityChecked] = useState(false);
  const [serviceChargeValue, setServiceChargeValue] = useState("");
  const [serviceChargeMode, setServiceChargeMode] = useState<ChargeMode>("percentage");
  const [autoGratuityValue, setAutoGratuityValue] = useState("");
  const [autoGratuityMode, setAutoGratuityMode] = useState<ChargeMode>("percentage");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSubOptions, setShowSubOptions] = useState<ServiceOption | null>(null);
  const [result, setResult] = useState<TipResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [bannerMessages, setBannerMessages] = useState<BannerMessage[]>([]);
  const [hideCards, setHideCards] = useState(false);

  const taxEnabled = preTaxAmount.trim().length > 0 && parseFloat(preTaxAmount) > 0;

  useEffect(() => {
    if (!taxEnabled) {
      setTaxAmount("");
      setTaxError("");
    }
  }, [taxEnabled]);

  useEffect(() => {
    const hasTax = taxAmount.trim().length > 0 && parseFloat(taxAmount) > 0;
    const hasPreTax = preTaxAmount.trim().length > 0 && parseFloat(preTaxAmount) > 0;
    const hasPostTax = postTaxAmount.trim().length > 0 && parseFloat(postTaxAmount) > 0;

    if (hasTax && !hasPreTax && !hasPostTax) {
      setTaxError("Please enter a pre-tax or post-tax amount to calculate your tip.");
    } else {
      setTaxError("");
    }
  }, [taxAmount, preTaxAmount, postTaxAmount]);

  const currentCurrency: CurrencyInfo = (() => {
    if (!location) return DEFAULT_CURRENCY;
    const parsed = parseLocation(location);
    return getCurrencyForCountry(parsed.country);
  })();
  const currencySymbol = currentCurrency.symbol;

  const fetchRemotePredictions = useCallback(async (input: string) => {
    try {
      const baseUrl = getApiUrl();
      const url = new URL(`/api/places/autocomplete?input=${encodeURIComponent(input)}`, baseUrl);
      const response = await fetch(url.toString());
      const data = await response.json();

      if (latestQueryRef.current !== input) return;

      if (data.predictions && data.predictions.length > 0) {
        setPredictions(prev => {
          const existingKeys = new Set(prev.map((p: PlacePrediction) => p.mainText + "|" + p.secondaryText));
          const newPreds = data.predictions.filter(
            (p: PlacePrediction) => !existingKeys.has(p.mainText + "|" + p.secondaryText)
          );
          if (newPreds.length > 0) {
            return [...prev, ...newPreds].slice(0, 8);
          }
          return prev;
        });
        setShowPredictions(true);
      }
    } catch {
    } finally {
      if (latestQueryRef.current === input) {
        setLoadingPredictions(false);
      }
    }
  }, []);

  const handleLocationInput = useCallback((text: string) => {
    setLocationDisplay(text);
    setLocation(text);
    setLocationSelected(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    latestQueryRef.current = text;

    if (text.length >= 2) {
      const localResults = searchLocations(text, 5);
      if (localResults.length > 0) {
        const localPredictions: PlacePrediction[] = localResults.map(entry => {
          const secondaryParts: string[] = [];
          if (entry.state) secondaryParts.push(entry.state);
          if (entry.country && entry.country !== entry.city) secondaryParts.push(entry.country);
          const secondaryText = secondaryParts.join(", ");

          const parts: string[] = [entry.city];
          if (entry.state) parts.push(entry.state);
          parts.push(entry.country);

          return {
            placeId: `local-${entry.city}-${entry.country}`,
            description: parts.join(", "),
            mainText: entry.city,
            secondaryText,
            locationData: {
              city: entry.city,
              state: entry.state || null,
              country: entry.country,
              countryCode: entry.countryCode || null,
            },
          };
        });
        setPredictions(localPredictions);
        setShowPredictions(true);
        setLoadingPredictions(true);
      } else {
        setPredictions([]);
        setShowPredictions(true);
        setLoadingPredictions(true);
      }

      debounceRef.current = setTimeout(() => {
        fetchRemotePredictions(text);
      }, 400);
    } else {
      setPredictions([]);
      setShowPredictions(false);
      setLoadingPredictions(false);
    }
  }, [fetchRemotePredictions]);

  const handleSelectPrediction = useCallback((prediction: PlacePrediction) => {
    setShowPredictions(false);
    setPredictions([]);
    setLocationSelected(true);
    Keyboard.dismiss();

    if (prediction.locationData) {
      const { city, state, country } = prediction.locationData;
      const parts: string[] = [];
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (country) parts.push(country);
      const locationStr = parts.join(", ");
      setLocationDisplay(prediction.mainText + (prediction.secondaryText ? ", " + prediction.secondaryText : ""));
      setLocation(locationStr);
    } else {
      setLocationDisplay(prediction.description);
      setLocation(prediction.description);
    }
  }, []);

  const handleClearLocation = useCallback(() => {
    setLocation("");
    setLocationDisplay("");
    setLocationSelected(false);
    setPredictions([]);
    setShowPredictions(false);
  }, []);

  const validateChargeInput = (value: string, mode: ChargeMode, bill: number): string | null => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return null;
    if (mode === "percentage" && num > 100) return "Percentage must be between 0-100%";
    if (mode === "dollar" && bill > 0 && num > bill) return "Cannot exceed bill amount";
    return null;
  };

  const handleCalculate = () => {
    const effectiveLocation = location || locationDisplay;
    if (!effectiveLocation.trim()) {
      Alert.alert("Missing Information", "Please enter your location");
      return;
    }
    if (!serviceType) {
      Alert.alert("Missing Information", "Please select a service type");
      return;
    }

    const preTax = parseFloat(preTaxAmount) || 0;
    const tax = parseFloat(taxAmount) || 0;
    const postTax = parseFloat(postTaxAmount) || 0;

    if (preTax <= 0 && postTax <= 0) {
      Alert.alert("Missing Information", "Please enter a pre-tax or post-tax amount");
      return;
    }

    if (tax > 0 && preTax <= 0 && postTax <= 0) {
      return;
    }

    const people = parseInt(numberOfPeople) || 1;
    if (people < 1 || people > 30) {
      Alert.alert("Invalid Input", "Number of people must be between 1 and 30");
      return;
    }

    const billBasis = preTax > 0 ? preTax : postTax;

    if (serviceChargeChecked && serviceChargeValue) {
      const scError = validateChargeInput(serviceChargeValue, serviceChargeMode, billBasis);
      if (scError) {
        Alert.alert("Invalid Input", scError);
        return;
      }
    }
    if (autoGratuityChecked && autoGratuityValue) {
      const agError = validateChargeInput(autoGratuityValue, autoGratuityMode, billBasis);
      if (agError) {
        Alert.alert("Invalid Input", agError);
        return;
      }
    }

    const serviceCharge: ChargeInput = {
      enabled: serviceChargeChecked,
      mode: serviceChargeMode,
      value: serviceChargeChecked ? (parseFloat(serviceChargeValue) || 0) : 0,
    };

    const autoGratuity: ChargeInput = {
      enabled: autoGratuityChecked,
      mode: autoGratuityMode,
      value: autoGratuityChecked ? (parseFloat(autoGratuityValue) || 0) : 0,
    };

    const bill: BillInput = { preTax, tax, postTax };

    const tipResult = calculateTip(
      effectiveLocation,
      serviceType,
      bill,
      people,
      serviceCharge,
      autoGratuity
    );

    const banners = getBannerMessages(effectiveLocation, serviceType);
    const shouldHide = shouldHideCards(effectiveLocation, serviceType);

    setResult(tipResult);
    setBannerMessages(banners);
    setHideCards(shouldHide);
    setShowResults(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const handleClear = () => {
    handleClearLocation();
    setServiceType("");
    setServiceLabel("");
    setServiceSubLabel("");
    setPreTaxAmount("");
    setTaxAmount("");
    setPostTaxAmount("");
    setTaxError("");
    setNumberOfPeople("1");
    setServiceChargeChecked(false);
    setAutoGratuityChecked(false);
    setServiceChargeValue("");
    setServiceChargeMode("percentage");
    setAutoGratuityValue("");
    setAutoGratuityMode("percentage");
    setResult(null);
    setShowResults(false);
    setBannerMessages([]);
    setHideCards(false);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleEdit = () => {
    setShowResults(false);
    setResult(null);
    setBannerMessages([]);
    setHideCards(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSelectService = (item: ServiceOption) => {
    if (item.subOptions) {
      setShowSubOptions(item);
    } else {
      setServiceType(item.value);
      setServiceLabel(item.label);
      setServiceSubLabel("");
      setShowServiceModal(false);
      setShowSubOptions(null);
    }
  };

  const handleSelectSubOption = (sub: { label: string; value: string }, parent: ServiceOption) => {
    setServiceType(sub.value);
    setServiceLabel(parent.label);
    setServiceSubLabel(sub.label);
    setShowServiceModal(false);
    setShowSubOptions(null);
  };

  const handleToggleChargeMode = (type: "service" | "gratuity") => {
    if (type === "service") {
      const newMode = serviceChargeMode === "percentage" ? "dollar" : "percentage";
      setServiceChargeMode(newMode);
      setServiceChargeValue("");
    } else {
      const newMode = autoGratuityMode === "percentage" ? "dollar" : "percentage";
      setAutoGratuityMode(newMode);
      setAutoGratuityValue("");
    }
  };

  const formatAmount = (amount: number, currency: CurrencyInfo): string => {
    return formatCurrencyAmount(amount, currency);
  };

  const renderTipCards = (set: TipResultSet, showPerPerson: boolean, numberOfPeople: number) => {
    const isOpt = result?.isOptional === true;
    const labels = isOpt ? ["Skip", "Good", "Exceptional"] : ["Dissatisfied", "Average", "Exceptional"];
    const cardColors = isOpt
      ? ["#607D8B", "#78909C", "#546E7A"]
      : [Colors.redCard, Colors.white, Colors.greenCard];
    const outlinedFlags = isOpt ? [false, false, false] : [false, true, false];

    const tiers: Array<"dissatisfied" | "average" | "exceptional"> = ["dissatisfied", "average", "exceptional"];

    if (showPerPerson && numberOfPeople > 1) {
      return (
        <>
          <Text style={styles.sectionTitle}>PER PERSON</Text>
          <View style={styles.cardsRow}>
            {tiers.map((tier, i) => (
              <TipCard
                key={`pp-${tier}`}
                level={labels[i]}
                percentage={set[tier].percentage}
                tipAmount={formatAmount(set[tier].perPersonTip, result!.currency)}
                totalAmount={formatAmount(set[tier].perPersonTotal, result!.currency)}
                color={cardColors[i]}
                outlined={outlinedFlags[i]}
                suffix="per person"
                note={set[tier].note}
                isOptional={isOpt}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>TOTAL AMOUNT</Text>
          <View style={styles.cardsRow}>
            {tiers.map((tier, i) => (
              <TipCard
                key={`total-${tier}`}
                level={labels[i]}
                percentage={set[tier].percentage}
                tipAmount={formatAmount(set[tier].tipAmount, result!.currency)}
                totalAmount={formatAmount(set[tier].totalAmount, result!.currency)}
                color={cardColors[i]}
                outlined={outlinedFlags[i]}
                suffix="total"
                note={set[tier].note}
                isOptional={isOpt}
              />
            ))}
          </View>
        </>
      );
    }

    return (
      <View style={styles.cardsRow}>
        {tiers.map((tier, i) => (
          <TipCard
            key={tier}
            level={labels[i]}
            percentage={set[tier].percentage}
            tipAmount={formatAmount(set[tier].tipAmount, result!.currency)}
            totalAmount={formatAmount(set[tier].totalAmount, result!.currency)}
            color={cardColors[i]}
            outlined={outlinedFlags[i]}
            note={set[tier].note}
            isOptional={isOpt}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <LinearGradient
          colors={["#1a472a", "#0d2818", "#050f08", "#000000"]}
          style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : webTopInset + 4 }]}
        >
          <Image
            source={require("@/assets/images/tip-zombie-logo.png")}
            style={styles.headerLogo}
            contentFit="contain"
          />
        </LinearGradient>

        <View style={styles.formContainer}>
          {!showResults && (
          <>
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.tooltip}>
                Tipping customs may vary by location. For more accurate recommendations, enter your city.
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-sharp" size={18} color={Colors.grayDark} style={styles.inputIcon} />
              <TextInput
                style={styles.textInputWithIcon}
                placeholder="Enter city, state, or country"
                placeholderTextColor={Colors.textLight}
                value={locationDisplay}
                onChangeText={handleLocationInput}
                autoCapitalize="words"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {(locationDisplay.length > 0) && (
                <Pressable onPress={handleClearLocation} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={Colors.grayMedium} />
                </Pressable>
              )}
              {loadingPredictions && (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 6 }} />
              )}
            </View>
            {showPredictions && loadingPredictions && predictions.length === 0 && (
              <View style={styles.predictionsContainer}>
                <View style={{ padding: 14, alignItems: 'center' }}>
                  <Text style={[styles.predictionSecondary, { fontStyle: 'italic' }]}>Searching...</Text>
                </View>
              </View>
            )}
            {showPredictions && predictions.length > 0 && (
              <View style={styles.predictionsContainer}>
                {predictions.map((prediction, index) => (
                  <Pressable
                    key={prediction.placeId}
                    style={({ pressed }) => [
                      styles.predictionItem,
                      pressed && { backgroundColor: Colors.grayLight },
                      index < predictions.length - 1 && styles.predictionBorder,
                    ]}
                    onPress={() => handleSelectPrediction(prediction)}
                  >
                    <Ionicons name="location-outline" size={16} color={Colors.grayDark} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.predictionMain}>{prediction.mainText}</Text>
                      {prediction.secondaryText ? (
                        <Text style={styles.predictionSecondary}>{prediction.secondaryText}</Text>
                      ) : null}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Service Type</Text>
            <Pressable
              style={styles.selectButton}
              onPress={() => setShowServiceModal(true)}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.selectText, !serviceLabel && styles.placeholderText]}>
                  {serviceLabel || "Select service type"}
                </Text>
                {serviceSubLabel ? (
                  <Text style={styles.selectSubText}>{serviceSubLabel}</Text>
                ) : null}
              </View>
              <Ionicons name="chevron-down" size={18} color={Colors.grayDark} />
            </Pressable>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pre-Tax Amount</Text>
            <View style={styles.inputWrapper}>
              {currentCurrency.position === "prefix" && (
                <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
              )}
              <TextInput
                style={styles.textInputWithPrefix}
                placeholder={currentCurrency.decimals === 0 ? "0" : "0.00"}
                placeholderTextColor={Colors.textLight}
                value={preTaxAmount}
                onChangeText={setPreTaxAmount}
                keyboardType="decimal-pad"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {currentCurrency.position === "suffix" && (
                <Text style={styles.currencySuffix}>{currencySymbol}</Text>
              )}
            </View>
          </View>

          <View style={[styles.fieldGroup, { opacity: taxEnabled ? 1 : 0.5, pointerEvents: taxEnabled ? "auto" as const : "none" as const }]}>
            <Text style={[styles.label, !taxEnabled && styles.labelDisabled]}>Tax Amount</Text>
            <View style={styles.inputWrapper}>
              {currentCurrency.position === "prefix" && (
                <Text style={[styles.currencyPrefix, !taxEnabled && styles.textDisabled]}>{currencySymbol}</Text>
              )}
              <TextInput
                style={[styles.textInputWithPrefix, !taxEnabled && styles.textDisabled]}
                placeholder={currentCurrency.decimals === 0 ? "0" : "0.00"}
                placeholderTextColor={Colors.textLight}
                value={taxAmount}
                onChangeText={setTaxAmount}
                keyboardType="decimal-pad"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                editable={taxEnabled}
                aria-disabled={!taxEnabled}
              />
              {currentCurrency.position === "suffix" && (
                <Text style={[styles.currencySuffix, !taxEnabled && styles.textDisabled]}>{currencySymbol}</Text>
              )}
            </View>
            {taxError ? (
              <Text style={styles.validationError}>{taxError}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Post-Tax Amount</Text>
            <View style={styles.inputWrapper}>
              {currentCurrency.position === "prefix" && (
                <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
              )}
              <TextInput
                style={styles.textInputWithPrefix}
                placeholder={currentCurrency.decimals === 0 ? "0" : "0.00"}
                placeholderTextColor={Colors.textLight}
                value={postTaxAmount}
                onChangeText={setPostTaxAmount}
                keyboardType="decimal-pad"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {currentCurrency.position === "suffix" && (
                <Text style={styles.currencySuffix}>{currencySymbol}</Text>
              )}
            </View>
          </View>

          <View style={styles.checkboxSection}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => {
                setServiceChargeChecked(!serviceChargeChecked);
                if (serviceChargeChecked) {
                  setServiceChargeValue("");
                  setServiceChargeMode("percentage");
                }
              }}
            >
              <View style={[styles.checkbox, serviceChargeChecked && styles.checkboxChecked]}>
                {serviceChargeChecked && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Service charge included</Text>
            </Pressable>
            {serviceChargeChecked && (
              <ChargeInputRow
                value={serviceChargeValue}
                onChangeValue={setServiceChargeValue}
                mode={serviceChargeMode}
                onToggleMode={() => handleToggleChargeMode("service")}
                currencySymbol={currencySymbol}
              />
            )}

            <Pressable
              style={styles.checkboxRow}
              onPress={() => {
                setAutoGratuityChecked(!autoGratuityChecked);
                if (autoGratuityChecked) {
                  setAutoGratuityValue("");
                  setAutoGratuityMode("percentage");
                }
              }}
            >
              <View style={[styles.checkbox, autoGratuityChecked && styles.checkboxChecked]}>
                {autoGratuityChecked && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Auto-gratuity included</Text>
            </Pressable>
            {autoGratuityChecked && (
              <ChargeInputRow
                value={autoGratuityValue}
                onChangeValue={setAutoGratuityValue}
                mode={autoGratuityMode}
                onToggleMode={() => handleToggleChargeMode("gratuity")}
                currencySymbol={currencySymbol}
              />
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Number of People</Text>
            <TextInput
              style={styles.textInput}
              placeholder="1"
              placeholderTextColor={Colors.textLight}
              value={numberOfPeople}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, "");
                if (num === "" || (parseInt(num) >= 0 && parseInt(num) <= 30)) {
                  setNumberOfPeople(num);
                }
              }}
              keyboardType="number-pad"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          </>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleEdit}
            >
              <Text style={styles.secondaryButtonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleClear}
            >
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </Pressable>
          </View>
        </View>

        {showResults && result && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            {bannerMessages.map((banner, idx) => (
              <ContextBanner key={idx} banner={banner} enlarged={hideCards} />
            ))}

            {result.noTipping ? (
              result.isNoneMode ? (
                <View style={styles.cardNone}>
                  <Text style={styles.cardNoneTitle}>Tipping Not Expected</Text>
                  <Text style={styles.cardNoneBody}>{result.noneMessage}</Text>
                </View>
              ) : !bannerMessages.length ? (
                <View style={styles.noTipContainer}>
                  <Ionicons name="information-circle" size={48} color={Colors.primary} />
                  <Text style={styles.noTipText}>{result.noTipMessage}</Text>
                </View>
              ) : null
            ) : (
              <>
                {!hideCards && result.sets.map((set, setIndex) => (
                  <View key={setIndex}>
                    {set.label && (
                      <>
                        {setIndex > 0 && <View style={styles.setDivider} />}
                        <Text style={styles.setLabel}>{set.label}</Text>
                        {set.sublabel && <Text style={styles.setSublabel}>({set.sublabel})</Text>}
                      </>
                    )}
                    {renderTipCards(set, true, result.numberOfPeople)}
                  </View>
                ))}
              </>
            )}
          </Animated.View>
        )}

        <View style={{ height: showResults ? 100 + insets.bottom + 80 : 80 }} />
      </ScrollView>

      {!showResults && (
        <View style={[styles.stickyButtonContainer, { paddingBottom: Platform.OS === "web" ? 34 : Math.max(insets.bottom, 8) }]}>
          <Pressable
            style={({ pressed }) => [
              styles.calculateButton,
              pressed && styles.buttonPressed,
              !!taxError && styles.buttonDisabled,
            ]}
            onPress={handleCalculate}
            disabled={!!taxError}
          >
            <Text style={styles.calculateButtonText}>Calculate Tip</Text>
          </Pressable>
        </View>
      )}

      <Modal
        visible={showServiceModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowServiceModal(false);
          setShowSubOptions(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showSubOptions ? showSubOptions.label : "Select Service Type"}
              </Text>
              <Pressable
                onPress={() => {
                  if (showSubOptions) {
                    setShowSubOptions(null);
                  } else {
                    setShowServiceModal(false);
                  }
                }}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
            </View>
            <FlatList
              data={showSubOptions ? showSubOptions.subOptions : SERVICE_TYPES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.modalItem,
                    pressed && { backgroundColor: Colors.grayLight },
                  ]}
                  onPress={() => {
                    if (showSubOptions) {
                      handleSelectSubOption(item, showSubOptions);
                    } else {
                      handleSelectService(item as ServiceOption);
                    }
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                  {!showSubOptions && (item as ServiceOption).subOptions && (
                    <Ionicons name="chevron-forward" size={18} color={Colors.grayDark} />
                  )}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ChargeInputRow({
  value,
  onChangeValue,
  mode,
  onToggleMode,
  currencySymbol,
}: {
  value: string;
  onChangeValue: (v: string) => void;
  mode: ChargeMode;
  onToggleMode: () => void;
  currencySymbol: string;
}) {
  const isPercent = mode === "percentage";

  return (
    <View style={styles.chargeInputRow}>
      <TextInput
        style={styles.chargeInput}
        placeholder={isPercent ? "0" : "0.00"}
        placeholderTextColor={Colors.textLight}
        value={value}
        onChangeText={onChangeValue}
        keyboardType="decimal-pad"
        returnKeyType="done"
        blurOnSubmit={true}
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <View style={styles.toggleGroup}>
        <Pressable
          style={[styles.toggleButton, styles.toggleButtonLeft, isPercent && styles.toggleButtonActive]}
          onPress={() => { if (!isPercent) onToggleMode(); }}
        >
          <Text style={[styles.toggleText, isPercent && styles.toggleTextActive]}>%</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, styles.toggleButtonRight, !isPercent && styles.toggleButtonActive]}
          onPress={() => { if (isPercent) onToggleMode(); }}
        >
          <Text style={[styles.toggleText, !isPercent && styles.toggleTextActive]}>{currencySymbol}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const BANNER_STYLES: Record<BannerType, { bg: string; icon: string; iconColor: string }> = {
  INFO: { bg: "#E8F5E9", icon: "information-circle-outline", iconColor: "#2E7D32" },
  CAUTION: { bg: "#FFF8E1", icon: "warning-outline", iconColor: "#F9A825" },
  NO_TIP: { bg: "#F5F5F5", icon: "close-circle-outline", iconColor: "#757575" },
  OPTIONAL: { bg: "#E3F2FD", icon: "help-circle-outline", iconColor: "#1565C0" },
};

function ContextBanner({ banner, enlarged }: { banner: BannerMessage; enlarged?: boolean }) {
  const style = BANNER_STYLES[banner.type];
  return (
    <View style={[styles.bannerContainer, { backgroundColor: style.bg }]}>
      <Ionicons name={style.icon as any} size={enlarged ? 24 : 18} color={style.iconColor} style={{ marginTop: 1 }} />
      <Text style={[styles.bannerText, enlarged && styles.bannerTextEnlarged]}>{banner.message}</Text>
    </View>
  );
}

function TipCard({
  level,
  percentage,
  tipAmount,
  totalAmount,
  color,
  suffix,
  outlined,
  note,
  isOptional,
}: {
  level: string;
  percentage: number | null;
  tipAmount: string;
  totalAmount: string;
  color: string;
  suffix?: string;
  outlined?: boolean;
  note?: string;
  isOptional?: boolean;
}) {
  const textColor = outlined ? "#1a1a1a" : Colors.white;
  const subtleColor = outlined ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)";
  return (
    <View style={[styles.tipCard, { backgroundColor: color }, outlined && styles.tipCardOutlined]}>
      {isOptional && (
        <View style={styles.optionalBadge}>
          <Text style={styles.optionalBadgeText}>OPTIONAL</Text>
        </View>
      )}
      <Text style={[styles.tipCardLevel, { color: textColor }]}>{level}</Text>
      {percentage !== null && percentage > 0 && (
        <Text style={[styles.tipCardPercentage, { color: textColor }]}>{percentage}%</Text>
      )}
      {percentage === 0 && (
        <Text style={[styles.tipCardPercentage, { color: textColor }]}>No Tip</Text>
      )}
      <Text style={[styles.tipCardTipLabel, { color: subtleColor }]}>Tip</Text>
      <Text style={[styles.tipCardAmount, { color: textColor }]}>{tipAmount}</Text>
      <View style={[styles.tipCardDivider, { backgroundColor: subtleColor }]} />
      <Text style={[styles.tipCardTipLabel, { color: subtleColor }]}>Total</Text>
      <Text style={[styles.tipCardTotal, { color: textColor }]}>{totalAmount}</Text>
      {suffix && <Text style={[styles.tipCardSuffix, { color: subtleColor }]}>{suffix}</Text>}
      {note && (
        <Text style={[styles.cardNote, { color: outlined ? "rgba(0,0,0,0.45)" : "#EEEEEE" }]}>{note}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  header: {
    paddingBottom: 6,
    alignItems: "center",
  },
  headerLogo: {
    width: 140,
    height: 50,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  labelRow: {
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginBottom: 2,
  },
  labelDisabled: {
    color: Colors.textLight,
  },
  tooltip: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    height: 50,
  },
  inputDisabled: {
    backgroundColor: "#F0F0F0",
    opacity: 0.6,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInputWithIcon: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    height: 50,
  },
  currencyPrefix: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginRight: 6,
  },
  currencySuffix: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginLeft: 6,
  },
  textDisabled: {
    color: Colors.textLight,
  },
  textInputWithPrefix: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    height: 50,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 14,
    minHeight: 50,
    paddingVertical: 10,
  },
  selectText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  selectSubText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  placeholderText: {
    color: Colors.textLight,
  },
  validationError: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#D32F2F",
    marginTop: 6,
    lineHeight: 16,
  },
  checkboxSection: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.grayMedium,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  chargeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 32,
    marginBottom: 6,
  },
  chargeInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    height: 40,
    width: 100,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  toggleGroup: {
    flexDirection: "row",
    marginLeft: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
  },
  toggleButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: Colors.inputBorder,
  },
  toggleButtonRight: {},
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  predictionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  predictionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  predictionMain: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
  },
  predictionSecondary: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 1,
  },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#F5F5F5",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
  },
  calculateButton: {
    backgroundColor: Colors.buttonGray,
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  calculateButtonText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.buttonGrayDark,
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    gap: 8,
    alignItems: "flex-start",
  },
  noteText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    lineHeight: 19,
    flexWrap: "wrap",
  },
  bannerContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 10,
    alignItems: "flex-start",
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    lineHeight: 19,
  },
  bannerTextEnlarged: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_600SemiBold",
  },
  setDivider: {
    height: 1,
    backgroundColor: Colors.inputBorder,
    marginVertical: 20,
  },
  setLabel: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 4,
    marginTop: 8,
  },
  setSublabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tipCard: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
  },
  tipCardOutlined: {
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  tipCardLevel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
    marginBottom: 4,
    textAlign: "center" as const,
  },
  tipCardPercentage: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    marginBottom: 6,
    textAlign: "center" as const,
  },
  tipCardTipLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 1,
    textAlign: "center" as const,
  },
  tipCardAmount: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
    textAlign: "center" as const,
  },
  tipCardDivider: {
    width: "60%",
    height: 1,
    marginVertical: 4,
  },
  tipCardTotal: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    textAlign: "center" as const,
  },
  tipCardSuffix: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    textAlign: "center" as const,
  },
  cardNote: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center" as const,
    fontStyle: "italic" as const,
  },
  optionalBadge: {
    backgroundColor: "#78909C",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
    alignSelf: "center" as const,
  },
  optionalBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold" as const,
    letterSpacing: 1,
  },
  cardNone: {
    backgroundColor: "#EEEEEE",
    borderRadius: 12,
    padding: 24,
    alignItems: "center" as const,
    width: "100%" as const,
    marginVertical: 8,
  },
  cardNoneTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#444444",
    marginBottom: 10,
    textAlign: "center" as const,
  },
  cardNoneBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#666666",
    textAlign: "center" as const,
    lineHeight: 22,
  },
  noTipContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 20,
  },
  noTipText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.inputBorder,
    marginHorizontal: 16,
  },
});
