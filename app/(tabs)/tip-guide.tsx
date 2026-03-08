import React, { useState } from "react";
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

interface ServiceExample {
  title: string;
  items: string[];
}

interface CategoryData {
  key: string;
  name: string;
  percentageInfo: string;
  briefDescription: string;
  color: string;
  bgColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
  characteristics: { heading: string; items: string[] }[];
  serviceExamples: ServiceExample[];
  keyDistinction: string;
}

const categories: CategoryData[] = [
  {
    key: "dissatisfied",
    name: "DISSATISFIED",
    percentageInfo: "Baseline - 3%",
    briefDescription:
      "Service that falls below expectations but isn't egregious enough to warrant no tip.",
    color: "#FF6B6B",
    bgColor: "#FFE5E5",
    iconName: "remove-circle-outline",
    characteristics: [
      {
        heading: "ATTENTIVENESS",
        items: [
          "Slow to acknowledge you or respond to requests",
          "Inattentive or distracted (on phone, chatting with coworkers)",
          "Had to ask multiple times for basic needs",
          "Ignored your requests or seemed bothered by them",
          "Never checked in to see if everything was okay",
        ],
      },
      {
        heading: "ACCURACY",
        items: [
          "Mistakes in orders or service that required correction",
          "Forgot items, brought wrong dishes, or made billing errors",
          "Got things wrong the first time and showed little concern",
          "Had to send food back or ask for corrections",
          "Incorrect information about products or services",
        ],
      },
      {
        heading: "ATTITUDE",
        items: [
          "Disinterested or unfriendly demeanor",
          "Borderline rude (not hostile, but clearly not engaged)",
          "Made you feel unwelcome or like an inconvenience",
          "Eye-rolling, sighing, or showing impatience",
          "No smile, no greeting, minimal interaction",
        ],
      },
      {
        heading: "CLEANLINESS/PRESENTATION",
        items: [
          "Below standard appearance or personal hygiene",
          "Messy workspace, dirty tools, or unkempt area",
          "Unprofessional presentation",
          "Dirty dishes, silverware, or linens at restaurant",
          "Stained uniforms or disheveled appearance",
        ],
      },
      {
        heading: "TIMELINESS",
        items: [
          "Unreasonably slow without explanation or apology",
          "Left you waiting excessively with no acknowledgment",
          "Poor time management (disappeared for long periods)",
          "Service took much longer than it should have",
          "No sense of urgency even when busy",
        ],
      },
      {
        heading: "KNOWLEDGE",
        items: [
          "Couldn't answer basic questions about menu, services, or products",
          "Seemed poorly trained or uninformed",
          "Provided incorrect information that affected your experience",
          "Had to ask someone else for help with simple questions",
          "Didn't know how to operate equipment or perform basic tasks",
        ],
      },
      {
        heading: "PROBLEM RESOLUTION",
        items: [
          "Didn't handle issues well when they arose",
          "Made no effort to fix problems or offer solutions",
          "Defensive or dismissive about mistakes",
          "Blamed you or someone else instead of taking responsibility",
          "No apology or acknowledgment of poor service",
        ],
      },
    ],
    serviceExamples: [
      {
        title: "RESTAURANT (SIT-DOWN)",
        items: [
          "Server took 15 minutes to greet you despite not being busy",
          "Forgot to bring drinks, had to remind them twice",
          "Brought wrong entree, acted annoyed when you mentioned it",
          "Never checked if food was okay after serving",
          "Had to flag down for check after waiting 20 minutes",
          "Was clearly rushing you out despite empty tables",
          "Got order details wrong (asked for no onions, came with onions)",
        ],
      },
      {
        title: "RESTAURANT (TAKE-OUT)",
        items: [
          "Order was missing items when you got home",
          "Food was cold or clearly sitting for a long time",
          "Person at counter was on phone and barely acknowledged you",
          "Quoted 20 minutes, took 45 with no explanation",
          "Didn't include utensils, napkins, or condiments requested",
          "Gave wrong order entirely",
        ],
      },
      {
        title: "HAIR SALON",
        items: [
          "Stylist kept you waiting 20+ minutes past appointment",
          "Was on phone during your service or talking to others",
          "Rushed through service, clearly wanted to move on",
          "Cut was uneven or not what you asked for",
          "Didn't ask questions about what you wanted",
          "Left you sitting with color on too long without checking",
          "Workspace was messy with hair clippings everywhere",
        ],
      },
      {
        title: "MANICURE/PEDICURE",
        items: [
          "Rushed through service, finished in half the usual time",
          "Nail polish was sloppy with polish on skin",
          "Didn't clean up cuticles properly or skipped steps",
          "Tools looked unclean or weren't sanitized in front of you",
          "Nails chipped within 24 hours",
          "Was having conversation with coworker in other language while working",
          "Hurt you (cut too deep, filed too hard) and didn't apologize",
        ],
      },
      {
        title: "MASSAGE/SPA",
        items: [
          "Kept interrupting massage to answer phone",
          "Pressure was wrong (too hard or too soft) despite you mentioning it",
          "Room was too cold/hot and they didn't adjust when asked",
          "Talked through most of the session when you wanted quiet",
          "Started late and didn't extend time to make up for it",
          "Rushed through, clearly watching the clock",
          "Used too much or too little product",
        ],
      },
      {
        title: "HOTEL & HOSPITALITY",
        items: [
          "Room wasn't ready at check-in time, had to wait with no explanation",
          "Room was dirty (unmade bed, trash not emptied, hair in bathroom)",
          "Requested items (extra towels, pillows) never arrived",
          "Staff was dismissive or rude at front desk",
          "Couldn't answer questions about hotel amenities or local area",
          "Made you feel like you were bothering them",
        ],
      },
      {
        title: "TRANSPORTATION (TAXI/RIDESHARE)",
        items: [
          "Driver was on phone entire ride",
          "Took obviously longer route to increase fare",
          "Drove recklessly or made you uncomfortable",
          "Car was dirty or smelled bad",
          "Refused to help with luggage",
          "Was unfriendly or dismissive",
        ],
      },
      {
        title: "DELIVERY (FOOD)",
        items: [
          "Delivered to wrong address and you had to track it down",
          "Food was cold, clearly sat in car for extended time",
          "Didn't follow delivery instructions (leave at door, ring bell)",
          "Was rude when handing off food",
          "Forgot items and didn't respond to messages",
        ],
      },
      {
        title: "BAR/BARTENDER",
        items: [
          "Ignored you for 10+ minutes despite not being busy",
          "Got your drink order wrong multiple times",
          "Was on phone or chatting with friends instead of serving",
          "Overcharged you and acted defensive when you questioned it",
          "Served drinks in dirty glasses",
          "Was clearly intoxicated themselves",
        ],
      },
      {
        title: "TOURS",
        items: [
          "Guide was late to start with no apology",
          "Couldn't hear them or they didn't project voice well",
          "Gave incorrect historical information",
          "Was on phone during tour or seemed disinterested",
          "Rushed through sites without allowing time for photos",
          "Didn't answer questions or got defensive",
        ],
      },
      {
        title: "MOVERS",
        items: [
          "Showed up hours late without communication",
          "Damaged furniture and didn't acknowledge it",
          "Were careless with belongings (dropping boxes, dragging furniture)",
          "Took excessive breaks or worked very slowly",
          "Asked for payment before job was complete",
          "Left mess behind (packaging materials, boxes)",
        ],
      },
      {
        title: "PERSONAL TRAINER",
        items: [
          "Showed up late or canceled last minute repeatedly",
          "Was on phone during your session",
          "Gave same routine every session with no progression",
          "Didn't spot you properly or pay attention to form",
          "Talked about themselves the entire time",
          "Didn't track your progress or set goals",
        ],
      },
    ],
    keyDistinction:
      "You're tipping at this level because the service was subpar but not so bad that you'd complain to management. It sends a message that improvement is needed.",
  },
  {
    key: "average",
    name: "AVERAGE",
    percentageInfo: "Top of Standard Range",
    briefDescription:
      "Service that meets or slightly exceeds standard expectations - what \"good service\" looks like.",
    color: "#4A4A4A",
    bgColor: "#F0F0F0",
    iconName: "checkmark-circle-outline",
    characteristics: [
      {
        heading: "ATTENTIVENESS",
        items: [
          "Checked in at appropriate times without being intrusive",
          "Responsive to requests without making you wait long",
          "Noticed and addressed your needs proactively",
          "Made eye contact and acknowledged you promptly",
          "Available when needed but not hovering",
        ],
      },
      {
        heading: "ACCURACY",
        items: [
          "Got everything right the first time",
          "No mistakes or corrections needed",
          "Delivered exactly what was requested",
          "Order was complete and prepared correctly",
          "Bill was accurate with no errors",
        ],
      },
      {
        heading: "ATTITUDE",
        items: [
          "Friendly and professional demeanor throughout",
          "Pleasant to interact with, genuine smile",
          "Made you feel welcomed and valued",
          "Polite and respectful communication",
          "Maintained positive energy even when busy",
        ],
      },
      {
        heading: "CLEANLINESS/PRESENTATION",
        items: [
          "Professional appearance and grooming",
          "Clean and organized workspace",
          "Proper hygiene and presentation standards",
          "Tools and equipment were clean and well-maintained",
          "Environment was tidy and inviting",
        ],
      },
      {
        heading: "TIMELINESS",
        items: [
          "Service delivered in reasonable timeframe",
          "No unnecessary delays or long waits",
          "Efficient use of time without rushing",
          "Kept you informed if there were any waits",
          "Respected your time and schedule",
        ],
      },
      {
        heading: "KNOWLEDGE",
        items: [
          "Could answer questions competently and accurately",
          "Made appropriate recommendations when asked",
          "Demonstrated good training and expertise",
          "Knew the menu, services, or products well",
          "Provided helpful information without being asked",
        ],
      },
      {
        heading: "PROBLEM RESOLUTION",
        items: [
          "If minor issues arose, handled them smoothly",
          "Professional and calm under pressure",
          "Resolved concerns appropriately and quickly",
          "Apologized when necessary",
          "Made reasonable efforts to make things right",
        ],
      },
    ],
    serviceExamples: [
      {
        title: "RESTAURANT (SIT-DOWN)",
        items: [
          "Greeted you within 2-3 minutes of being seated",
          "Took your order accurately, repeated it back to confirm",
          "Brought drinks promptly and refilled without asking",
          "Checked on you after food arrived to ensure everything was good",
          "Courses arrived at good pace, not too rushed or slow",
          "Cleared plates in a timely manner",
          "Processed check quickly when you were ready",
          "Was friendly and smiled genuinely",
          "Remembered dietary restrictions you mentioned",
          "Suggested popular items when you asked for recommendations",
        ],
      },
      {
        title: "RESTAURANT (TAKE-OUT)",
        items: [
          "Order was ready within quoted time",
          "Everything was packed properly and still hot",
          "All items, condiments, and utensils were included",
          "Person at counter was friendly and confirmed order",
          "Food quality matched dine-in standards",
          "Packaging was neat and secure for transport",
          "Receipt was accurate and easy to read",
        ],
      },
      {
        title: "HAIR SALON",
        items: [
          "Appointment started on time or within 5-10 minutes",
          "Asked questions about what you wanted and listened",
          "Made suggestions based on your hair type and face shape",
          "Checked in during service to make sure you were comfortable",
          "Cut/style matched what you discussed",
          "Workspace was clean and professional",
          "Used products appropriate for your hair",
          "Styled your hair at the end so you left looking good",
          "Gave you tips on maintaining the style at home",
        ],
      },
      {
        title: "MANICURE/PEDICURE",
        items: [
          "Appointment started on time",
          "Tools were sanitized in front of you or came from sealed package",
          "Asked about color preferences and shape",
          "Took their time and didn't rush",
          "Cleaned up cuticles properly and buffed nails evenly",
          "Polish application was neat and even",
          "Allowed proper drying time",
          "Massage during pedicure was relaxing and appropriate length",
          "Area was clean and comfortable",
        ],
      },
      {
        title: "MASSAGE/SPA",
        items: [
          "Started session on time with brief consultation",
          "Asked about pressure preferences and problem areas",
          "Room was comfortable temperature with calming atmosphere",
          "Maintained appropriate pressure throughout",
          "Used good quality products (oils, lotions)",
          "Respected your preference for quiet or conversation",
          "Full session time was provided (not cut short)",
          "Left you feeling relaxed and tension was relieved",
          "Offered water afterward",
        ],
      },
      {
        title: "HOTEL & HOSPITALITY",
        items: [
          "Check-in was smooth and efficient",
          "Room was clean, well-stocked, and ready on time",
          "Staff was friendly and answered questions",
          "Requested items were delivered promptly",
          "Concierge provided helpful local recommendations",
          "Issues (if any) were resolved quickly",
          "Housekeeping respected do-not-disturb signs",
          "Checkout process was quick and accurate",
        ],
      },
      {
        title: "TRANSPORTATION (TAXI/RIDESHARE)",
        items: [
          "Arrived on time and to correct location",
          "Car was clean and comfortable",
          "Driver was friendly and professional",
          "Took efficient route or asked your preference",
          "Drove safely and smoothly",
          "Helped with luggage if needed",
          "Respected your preference for conversation or quiet",
          "Got you to destination on time",
        ],
      },
      {
        title: "DELIVERY (FOOD)",
        items: [
          "Delivered within estimated time window",
          "Followed delivery instructions properly",
          "Food was still hot/cold as appropriate",
          "All items were included and packaged well",
          "Driver was polite and professional",
          "Contacted you if there were any issues",
          "Left order in requested location",
        ],
      },
      {
        title: "BAR/BARTENDER",
        items: [
          "Acknowledged you within a minute or two",
          "Made your drink correctly the first time",
          "Served appropriate portion sizes",
          "Was friendly and made brief pleasant conversation",
          "Kept bar area clean",
          "Processed payment accurately",
          "Suggested drinks when asked",
        ],
      },
      {
        title: "TOURS",
        items: [
          "Started on time with brief introduction",
          "Could hear guide clearly throughout tour",
          "Provided interesting and accurate information",
          "Answered questions knowledgeably",
          "Allowed appropriate time at each stop",
          "Kept group together without being overbearing",
          "Pace was comfortable for most of group",
          "Ended on time or close to it",
        ],
      },
      {
        title: "MOVERS",
        items: [
          "Arrived within scheduled time window",
          "Introduced themselves and walked through plan",
          "Moved items carefully without damage",
          "Worked steadily and efficiently",
          "Placed items where you directed",
          "Cleaned up after themselves",
          "Completed job in reasonable timeframe",
          "Final cost matched estimate",
        ],
      },
      {
        title: "PERSONAL TRAINER",
        items: [
          "Showed up on time and prepared",
          "Created varied workouts targeting your goals",
          "Demonstrated exercises properly and corrected form",
          "Pushed you appropriately without overdoing it",
          "Tracked your progress over time",
          "Answered questions about nutrition and technique",
          "Made sessions engaging and motivating",
          "Adjusted workouts based on how you felt that day",
        ],
      },
      {
        title: "MAKEUP ARTIST",
        items: [
          "Started appointment on time",
          "Listened to your preferences and event needs",
          "Used clean brushes and quality products",
          "Worked efficiently without rushing",
          "Makeup looked natural or as requested",
          "Explained what they were doing if you asked",
          "Provided tips for touch-ups during event",
          "You felt confident with the results",
        ],
      },
      {
        title: "TATTOO ARTIST",
        items: [
          "Arrived on time for appointment",
          "Design matched what you discussed in consultation",
          "Workspace was clean with sterile equipment",
          "Explained the process and aftercare",
          "Took breaks when needed and checked your comfort",
          "Executed design cleanly with good line work",
          "Bandaged properly and gave aftercare instructions",
          "Was professional and focused on quality",
        ],
      },
    ],
    keyDistinction:
      "This is what you EXPECT when you go somewhere. The service worker did their job well, was pleasant, and you left satisfied. No complaints, no wow moments - just solid, professional service.",
  },
  {
    key: "exceptional",
    name: "EXCEPTIONAL",
    percentageInfo: "Top of Range + 8%",
    briefDescription:
      "Service that goes above and beyond - creates a memorable experience.",
    color: "#2E8B57",
    bgColor: "#E8F5EE",
    iconName: "star",
    characteristics: [
      {
        heading: "ATTENTIVENESS",
        items: [
          "Anticipated your needs before you had to ask",
          "Remembered your preferences from previous visits",
          "Provided personalized attention throughout the entire service",
          "Made you feel like their only customer even when busy",
          "Noticed small details others would miss",
        ],
      },
      {
        heading: "ACCURACY",
        items: [
          "Perfect execution plus thoughtful extras you didn't expect",
          "Exceeded what was requested with relevant additions",
          "Attention to detail was exceptional and thorough",
          "Customized service based on your specific situation",
          "Everything was flawless from start to finish",
        ],
      },
      {
        heading: "ATTITUDE",
        items: [
          "Genuinely warm and engaging personality that felt authentic",
          "Made the experience enjoyable beyond just the service itself",
          "Created a personal connection that made you feel valued",
          "Showed real passion and enthusiasm for their work",
          "Made you laugh or smile, created positive energy",
        ],
      },
      {
        heading: "EXPERTISE",
        items: [
          "Demonstrated deep knowledge and mastery of their craft",
          "Provided expert recommendations that significantly enhanced your experience",
          "Shared insights, tips, or information you wouldn't have known",
          "Educated you without being condescending",
          "Their skill level was noticeably above standard",
        ],
      },
      {
        heading: "PERSONAL TOUCH",
        items: [
          "Remembered your name and used it naturally",
          "Made meaningful conversation that felt genuine",
          "Treated you like a valued individual, not just a transaction",
          "Shared relevant personal stories or experiences",
          "Made you feel like a friend, not just a customer",
        ],
      },
      {
        heading: "PROBLEM SOLVING",
        items: [
          "Not only fixed issues but went above and beyond to make things right",
          "Offered unexpected compensation or gestures for problems",
          "Turned a potential negative into a memorable positive",
          "Creative solutions that exceeded expectations",
          "Took personal ownership of ensuring your satisfaction",
        ],
      },
      {
        heading: "EXTRA MILE",
        items: [
          "Did things they absolutely didn't have to do",
          "Helped with something completely outside their role",
          "Stayed late or came in early to accommodate you",
          "Gave valuable advice, recommendations, or resources",
          "Made an effort that clearly went beyond their job description",
          "Followed up after service to ensure satisfaction",
        ],
      },
    ],
    serviceExamples: [
      {
        title: "RESTAURANT (SIT-DOWN)",
        items: [
          "Server remembered you from a previous visit months ago and your drink preference",
          "Made perfect wine pairing recommendations that elevated the meal",
          "Noticed you celebrating and brought complimentary dessert with candle",
          "Split your dish in the kitchen without being asked, plated beautifully on separate plates",
          "Timed courses perfectly, never rushed but never left you waiting",
          "Shared genuine enthusiasm about the food, described dishes with passion",
          "Noticed dietary restriction on one person's order and proactively checked all courses",
          "Recommended a dish not on menu that the chef could make special",
          "Stayed late to ensure your party had time to finish conversation",
          "Gave you a recipe card for a dish you loved",
          "Comped something small after a minor issue, even though you didn't complain",
        ],
      },
      {
        title: "RESTAURANT (TAKE-OUT)",
        items: [
          "Added extra sauce packets without being asked because you always order extra",
          "Included a handwritten note with preparation/reheating instructions",
          "Called to let you know one item would be delayed and offered alternative",
          "Threw in free appetizer or dessert as thank you for being regular customer",
          "Packed items strategically so everything stayed at proper temperature",
          "Added disposable utensils, napkins, and condiments plus extras",
          "Remembered your past orders and suggested new items you might like",
        ],
      },
      {
        title: "HAIR SALON",
        items: [
          "Spent extra time perfecting the details, making sure every angle looked great",
          "Gave you specific styling tips for your hair type to use at home",
          "Remembered your preferences from months ago without having to ask",
          "Noticed your hair texture had changed and adjusted technique accordingly",
          "Offered scalp massage during shampoo without extra charge",
          "Showed you how to style it yourself with your own tools",
          "Fixed a small unevenness they noticed even after you said it looked good",
          "Suggested products but didn't push sales, genuinely wanted to help",
          "Accommodated your tight schedule by staying late",
          "Texted you few days later to check how the style was holding up",
        ],
      },
      {
        title: "MANICURE/PEDICURE",
        items: [
          "Remembered your color preferences from previous visit",
          "Suggested new nail shape that would be more flattering",
          "Took extra time on cuticle care and made nails look healthier",
          "Applied polish in thin, perfect coats that lasted 2+ weeks",
          "Gave hand/foot massage that was longer and more therapeutic than standard",
          "Offered refreshments (tea, water, snacks) without being asked",
          "Shared tips for maintaining nails between appointments",
          "Fixed a chip free of charge when you came back days later",
          "Recommended home care products but didn't pressure purchase",
        ],
      },
      {
        title: "MASSAGE/SPA",
        items: [
          "Customized entire session based on detailed consultation about problem areas",
          "Remembered your pressure preference from previous visit",
          "Adjusted technique based on your body's response during session",
          "Incorporated stretching or targeted work on problem areas",
          "Extended session by 10-15 minutes to finish properly",
          "Created perfect ambiance (temperature, music, lighting) without having to ask",
          "Gave you specific stretches to do at home for your particular issues",
          "Followed up with you about how you felt the next day",
          "Provided time to relax after session rather than rushing you out",
        ],
      },
      {
        title: "HOTEL & HOSPITALITY",
        items: [
          "Upgraded your room without being asked when they noticed you were celebrating",
          "Remembered your name throughout your stay and used it naturally",
          "Provided local restaurant recommendations based on your preferences",
          "Arranged dinner reservation for you at a hard-to-book restaurant",
          "Sent complimentary bottle of wine/champagne to room",
          "Handled a problem room issue and moved you to better room immediately",
          "Gave you late checkout without charging when you mentioned early flight next day",
          "Concierge printed boarding passes and called you a cab without prompting",
          "Left handwritten welcome note in room",
          "Remembered you had food allergies and ensured breakfast accommodated",
        ],
      },
      {
        title: "TRANSPORTATION (TAXI/RIDESHARE)",
        items: [
          "Offered phone charger and water without being asked",
          "Suggested better route based on current traffic and asked your preference",
          "Played music you'd enjoy based on brief conversation",
          "Helped carry bags to door, not just curb",
          "Gave excellent local recommendations for your destination",
          "Made great conversation but also read when you wanted quiet",
          "Car was spotlessly clean with air freshener that wasn't overpowering",
          "Drove smoothly (no harsh braking, accelerating)",
          "Waited for you when you said you'd only be a minute",
        ],
      },
      {
        title: "DELIVERY (FOOD)",
        items: [
          "Called ahead to confirm delivery instructions",
          "Sent photo showing food was delivered safely",
          "Brought order to your door instead of leaving at building entrance",
          "Waited to ensure you received it (elderly, mobility issues)",
          "Included extra napkins, utensils, condiments",
          "Protected food from rain with extra covering",
          "Arrived earlier than estimated time",
          "Followed complex delivery instructions perfectly",
        ],
      },
      {
        title: "BAR/BARTENDER",
        items: [
          "Remembered your drink from earlier in the evening or previous visit",
          "Made a custom cocktail based on flavors you mentioned liking",
          "Gave you genuine recommendations based on your taste, not most expensive",
          "Made conversation that was engaging and fun",
          "Sent over a round on the house",
          "Noticed you liked a particular garnish and added extra",
          "Paced your drinks appropriately, watching out for you",
          "Made sure you had water throughout the evening",
          "Called you a ride home when needed",
        ],
      },
      {
        title: "TOURS",
        items: [
          "Shared fascinating stories and details far beyond the standard script",
          "Took great photos for your group at perfect spots",
          "Adjusted route based on group's interests and energy level",
          "Recommended hidden gems and local spots tourists don't know about",
          "Stayed after official tour end to answer questions",
          "Helped you book reservations for dinner that evening",
          "Accommodated someone with mobility issues without making them feel burdensome",
          "Brought extra water on hot day",
          "Shared their personal contact for future questions about the area",
        ],
      },
      {
        title: "MOVERS",
        items: [
          "Arrived early and worked efficiently to finish ahead of schedule",
          "Wrapped furniture in extra protective padding beyond standard",
          "Assembled furniture and placed everything exactly where you wanted",
          "Noticed a scratch on furniture and touched it up on the spot",
          "Took extra care with fragile items and labeled boxes clearly",
          "Cleaned up completely, swept up any debris",
          "Didn't charge for extra time even though it went slightly over",
          "Came back next day to help with one more heavy item for free",
        ],
      },
      {
        title: "PERSONAL TRAINER",
        items: [
          "Created completely customized program for your specific goals and limitations",
          "Researched new exercises specifically for your injury history",
          "Sent you workouts you could do when traveling or on off days",
          "Checked in between sessions to see how you were feeling",
          "Celebrated your victories and milestones enthusiastically",
          "Adjusted entire workout based on how you felt that day",
          "Gave detailed nutrition advice beyond just basic guidelines",
          "Stayed late to help you achieve proper form on a difficult exercise",
          "Tracked your progress meticulously and showed you measurable improvements",
          "Responded to texts with questions even on their days off",
        ],
      },
      {
        title: "MAKEUP ARTIST",
        items: [
          "Did trial run before big event to perfect the look",
          "Brought backup products in case you had reaction",
          "Customized colors specifically for your skin tone and dress",
          "Taught you techniques while doing your makeup",
          "Created look that lasted entire event without touch-ups",
          "Took photos throughout to document the look for you",
          "Gave you touch-up kit with specific products used",
          "Followed up to see how makeup held up during event",
          "Offered to adjust anything at no charge if you weren't satisfied",
          "Stayed late to help bridesmaids or family too",
        ],
      },
      {
        title: "TATTOO ARTIST",
        items: [
          "Redesigned concept multiple times until it was perfect",
          "Suggested placement that would age better and look more flattering",
          "Took extra breaks to ensure you were comfortable",
          "Line work was incredibly precise and shading was flawless",
          "Gave you extremely detailed aftercare instructions and their cell number for questions",
          "Checked in with you throughout healing process",
          "Touched up a tiny spot free of charge months later",
          "Made you feel comfortable if it was your first tattoo",
          "Created something better than you even imagined",
        ],
      },
    ],
    keyDistinction:
      'You leave thinking "WOW, THAT WAS INCREDIBLE!" The service worker made the experience notably better than expected and left a lasting positive impression.',
  },
];

function ServiceExampleAccordion({ example, accentColor }: { example: ServiceExample; accentColor: string }) {
  const [open, setOpen] = useState(false);
  const chevronRotation = useSharedValue(0);

  const chevronAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const toggle = () => {
    const next = !open;
    setOpen(next);
    chevronRotation.value = withTiming(next ? 90 : 0, { duration: 200 });
  };

  return (
    <View style={styles.serviceExampleBlock}>
      <Pressable onPress={toggle} style={styles.serviceExampleHeader}>
        <Animated.View style={chevronAnimStyle}>
          <Ionicons name="chevron-forward" size={16} color={accentColor} />
        </Animated.View>
        <Text style={[styles.serviceExampleTitle, { color: accentColor }]}>{example.title}</Text>
      </Pressable>
      {open && (
        <View style={styles.serviceExampleItems}>
          {example.items.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>{"\u2022"}</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function AccordionSection({ category }: { category: CategoryData }) {
  const [expanded, setExpanded] = useState(false);
  const rotation = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    rotation.value = withTiming(next ? 180 : 0, { duration: 250 });
  };

  return (
    <View style={[styles.categoryCard, { borderLeftColor: category.color, borderLeftWidth: 4 }]}>
      <Pressable onPress={toggleExpand} style={styles.categoryHeader}>
        <View style={[styles.iconBadge, { backgroundColor: category.bgColor }]}>
          <Ionicons name={category.iconName} size={22} color={category.color} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.percentageInfo}>{category.percentageInfo}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color="#636E72" />
        </Animated.View>
      </Pressable>

      <Text style={styles.briefDescription}>{category.briefDescription}</Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          <Text style={styles.useThisWhen}>USE THIS CATEGORY WHEN:</Text>

          {category.characteristics.map((char, idx) => (
            <View key={idx} style={styles.characteristicBlock}>
              <Text style={styles.characteristicHeading}>{char.heading}</Text>
              {char.items.map((item, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bullet}>{"\u2022"}</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.examplesDivider} />
          <Text style={styles.examplesHeader}>REAL-WORLD EXAMPLES BY SERVICE TYPE:</Text>
          <Text style={styles.examplesSubtext}>Tap a service type to see examples</Text>

          {category.serviceExamples.map((example, idx) => (
            <ServiceExampleAccordion key={idx} example={example} accentColor={category.color} />
          ))}

          <View style={[styles.keyDistinctionBox, { backgroundColor: category.bgColor }]}>
            <Text style={styles.keyDistinctionLabel}>KEY DISTINCTION:</Text>
            <Text style={styles.keyDistinctionText}>{category.keyDistinction}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function TipGuideScreen() {
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
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>Understanding Tip Categories</Text>
          <Text style={styles.screenSubtitle}>Choose the right tip based on service quality</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.introHeading}>HOW TO CHOOSE YOUR TIP</Text>
          <Text style={styles.introText}>
            Tip Zombie calculates three tip amounts based on the quality of service you received.
            Use this guide to determine which category best matches your experience.
          </Text>
          <Text style={styles.introText}>
            Your selection helps service workers understand how they performed and encourages
            excellent service in the future.
          </Text>
        </View>

        {categories.map((cat) => (
          <AccordionSection key={cat.key} category={cat} />
        ))}

        <Pressable
          style={styles.calculateButton}
          onPress={() => router.navigate("/(tabs)/")}
        >
          <Text style={styles.calculateButtonText}>Ready to Calculate?</Text>
          <Ionicons name="calculator-outline" size={20} color={Colors.white} />
        </Pressable>
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
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#2D3436",
  },
  screenSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#636E72",
    marginTop: 4,
  },
  introSection: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  introHeading: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#2D3436",
    marginBottom: 10,
  },
  introText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#2D3436",
    lineHeight: 22,
    marginBottom: 8,
  },
  categoryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#2D3436",
  },
  percentageInfo: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#636E72",
    marginTop: 2,
  },
  briefDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#2D3436",
    lineHeight: 22,
    marginTop: 10,
  },
  expandedContent: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#DFE6E9",
    marginBottom: 14,
  },
  useThisWhen: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#2D3436",
    marginBottom: 14,
  },
  characteristicBlock: {
    marginBottom: 14,
  },
  characteristicHeading: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#636E72",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: "row",
    paddingRight: 8,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    color: "#2D3436",
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#2D3436",
    lineHeight: 20,
    flex: 1,
  },
  examplesDivider: {
    height: 2,
    backgroundColor: "#DFE6E9",
    marginVertical: 16,
  },
  examplesHeader: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#2D3436",
    marginBottom: 14,
  },
  examplesSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#636E72",
    fontStyle: "italic",
    marginBottom: 12,
    marginTop: -6,
  },
  serviceExampleBlock: {
    marginBottom: 6,
  },
  serviceExampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 8,
  },
  serviceExampleTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  serviceExampleItems: {
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  keyDistinctionBox: {
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  keyDistinctionLabel: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#2D3436",
    marginBottom: 6,
  },
  keyDistinctionText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#2D3436",
    lineHeight: 22,
    fontStyle: "italic",
  },
  calculateButton: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
});
