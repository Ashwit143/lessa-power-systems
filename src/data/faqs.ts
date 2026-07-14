import type { FAQItem } from "@/types";

export const FAQS: FAQItem[] = [
  // ---------------------------------------------------------------------------
  // Solar FAQs
  // ---------------------------------------------------------------------------
  {
    id: "faq-solar-001",
    question: "Is solar power viable in Hyderabad?",
    answer:
      "Yes — Hyderabad receives approximately 5.5–6 peak sun hours per day, making it one of the better solar locations in India. A well-designed system in Hyderabad can generate substantial savings on your electricity bill year-round.",
    category: "solar",
    sortOrder: 1,
  },
  {
    id: "faq-solar-002",
    question: "What is the difference between on-grid, off-grid, and hybrid solar systems?",
    answer:
      "An on-grid system connects to the utility grid — excess solar power is sent back to the grid (net metering), but there is no backup during grid outages. An off-grid system operates independently with battery storage, providing backup but at higher cost. A hybrid system combines both: it connects to the grid for net metering benefits while also having battery backup for power cuts. For most Hyderabad homes and offices, a hybrid system offers the best of both worlds.",
    category: "solar",
    sortOrder: 2,
  },
  {
    id: "faq-solar-003",
    question: "Does solar work during power cuts?",
    answer:
      "Standard on-grid systems do NOT work during power cuts (they shut down for safety). Only off-grid and hybrid systems with battery storage continue to power your home during outages. If uninterrupted power is important, a hybrid system is the right choice.",
    category: "solar",
    sortOrder: 3,
  },
  {
    id: "faq-solar-004",
    question: "How much rooftop space is needed for a solar installation?",
    answer:
      "As a general rule, each kilowatt (kW) of solar capacity requires approximately 80–100 square feet of shadow-free rooftop space. A typical 3 kW residential system needs around 250–300 sq ft. We assess your rooftop during the free consultation.",
    category: "solar",
    sortOrder: 4,
  },
  {
    id: "faq-solar-005",
    question: "What happens to my solar system on cloudy or rainy days?",
    answer:
      "Solar panels still generate power on overcast days, though at reduced efficiency (typically 10–25% of peak output). In a hybrid or on-grid system, the grid supplements any shortfall automatically. Hyderabad's extended sunny seasons mean annual yield is rarely significantly impacted by the monsoon months.",
    category: "solar",
    sortOrder: 5,
  },
  {
    id: "faq-solar-006",
    question: "What does the solar installation process look like?",
    answer:
      "Our process has three stages: (1) Free Consultation — we assess your rooftop, electricity bills, and requirements; (2) Installation — our certified engineers install the panels, inverter, and wiring, typically completed in 1–2 days for residential systems; (3) After-Service — we provide commissioning support, warranty service, and ongoing maintenance assistance.",
    category: "solar",
    sortOrder: 6,
  },

  // ---------------------------------------------------------------------------
  // Battery FAQs
  // ---------------------------------------------------------------------------
  {
    id: "faq-bat-001",
    question: "What is the difference between tubular and flat plate batteries?",
    answer:
      "Tubular batteries use a tubular positive plate construction, offering superior cycle life, deeper discharge capability, and longer service life — ideal for areas with frequent and long power cuts. Flat plate batteries use a flat plate design, are lighter, and charge faster, but have shorter cycle life. For areas with 6+ hour daily outages, tubular batteries are strongly recommended.",
    category: "battery",
    sortOrder: 1,
  },
  {
    id: "faq-bat-002",
    question: "How do I maintain my inverter battery?",
    answer:
      "Key maintenance steps: (1) Check electrolyte levels every 2–3 months and top up with distilled water only if below the minimum mark; (2) Keep the battery terminals clean and free of corrosion; (3) Ensure the battery is in a well-ventilated area; (4) Avoid deep discharge — recharge before the battery is completely drained. Following these steps can significantly extend battery life.",
    category: "battery",
    sortOrder: 2,
  },

  // ---------------------------------------------------------------------------
  // Inverter FAQs
  // ---------------------------------------------------------------------------
  {
    id: "faq-inv-001",
    question: "What VA rating do I need for my home?",
    answer:
      "A rough guide: add up the wattage of all appliances you want to run during a power cut, then add a 20% buffer. A typical 2 BHK home running 2 fans (75W each), 4 LED lights (10W each), and a TV (100W) needs around 390W — a 500VA or 850VA inverter is sufficient. For homes with computers or refrigerators, 1100VA–1700VA is recommended. We help you calculate this during a free WhatsApp consultation.",
    category: "inverter",
    sortOrder: 1,
  },
  {
    id: "faq-inv-002",
    question: "What is pure sine wave vs. square wave vs. modified sine wave?",
    answer:
      "Pure sine wave inverters output clean AC power identical to grid power — safe for all appliances including computers, refrigerators, medical equipment, and LED TVs. Square wave inverters are older technology not suitable for modern appliances. Modified sine wave (MSW) is a middle ground but can cause humming in fans, reduced efficiency in refrigerators, and is not suitable for sensitive electronics. All Luminous home UPS inverters we stock are pure sine wave.",
    category: "inverter",
    sortOrder: 2,
  },

  // ---------------------------------------------------------------------------
  // Ordering FAQs
  // ---------------------------------------------------------------------------
  {
    id: "faq-order-001",
    question: "How do I place an order?",
    answer:
      "Simply add the products you need to the cart, then tap 'Send Order via WhatsApp.' This opens WhatsApp with your order details pre-filled. Send the message and our team will confirm availability and pricing within business hours. No payment is processed on the website — all transactions are completed directly with our team.",
    category: "ordering",
    sortOrder: 1,
  },
  {
    id: "faq-order-002",
    question: "Do you offer installation services?",
    answer:
      "Yes — we provide installation services for inverter, battery, and solar systems across Hyderabad and the twin cities area. Installation is done by trained technicians. Contact us on WhatsApp to discuss your installation requirements.",
    category: "ordering",
    sortOrder: 2,
  },
  {
    id: "faq-order-003",
    question: "Are these genuine Luminous products?",
    answer:
      "Yes. Leesa Power Systems is an authorized Luminous distributor — we stock only genuine Luminous products sourced directly through official channels. All products come with valid Luminous warranty. We do not deal in grey-market or counterfeit goods.",
    category: "ordering",
    sortOrder: 3,
  },

  // ---------------------------------------------------------------------------
  // General FAQs
  // ---------------------------------------------------------------------------
  {
    id: "faq-gen-001",
    question: "What areas do you serve?",
    answer:
      "We serve Hyderabad and the twin cities area including Nizampet, Kukatpally, Bachupally, Miyapur, Kondapur, Gachibowli, Madhapur, Hitech City, Secunderabad, and surrounding localities. Contact us on WhatsApp to confirm if we cover your specific area.",
    category: "general",
    sortOrder: 1,
  },
];

export function getFAQsByCategory(category: FAQItem["category"]): FAQItem[] {
  return FAQS.filter((f) => f.category === category).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}
