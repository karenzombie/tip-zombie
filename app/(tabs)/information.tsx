import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/colors";

interface TipInfoItem {
  icon: string;
  iconSet: "ionicons" | "material-community";
  title: string;
  description: string;
}

const tippingTips: TipInfoItem[] = [
  {
    icon: "bed-outline",
    iconSet: "ionicons",
    title: "Hotel Housekeeping",
    description:
      "Tip daily, not just at checkout. Different staff may clean your room each day.",
  },
  {
    icon: "key-outline",
    iconSet: "ionicons",
    title: "Hotel Concierge",
    description:
      "Tips vary greatly: $5-10 for simple requests, $50-100 for complex arrangements like hard-to-get reservations.",
  },
  {
    icon: "car-outline",
    iconSet: "ionicons",
    title: "Valet Parking",
    description:
      "Tip when retrieving your car, not when dropping it off.",
  },
  {
    icon: "bicycle-outline",
    iconSet: "ionicons",
    title: "Delivery Services",
    description:
      "Consider weather conditions and distance traveled when tipping for exceptional service.",
  },
  {
    icon: "restaurant-outline",
    iconSet: "ionicons",
    title: "Restaurant Owner",
    description:
      "Tipping the owner of a restaurant is optional. It's a kind gesture but not expected.",
  },
  {
    icon: "cash-outline",
    iconSet: "ionicons",
    title: "Cash Tips Preferred",
    description:
      "For personal care services (hair, nails, massage), cash tips are often preferred as they go directly to the provider.",
  },
  {
    icon: "receipt-outline",
    iconSet: "ionicons",
    title: "Check Your Bill",
    description:
      "Always check if a service charge or gratuity is already included in your bill before adding an additional tip.",
  },
  {
    icon: "people-outline",
    iconSet: "ionicons",
    title: "Large Groups",
    description:
      "Many restaurants automatically add 18-20% gratuity for parties of 6 or more. Check before adding extra.",
  },
  {
    icon: "heart-outline",
    iconSet: "ionicons",
    title: "Acknowledge Good Service",
    description:
      "A generous tip paired with a kind word or positive review can make a service provider's day.",
  },
];

const cruiseTips: TipInfoItem[] = [
  {
    icon: "boat-outline",
    iconSet: "ionicons",
    title: "Automatic Gratuities",
    description:
      "Most cruise lines charge automatic daily gratuities ($15-20 per person, per day) that cover room stewards, dining staff, and crew.",
  },
  {
    icon: "star-outline",
    iconSet: "ionicons",
    title: "Extra Cash Tips",
    description:
      "Extra cash tips for exceptional service are welcomed but not required beyond the automatic gratuity.",
  },
  {
    icon: "diamond-outline",
    iconSet: "ionicons",
    title: "Luxury Cruises",
    description:
      "Luxury cruise lines often include all gratuities in the fare. Check your cruise line's policy before boarding.",
  },
];

const airportTips: TipInfoItem[] = [
  {
    icon: "briefcase-outline",
    iconSet: "ionicons",
    title: "Airport Porters",
    description:
      "Tip porters $2-5 per bag, especially for heavy or oversized luggage.",
  },
  {
    icon: "accessibility-outline",
    iconSet: "ionicons",
    title: "Wheelchair Attendants",
    description:
      "Wheelchair attendants: $5-20 depending on distance and level of service provided.",
  },
];

const internationalTips: TipInfoItem[] = [
  {
    icon: "receipt-outline",
    iconSet: "ionicons",
    title: "Service Charges",
    description:
      "Always check bills for included service charges (service compris, servizio, servicio).",
  },
  {
    icon: "snow-outline",
    iconSet: "ionicons",
    title: "Scandinavia",
    description:
      "In Scandinavia, tipping is not expected. Service is included in prices and workers receive fair wages.",
  },
  {
    icon: "leaf-outline",
    iconSet: "ionicons",
    title: "Australia & New Zealand",
    description:
      "Tipping is optional. Workers receive fair wages. 10-15% for exceptional service is appreciated but not expected.",
  },
  {
    icon: "sunny-outline",
    iconSet: "ionicons",
    title: "Middle East",
    description:
      "In Dubai and Qatar, a 10% service charge is often added, but an additional tip is still expected for good service.",
  },
];

const cityVariationsTips: TipInfoItem[] = [
  {
    icon: "business-outline",
    iconSet: "ionicons",
    title: "United States",
    description:
      "Major cities (NYC, LA, SF, Chicago, Boston, Miami, DC, Seattle): 20-25% is standard. Smaller cities and rural areas: 15-20% is more common.",
  },
  {
    icon: "flag-outline",
    iconSet: "ionicons",
    title: "United Kingdom",
    description:
      "London: 12.5% service charge typical; 12-15% tipping expected. Other UK regions: 10-12% more common; tipping less expected in rural areas.",
  },
  {
    icon: "map-outline",
    iconSet: "ionicons",
    title: "Mexico",
    description:
      "Tourist resorts (Cancun, Cabo, Playa del Carmen): 15-20% (US-style tipping). Inland cities: 10-15% is standard.",
  },
  {
    icon: "location-outline",
    iconSet: "ionicons",
    title: "Thailand",
    description:
      "Tourist islands (Phuket, Samui): 10-15% appreciated. Bangkok and local areas: 5-10% or round up.",
  },
];

const noTippingExceptionsTips: TipInfoItem[] = [
  {
    icon: "flower-outline",
    iconSet: "ionicons",
    title: "Japan",
    description:
      "Tipping generally not practiced and can cause confusion. Exception: Private tour guides may accept \u00A51,000-5,000 in an envelope. Luxury ryokan attendants may receive \u00A51,000-5,000 in envelope. Always present tips in clean envelopes with both hands.",
  },
  {
    icon: "earth-outline",
    iconSet: "ionicons",
    title: "China",
    description:
      "Tipping generally not practiced in restaurants, taxis, or hotels. Important Exception: Tour guides and drivers EXPECT tips \u2014 Guides: $10-20 per person per day, Drivers: $5-10 per person per day. Luxury international hotel bellhops may accept \u00A510-30.",
  },
  {
    icon: "storefront-outline",
    iconSet: "ionicons",
    title: "Hong Kong & Macau",
    description:
      "Despite being part of China, these follow Western tipping customs (10-15%) due to colonial history.",
  },
  {
    icon: "compass-outline",
    iconSet: "ionicons",
    title: "Singapore & South Korea",
    description:
      "Tipping generally not practiced. Exception: Tour guides may accept small tips from international tourists.",
  },
];

const serviceChargeInfo = "Many countries automatically include service charges in restaurant and hotel bills. Europe: 10-15% service often included. Southeast Asia: 10% service charge common. Middle East (Dubai, Qatar): 10% service charge often added; additional tip still expected. Caribbean: 10-15% service charge frequently included. Always check your bill before adding additional tips.";

export default function InformationScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a472a", "#0d2818", "#050f08", "#000000"]}
        style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 10 : webTopInset + 20 }]}
      >
        <Image
          source={require("@/assets/images/tip-zombie-logo.png")}
          style={styles.headerLogo}
          contentFit="contain"
        />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.sectionHeader}>Special Cases & Helpful Tips</Text>

          {tippingTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons
                  name={tip.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>Cruises</Text>

          {cruiseTips.map((tip, index) => (
            <View key={`cruise-${index}`} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons
                  name={tip.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>Airports</Text>

          {airportTips.map((tip, index) => (
            <View key={`airport-${index}`} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons
                  name={tip.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>International</Text>

          {internationalTips.map((tip, index) => (
            <View key={`intl-${index}`} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons
                  name={tip.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>City-Level Variations</Text>

          {cityVariationsTips.map((tip, index) => (
            <View key={`city-${index}`} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons
                  name={tip.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}

          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="trending-up-outline" size={22} color={Colors.primary} />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipDescription}>
                Tourist-heavy areas and major metropolitan cities typically have higher tipping expectations than rural or local areas.
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>No-Tipping Countries with Exceptions</Text>

          {noTippingExceptionsTips.map((tip, index) => (
            <View key={`notip-${index}`} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons
                  name={tip.icon as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>
            Understanding Service Charges
          </Text>

          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipDescription}>{serviceChargeInfo}</Text>
            </View>
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 28 }]}>
            Legal Documents
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.legalButton,
              pressed && styles.legalButtonPressed,
            ]}
            onPress={() => router.push("/privacy-policy")}
          >
            <View style={styles.legalButtonContent}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary} />
              <Text style={styles.legalButtonText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.grayDark} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.legalButton,
              pressed && styles.legalButtonPressed,
            ]}
            onPress={() => router.push("/terms")}
          >
            <View style={styles.legalButtonContent}>
              <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
              <Text style={styles.legalButtonText}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.grayDark} />
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zombie Platforms, LLC</Text>
            <Text style={styles.footerSubtext}>info@zombieplatforms.com</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
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
  header: {
    paddingBottom: 20,
    alignItems: "center",
  },
  headerLogo: {
    width: 220,
    height: 120,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    marginBottom: 14,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  legalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  legalButtonPressed: {
    opacity: 0.7,
  },
  legalButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legalButtonText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
  },
  footer: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textLight,
    marginTop: 4,
  },
});
