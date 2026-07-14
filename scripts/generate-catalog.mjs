import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We define raw catalog families and auto-expand them.
const families = [
  // --- LIFTVERTER ---
  {
    family: "Liftverter",
    category: "inverter",
    subcategory: "Liftverter",
    image: "", // empty as requested if unavailable
    baseTags: ["liftverter", "industrial", "lift", "3-phase", "regenerative"],
    features: [
      "Break-free transfer from mains to inverter mode",
      "Grid synchronized for regenerative power",
      "MODBUS communication protocol for remote monitoring",
      "Suitable for regenerative drive applications",
      "Eliminates the need for return energy dump circuits"
    ],
    models: [
      { name: "Liftverter 5", capacity: "6.6KVA / 5.25kW", voltage: "48V", motor: "~5 HP" },
      { name: "Liftverter 5.5", capacity: "6.6KVA / 5.25kW", voltage: "72V", motor: "~5 HP" },
      { name: "Liftverter 8", capacity: "10.1KVA / 8kW", voltage: "120V", motor: "~8 HP" },
      { name: "Liftverter 12", capacity: "13.1KVA / 10.5KW", voltage: "180V", motor: "~12 HP" },
      { name: "Liftverter 15", capacity: "17.5KVA / 14KW", voltage: "240V", motor: "~15 HP" },
      { name: "Liftverter 20", capacity: "26KVA / 21KW", voltage: "240V", motor: "~20 HP" },
      { name: "Liftverter 30", capacity: "35KVA / 28kW", voltage: "360V", motor: "~30 HP" },
    ]
  },
  // --- HOME INVERTERS ---
  {
    family: "Li-ON",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "lithium-ion", "in-built-battery"],
    features: ["In-built Lithium-ion battery", "3X Faster charging", "3X Longer life", "Premium battery cabinet", "Sinewave technology"],
    models: [
      { name: "Li-On 1250", capacity: "1100VA / 880W", voltage: "12V" }
    ]
  },
  {
    family: "Icon",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "pure-sine-wave", "compact"],
    features: ["Pure Sinewave technology", "Premium cabinet with wheel", "Safe - No open wires", "Mains MCB protection"],
    models: [
      { name: "Icon 1100", capacity: "900VA / 756W", voltage: "12V" },
      { name: "Icon 1600", capacity: "1400VA / 1176W", voltage: "12V" }
    ]
  },
  {
    family: "EVO D",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "square-wave"],
    features: ["Modified square wave technology", "Tri color LED glows as per battery charging", "Charges at low voltage", "Advanced efficiency SR technology"],
    models: [
      { name: "EVO D 700", capacity: "600VA / 504W", voltage: "12V" },
      { name: "EVO D 800", capacity: "700VA / 588W", voltage: "12V" },
      { name: "EVO D 900", capacity: "800VA / 672W", voltage: "12V" },
      { name: "EVO D 1050", capacity: "900VA / 756W", voltage: "12V" },
      { name: "EVO D 1250", capacity: "1100VA / 924W", voltage: "12V" },
      { name: "EVO D 1650", capacity: "1500VA / 1260W", voltage: "24V" },
      { name: "EVO D 2300", capacity: "2000VA / 1680W", voltage: "24V" },
    ]
  },
  {
    family: "Eco Watt Neo",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "square-wave"],
    features: ["Modified square wave technology", "Faster battery charging", "Reliable long-lasting performance", "Supports flat, tubular & local battery"],
    models: [
      { name: "Eco Watt Neo 700", capacity: "600VA / 504W", voltage: "12V" },
      { name: "Eco Watt Neo 800", capacity: "700VA / 588W", voltage: "12V" },
      { name: "Eco Watt Neo 900", capacity: "800VA / 672W", voltage: "12V" },
      { name: "Eco Watt Neo 1050", capacity: "900VA / 756W", voltage: "12V" },
      { name: "Eco Watt Neo 1250 Pro", capacity: "1100VA / 924W", voltage: "12V" },
      { name: "Eco Watt Neo 1650", capacity: "1500VA / 1260W", voltage: "24V" },
      { name: "Eco Watt Neo 2300", capacity: "2000VA / 1680W", voltage: "24V" },
    ]
  },
  {
    family: "EVO S",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "pure-sine-wave"],
    features: ["Silent performance sine wave technology", "Tri color LED", "Charges at low voltage", "Advanced efficiency SR technology"],
    models: [
      { name: "EVO S 750", capacity: "650VA / 504W", voltage: "12V" },
      { name: "EVO S 850", capacity: "700VA / 560W", voltage: "12V" },
      { name: "EVO S 1050", capacity: "900VA / 756W", voltage: "12V" },
      { name: "EVO S 1250", capacity: "1100VA / 924W", voltage: "12V" },
      { name: "EVO S 1550", capacity: "1400VA / 1176W", voltage: "12V" },
      { name: "EVO S 1650", capacity: "1500VA / 1260W", voltage: "24V" },
      { name: "EVO S 2300", capacity: "2000VA / 1600W", voltage: "24V" },
    ]
  },
  {
    family: "Eco Volt Neo",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "pure-sine-wave"],
    features: ["Sine wave technology", "Express battery charging starts from 95V", "Safe for appliances", "Reliable long-lasting performance"],
    models: [
      { name: "Eco Volt Neo 750", capacity: "650VA / 504W", voltage: "12V" },
      { name: "Eco Volt Neo 850", capacity: "700VA / 560W", voltage: "12V" },
      { name: "Eco Volt Neo 1050", capacity: "900VA / 756W", voltage: "12V" },
      { name: "Eco Volt Neo 1250+", capacity: "1100VA / 924W", voltage: "12V" },
      { name: "Eco Volt Neo 1550", capacity: "1400VA / 1176W", voltage: "12V" },
      { name: "Eco Volt Neo 1650", capacity: "1500VA / 1260W", voltage: "24V" },
      { name: "Eco Volt Neo 2300", capacity: "2000VA / 1680W", voltage: "24V" },
    ]
  },
  {
    family: "Zelio S",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "pure-sine-wave", "intelligent"],
    features: ["Sine wave technology", "Tri color LED", "Longer battery life ABCC technology", "Charges at low voltage"],
    models: [
      { name: "Zelio S 1150", capacity: "900VA / 756W", voltage: "12V" },
      { name: "Zelio S 1250", capacity: "1100VA / 926W", voltage: "12V" },
      { name: "Zelio S 1550", capacity: "1400VA / 1176W", voltage: "12V" },
    ]
  },
  {
    family: "Zelio Smart",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "pure-sine-wave", "intelligent", "bluetooth"],
    features: ["Sine wave technology", "Elegant & premium design", "Protection through MCB", "Mains by-pass switch", "Bluetooth connectivity"],
    models: [
      { name: "Zelio Smart 1100", capacity: "900VA / 756W", voltage: "12V" }
    ]
  },
  {
    family: "Shakti Charge Neo Pro",
    category: "inverter",
    subcategory: "Home Inverters",
    image: "",
    baseTags: ["home-ups", "fast-charging"],
    features: ["Modified square wave", "Low voltage fast charging technology", "Runs heavy load on single battery", "Express battery charging starts from 90V"],
    models: [
      { name: "Shakti Charge Neo 1150 Pro", capacity: "900VA / 756W", voltage: "12V" },
      { name: "Shakti Charge Neo 1450 Pro", capacity: "1100VA / 924W", voltage: "12V" },
      { name: "Shakti Charge Neo 1750 Pro", capacity: "1500VA / 1260W", voltage: "12V" },
    ]
  },
  // --- HIGH CAPACITY INVERTERS ---
  {
    family: "Optimus",
    category: "inverter",
    subcategory: "High Capacity Inverters",
    image: "",
    baseTags: ["commercial", "high-capacity", "pure-sine-wave"],
    features: ["Sine wave technology", "Back-up time & battery charging time display", "Output voltage control 200V-240V", "Mains MCB protection"],
    models: [
      { name: "Optimus 1250+", capacity: "1100VA / 924W", voltage: "12V" },
      { name: "Optimus 2300+", capacity: "2000VA / 1600W", voltage: "24V" },
      { name: "Optimus 2800+", capacity: "2500VA / 2000W", voltage: "24V" },
      { name: "Optimus 3500+", capacity: "3000VA / 2400W", voltage: "24V" },
      { name: "Optimus 3800+", capacity: "3500VA / 2800W", voltage: "36V" },
      { name: "Optimus 4300+", capacity: "4000VA / 3200W", voltage: "36V" },
      { name: "Optimus 6000+", capacity: "5000VA / 4000W", voltage: "48V" },
      { name: "Optimus 8000+", capacity: "7500VA / 6000W", voltage: "96V" },
      { name: "Optimus 11000+", capacity: "10000VA / 8000W", voltage: "120V" },
    ]
  },
  {
    family: "Optimus 3P",
    category: "inverter",
    subcategory: "3 Phase High Capacity Inverters",
    image: "",
    baseTags: ["3-phase", "commercial", "industrial", "pure-sine-wave"],
    features: ["Back-up time & battery charging time display", "MCB protection", "3 Phase In 3 Phase Out", "Mains by-pass"],
    models: [
      { name: "Optimus 3P 10.5 KVA", capacity: "10.5 KVA", voltage: "120V" },
      { name: "Optimus 3P 15 KVA", capacity: "15 KVA", voltage: "180V" },
      { name: "Optimus 3P 20-25 KVA", capacity: "20-25 KVA", voltage: "240V" },
      { name: "Optimus 3P 30-50 KVA", capacity: "30-50 KVA", voltage: "360V" },
      { name: "Optimus 3P 60-80 KVA", capacity: "60-80 KVA", voltage: "360V" },
      { name: "Optimus 3P 105-150 KVA", capacity: "105-150 KVA", voltage: "480V" },
      { name: "Optimus 3P 200-250 KVA", capacity: "200-250 KVA", voltage: "672V" },
    ]
  },
  // --- INVERTER BATTERIES ---
  {
    family: "Ultra Charge",
    category: "battery",
    subcategory: "Inverter Batteries",
    image: "",
    baseTags: ["tall-tubular", "premium", "battery"],
    features: ["Made with high-grade materials", "Novel sealed container design", "Highest testing standards", "Spill proof tray"],
    models: [
      { name: "Ultra Charge UCTT 18066", capacity: "150 Ah", warranty: "42+24 Months" },
      { name: "Ultra Charge UCTT 24066", capacity: "180 Ah", warranty: "42+24 Months" },
      { name: "Ultra Charge UCTT 25066", capacity: "200 Ah", warranty: "42+24 Months" },
      { name: "Ultra Charge UCTT 25072", capacity: "200 Ah", warranty: "48+24 Months" },
      { name: "Ultra Charge UCTT 26066", capacity: "220 Ah", warranty: "42+24 Months" },
      { name: "Ultra Charge UCTT 28066", capacity: "250 Ah", warranty: "42+24 Months" },
      { name: "Ultra Charge UCTT 29072", capacity: "260 Ah", warranty: "48+24 Months" },
    ]
  },
  {
    family: "Inverlast",
    category: "battery",
    subcategory: "Inverter Batteries",
    image: "",
    baseTags: ["tall-tubular", "battery", "rugged"],
    features: ["Tall tubular technology", "Rugged container", "Long life", "Fast charging"],
    models: [
      { name: "Inverlast ILTT 18060 Pro", capacity: "150 Ah", warranty: "36+24 Months" },
      { name: "Inverlast ILTT 20060", capacity: "160 Ah", warranty: "30+30 Months" },
      { name: "Inverlast ILTT 20066", capacity: "160 Ah", warranty: "36+30 Months" },
      { name: "Inverlast ILTT 24060", capacity: "180 Ah", warranty: "36+24 Months" },
      { name: "Inverlast ILTT 25060", capacity: "200 Ah", warranty: "36+24 Months" },
      { name: "Inverlast ILTT 26060", capacity: "220 Ah", warranty: "36+24 Months" },
      { name: "Inverlast ILTT 28060", capacity: "250 Ah", warranty: "36+24 Months" },
      { name: "Inverlast ILTT 32060", capacity: "300 Ah", warranty: "36+24 Months" }, // Power of 2-in-1
    ]
  },
  {
    family: "Shakti Charge Life-Max",
    category: "battery",
    subcategory: "Inverter Batteries",
    image: "",
    baseTags: ["tall-tubular", "battery", "fast-charging"],
    features: ["Smart tall tubular technology", "Low water top up frequency", "Fast charging", "Long life"],
    models: [
      { name: "Shakti Charge SC 18060", capacity: "150 Ah", warranty: "36+24 Months" },
      { name: "Shakti Charge LM 18075", capacity: "150 Ah", warranty: "60+15 Months" },
    ]
  },
  {
    family: "Red Charge",
    category: "battery",
    subcategory: "Inverter Batteries",
    image: "",
    baseTags: ["tubular", "battery", "affordable"],
    features: ["Superior technology", "Enhanced performance", "High power backup", "Low maintenance"],
    models: [
      { name: "Red Charge RC 15000 Pro", capacity: "120 Ah" },
      { name: "Red Charge RC 16000 Pro", capacity: "135 Ah" },
      { name: "Red Charge RC 18000ST Pro", capacity: "150 Ah" },
      { name: "Red Charge RC 18000 Pro", capacity: "150 Ah" },
      { name: "Red Charge RC 24000 Pro", capacity: "180 Ah" },
      { name: "Red Charge RC 25000 Pro", capacity: "200 Ah" },
      { name: "Red Charge RC 26000 Pro", capacity: "220 Ah" },
    ]
  },
  // --- E-RICKSHAW BATTERIES ---
  {
    family: "Cruze",
    category: "battery",
    subcategory: "E-Rickshaw Batteries",
    image: "",
    baseTags: ["e-rickshaw", "lithium-ion", "mobility"],
    features: ["Faster charging 0 to 80% in 2 hours", "Designed for Indian roads with vibration dampening", "Smart thermal management"],
    models: [
      { name: "Cruze LM 51CRZ105", capacity: "105 Ah / 51.2V" },
      { name: "Cruze LM 51CRZ105+", capacity: "105 Ah / 51.2V" },
      { name: "Cruze LM 51CRZ105 Pro", capacity: "105 Ah / 51.2V" },
    ]
  },
  {
    family: "Rick Power+",
    category: "battery",
    subcategory: "E-Rickshaw Batteries",
    image: "",
    baseTags: ["e-rickshaw", "mobility"],
    features: ["Maximum mileage", "Low maintenance", "Low electricity consumption"],
    models: [
      { name: "Rick Power+ RP 13009", capacity: "130 Ah", warranty: "9 Months" },
      { name: "Rick Power+ RP 13512", capacity: "135 Ah", warranty: "12 Months" },
      { name: "Rick Power+ RP 14012", capacity: "140 Ah", warranty: "12 Months" },
    ]
  },
  
  // --- SOLAR PANELS ---
  {
    family: "TOPCON Bifacial",
    category: "solar",
    subcategory: "Solar Panels",
    image: "",
    baseTags: ["solar-panel", "topcon", "bifacial"],
    features: ["Premium Grade A Cells", "Excellent power generation under low light", "Anti-reflection coating", "PID Free", "UNSW Specified Cell Qualification"],
    models: [
      { name: "TOPCON Bifacial 575W", power: "575W" },
      { name: "TOPCON Bifacial 580W", power: "580W" },
      { name: "TOPCON Bifacial 585W", power: "585W" },
      { name: "TOPCON Bifacial 590W", power: "590W" },
      { name: "TOPCON Bifacial 595W", power: "595W" },
    ]
  },
  {
    family: "Mono PERC Half Cut",
    category: "solar",
    subcategory: "Solar Panels",
    image: "",
    baseTags: ["solar-panel", "mono-perc", "dcr"],
    features: ["Premium Grade A Cells", "Excellent power generation under low light", "Anti-reflection coating", "PID Free", "UNSW Specified Cell Qualification"],
    models: [
      { name: "Mono PERC Half Cut 540W", power: "540W" },
      { name: "Mono PERC Half Cut 545W", power: "545W" },
      { name: "Mono PERC Half Cut 550W", power: "550W" },
    ]
  },
  {
    family: "Polycrystalline",
    category: "solar",
    subcategory: "Solar Panels",
    image: "",
    baseTags: ["solar-panel", "poly"],
    features: ["Premium Grade A Cells", "Excellent power generation under low light", "Anti-reflection coating", "PID Free", "UNSW Specified Cell Qualification"],
    models: [
      { name: "Polycrystalline LUM 12170P", power: "170Wp" },
    ]
  },
  // --- SOLAR INVERTERS / GRID-TIE / HYBRID ---
  {
    family: "NXG Inverters",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "nxg", "pwm"],
    features: ["Customisable saving modes", "Max capacity utilization", "Intelligent load sharing", "Powerful charging on low voltage", "Informative LCD display"],
    models: [
      { name: "NXG 850e", capacity: "500VA", voltage: "12V", chargeController: "PWM 30A" },
      { name: "NXG 1150e", capacity: "850VA", voltage: "12V", chargeController: "PWM 50A" },
      { name: "NXG 1450e", capacity: "1100VA", voltage: "12V", chargeController: "PWM 60A" },
      { name: "NXG 1850e", capacity: "1500VA", voltage: "24V", chargeController: "PWM 40A" },
      { name: "NXG 2350", capacity: "2000VA", voltage: "24V", chargeController: "PWM 55A" },
    ]
  },
  {
    family: "NXG PRO",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "nxg-pro", "mppt"],
    features: ["Customisable saving modes", "Max capacity utilization", "Compatible with 12V & 24V solar panels", "Powerful charging on low voltage", "Informative LCD display"],
    models: [
      { name: "NXG PRO 1KVA/12V", capacity: "1 kVA", voltage: "12V", chargeController: "MPPT" },
      { name: "NXG PRO 1KVA/24V", capacity: "1 kVA", voltage: "24V", chargeController: "MPPT" },
    ]
  },
  {
    family: "Solarverter PRO PCU",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "pcu", "mppt"],
    features: ["Maximum power point tracking", "User-friendly LCD display", "Guaranteed safety", "Remote monitoring", "Smart solar optimization"],
    models: [
      { name: "Solarverter PRO 2KVA eco", capacity: "2kVA", voltage: "24V" },
      { name: "Solarverter PRO 3KVA eco", capacity: "3kVA", voltage: "36V" },
      { name: "Solarverter PRO 3.5KVA", capacity: "3.5kVA", voltage: "48V" },
      { name: "Solarverter PRO 5KVA", capacity: "5kVA", voltage: "48V" },
      { name: "Solarverter PRO 6KVA", capacity: "6kVA", voltage: "96V" },
      { name: "Solarverter PRO 7.5KVA eco", capacity: "7.5kVA", voltage: "96V" },
      { name: "Solarverter PRO 10.1KVA eco", capacity: "10.1kVA", voltage: "120V" },
    ]
  },
  {
    family: "Solar NXE",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "nxe", "pwm"],
    features: ["User settable saving modes", "Max PV capacity utilization", "Multicolor LCD display", "BIS Certified", "Smart solar optimization"],
    models: [
      { name: "Solar NXE 5KVA", capacity: "5KVA", voltage: "48V" },
    ]
  },
  {
    family: "Solar NXE PRO",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "nxe-pro", "mppt"],
    features: ["MPPT maximum power point tracking", "User settable saving modes", "Max PV capacity utilization", "Multicolor LCD display", "Smart solar optimization"],
    models: [
      { name: "Solar NXE PRO 15KVA", capacity: "15KVA", voltage: "240V" },
    ]
  },
  {
    family: "NXP 3500",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "nxp", "pwm"],
    features: ["Customisable saving modes", "Guaranteed safety", "User-friendly LCD display", "Smart solar optimization"],
    models: [
      { name: "NXP 3500", capacity: "3000VA", voltage: "24V" },
    ]
  },
  {
    family: "NXP PRO 3500",
    category: "solar",
    subcategory: "Solar Inverters",
    image: "",
    baseTags: ["solar", "nxp-pro", "mppt"],
    features: ["MPPT Maximum Power Point Tracking", "Customisable saving modes", "User-friendly LCD display", "Smart solar optimization"],
    models: [
      { name: "NXP PRO 3500", capacity: "3000VA", voltage: "24V" },
    ]
  },
  {
    family: "Grid Tie Inverters - NXi T",
    category: "solar",
    subcategory: "Grid-Tie Inverters",
    image: "",
    baseTags: ["solar", "grid-tie", "gti", "mppt"],
    features: ["Maximum power point tracking", "Anti-islanding protection", "Inbox Wi-Fi dongle", "Up to 150% DC overloading", "Remote monitoring"],
    models: [
      { name: "NXi T130", capacity: "3 kW", phase: "Single Phase" },
      { name: "NXi T150", capacity: "5 kW", phase: "Single Phase" },
      { name: "NXi T310", capacity: "10 kW", phase: "Single Phase" },
    ]
  },
  {
    family: "Hybrid TX",
    category: "solar",
    subcategory: "Hybrid Inverters",
    image: "",
    baseTags: ["solar", "hybrid", "mppt"],
    features: ["Advanced DSP Control", "Inbox Wi-Fi dongle", "Export excess power", "Max PV capacity utilization", "Anti-islanding protection", "Energy independence"],
    models: [
      { name: "Hybrid TX 3kVA", capacity: "3 kVA" },
      { name: "Hybrid TX 4kVA", capacity: "4 kVA" },
      { name: "Hybrid TX 5kVA", capacity: "5 kVA" },
    ]
  },
  {
    family: "Charge Controller",
    category: "solar",
    subcategory: "Charge Controllers",
    image: "",
    baseTags: ["solar", "charge-controller", "pwm"],
    features: ["Automatic battery detection", "Efficient charging", "Battery status at a glance", "Protection against overcharge", "USB Port"],
    models: [
      { name: "SCC1206e", capacity: "6A @ 12V" },
      { name: "SCC1210e", capacity: "10A @ 12V/24V" },
      { name: "SCC1220e", capacity: "20A @ 12V/24V" },
      { name: "SCC1250", capacity: "50A @ 12V/24V" },
      { name: "SCC1206NM", capacity: "6A @ 12V" },
      { name: "SCC1210NM", capacity: "10A @ 12V/24V" },
      { name: "SCC1220NM", capacity: "20A @ 12V/24V" },
    ]
  },
  {
    family: "Solar Battery",
    category: "solar",
    subcategory: "Solar Batteries",
    image: "",
    baseTags: ["solar", "battery", "tubular"],
    features: ["Very low maintenance", "High temperature performance", "Long design life (1500 cycles @ 80% DOD)", "C10 rated deep cycle"],
    models: [
      { name: "LPT 1240L", capacity: "40 Ah", voltage: "12V" },
      { name: "LPT 1240H", capacity: "40 Ah", voltage: "12V" },
      { name: "LPT 1280H", capacity: "80 Ah", voltage: "12V" },
      { name: "LPTT 12100H", capacity: "100 Ah", voltage: "12V" },
      { name: "LPTT 12120H", capacity: "120 Ah", voltage: "12V" },
      { name: "LPTT 12150L", capacity: "150 Ah", voltage: "12V" },
      { name: "LPTT 12150H", capacity: "150 Ah", voltage: "12V" },
      { name: "LPTT 12200L", capacity: "200 Ah", voltage: "12V" },
      { name: "LPTT 12200H", capacity: "200 Ah", voltage: "12V" },
    ]
  }
];

function generateSlug(str) {
  return str.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function findAvailableImage(category, familySlug, productSlug) {
  const exts = ['.jpg', '.webp', '.png', '.jpeg'];
  const publicDir = path.join(process.cwd(), 'public');
  
  // 1. Check for product-specific image
  for (const ext of exts) {
    const p = `/images/products/${category}/${productSlug}${ext}`;
    if (fs.existsSync(path.join(publicDir, p))) return p;
  }
  
  // 2. Check for family-specific image
  for (const ext of exts) {
    const p = `/images/products/${category}/${familySlug}${ext}`;
    if (fs.existsSync(path.join(publicDir, p))) return p;
  }
  
  // 3. Fallback to category image
  return `/images/categories/${category}.jpg`;
}

const products = [];
let idCounter = 1;

for (const fam of families) {
  for (const model of fam.models) {
    const slug = generateSlug(model.name);
    
    // Construct specs
    const specs = [];
    if (model.capacity) specs.push({ label: "Capacity/Rating", value: model.capacity });
    if (model.power) specs.push({ label: "Power", value: model.power });
    if (model.voltage) specs.push({ label: "Voltage", value: model.voltage });
    if (model.motor) specs.push({ label: "Recommended Motor", value: model.motor });
    if (model.chargeController) specs.push({ label: "Charge Controller", value: model.chargeController });
    if (model.phase) specs.push({ label: "Phase", value: model.phase });
    if (model.warranty) specs.push({ label: "Warranty", value: model.warranty });

    const p = {
      id: crypto.randomUUID(),
      slug: `luminous-${slug}`,
      name: `Luminous ${model.name}`,
      shortDescription: `Official Luminous ${model.name} ${fam.category} from the ${fam.family} series.`,
      description: `The Luminous ${model.name} is a high-performance ${fam.subcategory.toLowerCase()} belonging to the ${fam.family} series. It is engineered with top-class technology to provide reliable power solutions.`,
      category: fam.category,
      subcategory: fam.subcategory,
      tags: [...fam.baseTags, generateSlug(fam.family)],
      featuredImage: fam.image || findAvailableImage(fam.category, generateSlug(fam.family), slug),
      gallery: fam.image ? [fam.image] : [findAvailableImage(fam.category, generateSlug(fam.family), slug)],
      features: fam.features,
      specs,
      applications: [],
      seoTitle: `Buy Luminous ${model.name} - Official Catalog`,
      metaDescription: `Discover the Luminous ${model.name} ${fam.subcategory}. View specs, features, and buy online.`,
      featured: idCounter % 15 === 0, // feature some items
      isActive: true,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(p);
  }
}

// Write the products.ts file
const tsContent = `// =============================================================================
// Auto-generated Product Catalog
// Single source of truth from official Luminous PDFs.
// =============================================================================

import type { Product } from "@/types";

export const PLACEHOLDER_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export function getProductsByCategory(category: string): Product[] {
  return PLACEHOLDER_PRODUCTS.filter(
    (p) => p.category === category && p.isActive && p.status === "published"
  );
}

export function getFeaturedProducts(limit = 8): Product[] {
  return PLACEHOLDER_PRODUCTS.filter(
    (p) => p.featured && p.isActive && p.status === "published"
  ).slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Product[] {
  // Try matching subcategory first
  const current = PLACEHOLDER_PRODUCTS.find(p => p.id === productId);
  let related = [];
  if (current && current.subcategory) {
    related = PLACEHOLDER_PRODUCTS.filter(
      (p) =>
        p.id !== productId &&
        p.subcategory === current.subcategory &&
        p.isActive &&
        p.status === "published"
    );
  }
  
  if (related.length < limit) {
    const more = PLACEHOLDER_PRODUCTS.filter(
      (p) =>
        p.id !== productId &&
        p.category === category &&
        !related.includes(p) &&
        p.isActive &&
        p.status === "published"
    );
    related = related.concat(more);
  }
  return related.slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PLACEHOLDER_PRODUCTS.filter(
    (p) =>
      p.isActive &&
      p.status === "published" &&
      (p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)))
  );
}
`;

fs.writeFileSync(path.join(__dirname, "../src/data/products.ts"), tsContent, "utf-8");

// Generate SQL
let sql = `-- =============================================================================\n`;
sql += `-- Auto-generated Supabase Seed Data\n`;
sql += `-- =============================================================================\n\n`;

sql += `DELETE FROM products;\n`;
sql += `DELETE FROM categories;\n`;
sql += `DELETE FROM banners;\n\n`;

// Categories
const categories = [
  {
    id: crypto.randomUUID(),
    slug: 'inverter',
    name: 'Inverters',
    shortName: 'Inverter',
    description: 'High-performance home and commercial inverters.',
    valueProp: 'Uninterrupted power for your life.',
    icon: 'Zap',
    featuredImage: '/images/categories/inverter.jpg',
    isActive: true,
    sortOrder: 1
  },
  {
    id: crypto.randomUUID(),
    slug: 'battery',
    name: 'Batteries',
    shortName: 'Battery',
    description: 'Long-lasting tubular and flat plate batteries.',
    valueProp: 'Reliable energy storage.',
    icon: 'BatteryFull',
    featuredImage: '/images/categories/battery.jpg',
    isActive: true,
    sortOrder: 2
  },
  {
    id: crypto.randomUUID(),
    slug: 'solar',
    name: 'Solar Solutions',
    shortName: 'Solar',
    description: 'End-to-end solar energy solutions.',
    valueProp: 'Harness the power of the sun.',
    icon: 'Sun',
    featuredImage: '/images/categories/solar.jpg',
    isActive: true,
    sortOrder: 3
  },
  {
    id: crypto.randomUUID(),
    slug: 'combo',
    name: 'Combos',
    shortName: 'Combo',
    description: 'Inverter and battery combinations.',
    valueProp: 'Complete power backup packages.',
    icon: 'Layers',
    featuredImage: '/images/categories/combo.jpg',
    isActive: true,
    sortOrder: 4
  }
];

const safeStr = (str) => typeof str === 'string' ? "'" + str.replace(/'/g, "''") + "'" : "NULL";
const jsonStr = (obj) => "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";

for (const c of categories) {
  sql += `INSERT INTO categories (id, slug, name, short_name, description, value_prop, icon, featured_image, is_active, sort_order) VALUES (`;
  sql += `${safeStr(c.id)}, ${safeStr(c.slug)}, ${safeStr(c.name)}, ${safeStr(c.shortName)}, ${safeStr(c.description)}, ${safeStr(c.valueProp)}, ${safeStr(c.icon)}, ${safeStr(c.featuredImage)}, ${c.isActive}, ${c.sortOrder});\n`;
}
sql += `\n`;

// Banners
const banners = [
  {
    id: crypto.randomUUID(),
    slug: 'home-hero-1',
    headline: 'Powering your business, Powering success!',
    subheadline: 'Optimus series premium inverters with pure sine wave technology.',
    ctaText: 'Explore Optimus',
    ctaHref: '/products/inverter',
    image: '/images/banners/hero-1.jpg',
    overlayOpacity: 40,
    isActive: true,
    sortOrder: 1
  },
  {
    id: crypto.randomUUID(),
    slug: 'home-hero-2',
    headline: 'The Expert in End-to-End Energy Solutions',
    subheadline: 'Luminous Solar Panels, Grid-Tie Inverters, and PCUs.',
    ctaText: 'View Solar Range',
    ctaHref: '/products/solar',
    image: '/images/banners/hero-2.jpg',
    overlayOpacity: 45,
    isActive: true,
    sortOrder: 2
  }
];

for (const b of banners) {
  sql += `INSERT INTO banners (id, slug, headline, subheadline, cta_text, cta_href, image, overlay_opacity, is_active, sort_order) VALUES (`;
  sql += `${safeStr(b.id)}, ${safeStr(b.slug)}, ${safeStr(b.headline)}, ${safeStr(b.subheadline)}, ${safeStr(b.ctaText)}, ${safeStr(b.ctaHref)}, ${safeStr(b.image)}, ${b.overlayOpacity}, ${b.isActive}, ${b.sortOrder});\n`;
}
sql += `\n`;

for (const p of products) {
  // sanitize single quotes for SQL
  const safeStr = (str) => typeof str === 'string' ? "'" + str.replace(/'/g, "''") + "'" : "NULL";
  const jsonStr = (obj) => "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";

  sql += `INSERT INTO products (id, slug, name, short_description, description, category, subcategory, tags, featured_image, gallery, features, specs, use_cases, seo_title, meta_description, status, featured, is_active, created_at, updated_at) VALUES (`;
  sql += `${safeStr(p.id)}, `;
  sql += `${safeStr(p.slug)}, `;
  sql += `${safeStr(p.name)}, `;
  sql += `${safeStr(p.shortDescription)}, `;
  sql += `${safeStr(p.description)}, `;
  sql += `${safeStr(p.category)}, `;
  sql += `${safeStr(p.subcategory)}, `;
  sql += `${jsonStr(p.tags)}, `;
  sql += `${safeStr(p.featuredImage)}, `;
  sql += `${jsonStr(p.gallery)}, `;
  sql += `${jsonStr(p.features)}, `;
  sql += `${jsonStr(p.specs)}, `;
  sql += `${jsonStr(p.applications)}, `;
  sql += `${safeStr(p.seoTitle)}, `;
  sql += `${safeStr(p.metaDescription)}, `;
  sql += `${safeStr(p.status)}, `;
  sql += `${p.featured}, `;
  sql += `${p.isActive}, `;
  sql += `${safeStr(p.createdAt)}, `;
  sql += `${safeStr(p.updatedAt)}`;
  sql += `);\n`;
}

fs.writeFileSync(path.join(__dirname, "../supabase/catalog_seed.sql"), sql, "utf-8");

console.log("Successfully generated products.ts and catalog_seed.sql with " + products.length + " products.");
