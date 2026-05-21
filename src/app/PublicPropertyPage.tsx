"use client";

import { useState, useMemo } from "react";
import HomePageSections from "./HomePageSections";
import CategoryPage from "./CategoryPage";
import MapSearchView from "@/components/MapSearchView";

type Lang = "en" | "my";

const txt = {
  en: {
    agentLogin: "Agent Login",
    tagline: "PREMIUM PROPERTIES · TRUSTED AGENTS",
    hero1: "Find Your Dream Property",
    hero2: "with Trusted Agents",
    hero3: "Myanmar's most trusted real estate platform",
    searchPlaceholder: "Search by township, street, or property code...",
    forSaleRent: "Buy & Rent",
    forSale: "Buy",
    forRent: "Rent",
    allTypes: "All Types",
    anyPrice: "Any Price",
    anyBeds: "Any Beds",
    bed1: "1+ Bed",
    bed2: "2+ Beds",
    bed3: "3+ Beds",
    bed4: "4+ Beds",
    propertiesFound: "properties found",
    sortBy: "Sort by",
    newest: "Newest",
    priceLow: "Price: Low to High",
    priceHigh: "Price: High to Low",
    featured: "FEATURED",
    new: "NEW",
    forSaleBadge: "FOR SALE",
    forRentBadge: "FOR RENT",
    bed: "bed",
    bath: "bath",
    sqft: "sqft",
    viewDetails: "View Details",
    contactAgent: "Contact Agent",
    perMonth: "/mo",
    noProperties: "No properties match your search",
    noPropertiesSub: "Try adjusting your filters",
    clearFilters: "Clear all filters",
    // Detail modal
    overview: "Overview",
    description: "Description",
    details: "Property Details",
    propertyType: "Property Type",
    listingType: "Listing Type",
    floorArea: "Floor Area",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    location: "Location",
    postedBy: "Posted by",
    verifiedAgent: "Verified Agent",
    unlockContact: "Unlock Agent Contact",
    unlockHint: "Enter your details to see the agent's phone number. We'll also send you matching properties.",
    yourName: "Full Name",
    yourPhone: "Phone Number",
    yourNamePlaceholder: "e.g. Ko Aung",
    yourPhonePlaceholder: "e.g. 09-123456789",
    getContact: "Get Agent Contact →",
    thankYouTitle: "Contact Unlocked!",
    thankYouMsg: "Thank you! The agent will reach out to you soon.",
    agentPhone: "Agent's Phone",
    callNow: "Call Now",
    priceRange0: "Under 500 Lakh",
    priceRange1: "500 - 2,000 Lakh",
    priceRange2: "2,000 - 5,000 Lakh",
    priceRange3: "5,000 - 10,000 Lakh",
    priceRange4: "Above 10,000 Lakh",
    rentRange0: "Under 3 Lakh/mo",
    rentRange1: "3 - 6 Lakh/mo",
    rentRange2: "6 - 10 Lakh/mo",
    rentRange3: "Above 10 Lakh/mo",
    mapView: "Map View",
    listView: "List View",
    share: "Share",
    save: "Save",
    report: "Report",
    close: "Close",
  },
  my: {
    agentLogin: "အေးဂျင့် ဝင်ရောက်ရန်",
    tagline: "အဆင့်မြင့် အိမ်ခြံမြေ · ယုံကြည်ရသော အေးဂျင့်များ",
    hero1: "သင်၏ အိပ်မက်အိမ်ကို ရှာဖွေပါ",
    hero2: "ယုံကြည်ရသော အေးဂျင့်များနှင့်",
    hero3: "မြန်မာနိုင်ငံ၏ အယုံကြည်ရဆုံး အိမ်ခြံမြေ ပလက်ဖောင်း",
    searchPlaceholder: "မြို့နယ်၊ လမ်း သို့မဟုတ် ကုဒ်ဖြင့် ရှာပါ...",
    forSaleRent: "ဝယ်ရန် & ငှားရန်",
    forSale: "ဝယ်ရန်",
    forRent: "ငှားရန်",
    allTypes: "အမျိုးအစားအားလုံး",
    anyPrice: "ဈေးနှုန်း မရွေး",
    anyBeds: "အိပ်ခန်း မရွေး",
    bed1: "၁+ အိပ်ခန်း",
    bed2: "၂+ အိပ်ခန်း",
    bed3: "၃+ အိပ်ခန်း",
    bed4: "၄+ အိပ်ခန်း",
    propertiesFound: "အိမ်ခြံမြေ တွေ့ရှိသည်",
    sortBy: "စီရင်ရန်",
    newest: "အသစ်ဆုံး",
    priceLow: "စျေးနှုန်း: နိမ့်မှ မြင့်သို့",
    priceHigh: "စျေးနှုန်း: မြင့်မှ နိမ့်သို့",
    featured: "အထူးဖော်ပြ",
    new: "အသစ်",
    forSaleBadge: "ရောင်းရန်",
    forRentBadge: "ငှားရန်",
    bed: "အိပ်ခန်း",
    bath: "ရေချိုးခန်း",
    sqft: "စတုရန်းပေ",
    viewDetails: "အသေးစိတ် ကြည့်ရန်",
    contactAgent: "အေးဂျင့်ထံ ဆက်သွယ်ရန်",
    perMonth: "/လ",
    noProperties: "သင်၏ ရှာဖွေမှုနှင့် ကိုက်ညီသော အိမ်ခြံမြေ မတွေ့ပါ",
    noPropertiesSub: "စစ်ထုတ်မှုများကို ချိန်ညှိကြည့်ပါ",
    clearFilters: "စစ်ထုတ်မှုများ ရှင်းပါ",
    overview: "အကျဉ်းချုပ်",
    description: "ဖော်ပြချက်",
    details: "အိမ်ခြံမြေ အသေးစိတ်",
    propertyType: "အမျိုးအစား",
    listingType: "စာရင်းတင်မှု",
    floorArea: "ကြမ်းပြင် ဧရိယာ",
    bedrooms: "အိပ်ခန်း",
    bathrooms: "ရေချိုးခန်း",
    location: "တည်နေရာ",
    postedBy: "တင်သွင်းသူ",
    verifiedAgent: "အတည်ပြုပြီး အေးဂျင့်",
    unlockContact: "အေးဂျင့် ဆက်သွယ်ရေး ဖွင့်ရန်",
    unlockHint: "အေးဂျင့်၏ ဖုန်းနံပါတ်ကို ကြည့်ရှုရန် သင်၏ အချက်အလက်ထည့်ပါ။",
    yourName: "အမည်",
    yourPhone: "ဖုန်းနံပါတ်",
    yourNamePlaceholder: "ဥပမာ ကိုအောင်",
    yourPhonePlaceholder: "ဥပမာ ၀၉-၁၂၃၄၅၆၇၈၉",
    getContact: "အေးဂျင့် ဆက်သွယ်ရေး ရယူရန် →",
    thankYouTitle: "ဆက်သွယ်ရေး ဖွင့်ပြီး!",
    thankYouMsg: "ကျေးဇူးတင်ပါသည်! အေးဂျင့်မှ မကြာမီ ဆက်သွယ်ပေးမည်။",
    agentPhone: "အေးဂျင့် ဖုန်း",
    callNow: "ခေါ်ဆိုရန်",
    priceRange0: "၅၀၀ သိန်းအောက်",
    priceRange1: "၅၀၀ - ၂,၀၀၀ သိန်း",
    priceRange2: "၂,၀၀၀ - ၅,၀၀၀ သိန်း",
    priceRange3: "၅,၀၀၀ - ၁၀,၀၀၀ သိန်း",
    priceRange4: "၁၀,၀၀၀ သိန်းအထက်",
    rentRange0: "သိန်း ၃ အောက်/လ",
    rentRange1: "သိန်း ၃ - ၆/လ",
    rentRange2: "သိန်း ၆ - ၁၀/လ",
    rentRange3: "သိန်း ၁၀ အထက်/လ",
    mapView: "မြေပုံ",
    listView: "စာရင်း",
    share: "မျှဝေ",
    save: "သိမ်းဆည်း",
    report: "တိုင်ကြားရန်",
    close: "ပိတ်ရန်",
  },
};

interface Property {
  id: string;
  code: string;
  title: string;
  titleMy: string;
  description: string;
  descriptionMy: string;
  location: string;
  township: string;
  type: string;
  listing: "sale" | "rent";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  agentName: string;
  agentPhone: string;
  agentAvatar: string;
  featured: boolean;
  isNew: boolean;
  images: string[];
  floor?: number;
  totalFloors?: number;
}

const PROPERTIES: Property[] = [
  {
    id: "1", code: "YME-001",
    title: "Luxury Condo with City View in Yankin",
    titleMy: "ရန်ကင်း၌ မြို့ပြမြင်ကွင်းနှင့် သုခချမ်းသာ ကွန်ဒို",
    description: "A stunning modern condominium in the heart of Yankin township. Features floor-to-ceiling windows with breathtaking city views, premium finishes throughout, and access to world-class amenities including pool, gym, and 24/7 security.",
    descriptionMy: "ရန်ကင်းမြို့နယ်၏ အလယ်ဗဟိုတွင် ရှိသော ခေတ်မီ ကွန်ဒိုတစ်ခု ဖြစ်သည်။ မြို့ပြမြင်ကွင်းနှင့် ဝေးလံသော ပြတင်းပေါက်များ၊ ကျဆင်းကွင်း၊ ခန်းမ နှင့် လုံခြုံရေး ၂၄/၇ ပါဝင်သည်။",
    location: "Yankin Township, Yangon", township: "Yankin",
    type: "Condo", listing: "sale", price: 450000000,
    bedrooms: 3, bathrooms: 2, area: 1450,
    agentName: "Ko Aung Zaw", agentPhone: "09-123456789", agentAvatar: "AZ",
    featured: true, isNew: false,
    images: ["#1a2e45", "#2d4a6e", "#1e3a5f"],
    floor: 15, totalFloors: 25,
  },
  {
    id: "2", code: "YME-002",
    title: "Spacious Family Apartment in Bahan",
    titleMy: "ဗဟန်း၌ မိသားစုအတွက် ကျယ်ဝန်းသော အပါတ်မန့်",
    description: "Perfect for families, this bright and airy apartment is located in the prestigious Bahan township. Walking distance to international schools, hospitals, and shopping centers.",
    descriptionMy: "မိသားစုများအတွက် အကောင်းဆုံး ဖြစ်သော ဤ အပါတ်မန့်သည် နာမည်ကြီး ဗဟန်းမြို့နယ်တွင် တည်ရှိသည်။ နိုင်ငံတကာကျောင်းများ၊ ဆေးရုံများနှင့် ဈေးများသို့ လမ်းလျှောက်သွားနိုင်သည်။",
    location: "Bahan Township, Yangon", township: "Bahan",
    type: "Apartment", listing: "rent", price: 1200000,
    bedrooms: 3, bathrooms: 2, area: 1800,
    agentName: "Ma Thida Win", agentPhone: "09-987654321", agentAvatar: "TW",
    featured: true, isNew: true,
    images: ["#2d4a6e", "#1a2e45", "#3d5a7e"],
  },
  {
    id: "3", code: "YME-003",
    title: "Modern Studio in Kamayut",
    titleMy: "ကမာရွတ်၌ ခေတ်မီ စတူဒီယို",
    description: "Ideal for young professionals and students. This compact but well-designed studio apartment is in the vibrant Kamayut area, close to universities and cafes.",
    descriptionMy: "လူငယ်များနှင့် ကျောင်းသားများအတွက် သင့်တော်သည်။ ကမာရွတ်တွင် တည်ရှိပြီး တက္ကသိုလ်များနှင့် ကဖေးများနှင့် နီးကပ်သည်။",
    location: "Kamayut Township, Yangon", township: "Kamayut",
    type: "Studio", listing: "rent", price: 450000,
    bedrooms: 1, bathrooms: 1, area: 550,
    agentName: "Ko Aung Zaw", agentPhone: "09-123456789", agentAvatar: "AZ",
    featured: false, isNew: true,
    images: ["#1e3a5f", "#2d4a6e", "#1a2e45"],
  },
  {
    id: "4", code: "YME-004",
    title: "Executive Penthouse in Sanchaung",
    titleMy: "စမ်းချောင်း၌ အမှုဆောင် ပင်ထောင်",
    description: "Rare penthouse opportunity in the highly sought-after Sanchaung township. Private rooftop terrace, panoramic views, and premium fittings throughout.",
    descriptionMy: "စမ်းချောင်းမြို့နယ်တွင် ရှားပါးသော ပင်ထောင် အခွင့်အရေး။ ကိုယ်ပိုင် ခေါင်မိုးတာရတ်၊ ပတ်ဝန်းကျင် မြင်ကွင်းများ နှင့် အဆင့်မြင့် ပစ္စည်းများ ပါဝင်သည်။",
    location: "Sanchaung Township, Yangon", township: "Sanchaung",
    type: "Penthouse", listing: "sale", price: 1200000000,
    bedrooms: 4, bathrooms: 3, area: 3200,
    agentName: "Daw Khin Myo", agentPhone: "09-456789012", agentAvatar: "KM",
    featured: true, isNew: false,
    images: ["#0d1f33", "#1a2e45", "#2d4a6e"],
    floor: 30, totalFloors: 30,
  },
  {
    id: "5", code: "YME-005",
    title: "Cozy 2BR Apartment in Tamwe",
    titleMy: "တာမွေ၌ သက်တောင့်သက်သာသော ၂ အိပ်ခန်း အပါတ်မန့်",
    description: "Affordable and well-maintained apartment in Tamwe. Great transport links and within walking distance of local markets and restaurants.",
    descriptionMy: "တာမွေတွင် တတ်နိုင်သော ဈေးနှင့် ကောင်းစွာ ထိန်းသိမ်းထားသော အပါတ်မန့်။ ကောင်းမွန်သော သယ်ယူပို့ဆောင်ရေး ချိတ်ဆက်မှုများနှင့် ဈေးများ၊ စားသောက်ဆိုင်များ အနီးတွင် တည်ရှိသည်။",
    location: "Tamwe Township, Yangon", township: "Tamwe",
    type: "Apartment", listing: "rent", price: 600000,
    bedrooms: 2, bathrooms: 1, area: 900,
    agentName: "Ma Thida Win", agentPhone: "09-987654321", agentAvatar: "TW",
    featured: false, isNew: false,
    images: ["#2d4a6e", "#1a2e45", "#3d5a7e"],
  },
  {
    id: "6", code: "YME-006",
    title: "Investment Condo in Hlaing",
    titleMy: "လှိုင်း၌ ရင်းနှီးမြှုပ်နှံမှု ကွန်ဒို",
    description: "High-yield investment property in the fast-developing Hlaing township. Excellent rental potential with modern amenities.",
    descriptionMy: "မြန်မာနိုင်ငံ၌ လျင်မြန်စွာ ဖွံ့ဖြိုးနေသော လှိုင်းမြို့နယ်တွင် အမြတ်အစွန်းများသော ရင်းနှီးမြှုပ်နှံမှု အိမ်ခြံမြေ။",
    location: "Hlaing Township, Yangon", township: "Hlaing",
    type: "Condo", listing: "sale", price: 280000000,
    bedrooms: 2, bathrooms: 1, area: 980,
    agentName: "Daw Khin Myo", agentPhone: "09-456789012", agentAvatar: "KM",
    featured: false, isNew: true,
    images: ["#1a2e45", "#0d1f33", "#2d4a6e"],
    floor: 8, totalFloors: 20,
  },
];

function formatPrice(price: number, listing: string, lang: Lang) {
  const mo = lang === "my" ? "/လ" : "/mo";
  const lakh = lang === "my" ? "သိန်း ကျပ်" : "Lakh Kyats";
  const lakhShort = lang === "my" ? "သိန်း" : "Lakh";
  if (listing === "rent") {
    const lakhVal = price / 100000;
    if (lakhVal >= 1) return `${lakhVal % 1 === 0 ? lakhVal.toFixed(0) : lakhVal.toFixed(1)} ${lakhShort} Ks${mo}`;
    return `${(price / 1000).toFixed(0)}K Ks${mo}`;
  }
  const lakhVal = price / 100000;
  return `${lakhVal % 1 === 0 ? lakhVal.toLocaleString() : lakhVal.toFixed(1)} ${lakh}`;
}

const gold = "#bd9468";
const navy = "#111d2b";
const cream = "#f5f0e8";
const white = "#ffffff";
const darkNavy = "#1a2e45";
const midNavy = "#2d4a6e";

// ── Myanmar Regions & Townships ──
const REGIONS: Record<string, { en: string; my: string; townships: { en: string; my: string }[] }> = {
  yangon: {
    en: "Yangon Region", my: "ရန်ကုန်တိုင်းဒေသကြီး",
    townships: [
      { en: "Yankin", my: "ရန်ကင်း" }, { en: "Bahan", my: "ဗဟန်း" },
      { en: "Kamayut", my: "ကမာရွတ်" }, { en: "Sanchaung", my: "စမ်းချောင်း" },
      { en: "Hlaing", my: "လှိုင်" }, { en: "Tamwe", my: "တာမွေ" },
      { en: "Mayangone", my: "မရမ်းကုန်း" }, { en: "Insein", my: "အင်းစိန်" },
      { en: "North Dagon", my: "မြောက်ဒဂုံ" }, { en: "South Dagon", my: "တောင်ဒဂုံ" },
      { en: "North Okkalapa", my: "မြောက်ဥက္ကလာပ" }, { en: "South Okkalapa", my: "တောင်ဥက္ကလာပ" },
      { en: "Thingangyun", my: "သင်္ကန်းကျွန်း" }, { en: "Thaketa", my: "သာကေတ" },
      { en: "Dawbon", my: "ဒေါပုံ" }, { en: "Pabedan", my: "ပဗေဒါ" },
      { en: "Lanmadaw", my: "လမ်းမတော်" }, { en: "Latha", my: "လသာ" },
      { en: "Mingaladon", my: "မင်္ဂလာဒုံ" }, { en: "Hlaingtharya", my: "လှိုင်သာယာ" },
    ],
  },
  mandalay: {
    en: "Mandalay Region", my: "မန္တလေးတိုင်းဒေသကြီး",
    townships: [
      { en: "Aungmyethazan", my: "အောင်မြေသာဇံ" }, { en: "Chanayethazan", my: "ချမ်းအေးသာဇံ" },
      { en: "Chanmyathazi", my: "ချမ်းမြသာစည်" }, { en: "Mahaaungmye", my: "မဟာအောင်မြေ" },
      { en: "Patheingyi", my: "ပတ်တိုင်းကြီး" }, { en: "Pyigyitagon", my: "ပြည်ကြီးတံခွန်" },
      { en: "Amarapura", my: "အမရပူရ" }, { en: "Pyinoolwin", my: "ပြင်ဦးလွင်" },
    ],
  },
  naypyidaw: {
    en: "Naypyidaw Union Territory", my: "နေပြည်တော်",
    townships: [
      { en: "Zabuthiri", my: "ဇဗ္ဗူသီရိ" }, { en: "Dekkhinathiri", my: "ဒက္ခိဏသီရိ" },
      { en: "Pobbathiri", my: "ပုပ္ပသီရိ" }, { en: "Ottarathiri", my: "ဥတ္တရသီရိ" },
    ],
  },
  bago: {
    en: "Bago Region", my: "ပဲခူးတိုင်းဒေသကြီး",
    townships: [
      { en: "Bago", my: "ပဲခူး" }, { en: "Taungoo", my: "တောင်ငူ" },
      { en: "Pyay", my: "ပြည်" }, { en: "Thayawady", my: "သာယာဝတီ" },
    ],
  },
  sagaing: {
    en: "Sagaing Region", my: "စစ်ကိုင်းတိုင်းဒေသကြီး",
    townships: [
      { en: "Sagaing", my: "စစ်ကိုင်း" }, { en: "Monywa", my: "မုံရွာ" },
      { en: "Shwebo", my: "ရွှေဘို" },
    ],
  },
};

// ── Sample Agent Directory Data ──
const AGENTS = [
  {
    id: "A1", name: "Ko Aung Zaw", nameMy: "ကိုအောင်ဇော်",
    avatar: "AZ", agency: "Aung Zaw Real Estate", agencyMy: "အောင်ဇော် အိမ်ခြံမြေ",
    phone: "09-123456789", region: "yangon", township: "Yankin",
    specializations: ["Condo", "Apartment"], specializationsMy: ["ကွန်ဒို", "အပါတ်မန့်"],
    verified: true, featured: true,
    activeListings: 18, totalSold: 42, responseTime: "< 1 hour",
    rating: 4.8, reviews: 23,
    bio: "10+ years experience in Yangon property market. Specialist in premium condos and apartments in Yankin, Bahan and Kamayut townships.",
    bioMy: "ရန်ကုန် အိမ်ခြံမြေ ကဏ္ဍတွင် အတွေ့အကြုံ ၁၀ နှစ်ကျော်ရှိသည်။ ရန်ကင်း၊ ဗဟန်း နှင့် ကမာရွတ်မြို့နယ်တွင် ကွန်ဒိုနှင့် အပါတ်မန့် အထူးကျွမ်းကျင်သည်။",
  },
  {
    id: "A2", name: "Ma Thida Win", nameMy: "မသီတာဝင်း",
    avatar: "TW", agency: "Thida Win Properties", agencyMy: "သီတာဝင်း အိမ်ခြံမြေ",
    phone: "09-987654321", region: "yangon", township: "Bahan",
    specializations: ["House", "Land"], specializationsMy: ["အိမ်", "မြေ"],
    verified: true, featured: true,
    activeListings: 12, totalSold: 67, responseTime: "< 2 hours",
    rating: 4.9, reviews: 41,
    bio: "Trusted agent with 15 years in Bahan and Sanchaung. Expert in landed houses and prime land plots.",
    bioMy: "ဗဟန်းနှင့် စမ်းချောင်းတွင် နှစ် ၁၅ ကျော် ယုံကြည်ရသော အေးဂျင့်။ မြေကွက်နှင့် အိမ် ဝယ်ရောင်းကိစ္စတွင် အထူးကျွမ်းကျင်သည်။",
  },
  {
    id: "A3", name: "Daw Khin Myo", nameMy: "ဒေါ်ခင်မျိုး",
    avatar: "KM", agency: "KM Luxury Real Estate", agencyMy: "KM ဇိမ်ခံ အိမ်ခြံမြေ",
    phone: "09-456789012", region: "yangon", township: "Sanchaung",
    specializations: ["Penthouse", "Condo"], specializationsMy: ["ပင်ထောင်", "ကွန်ဒို"],
    verified: true, featured: false,
    activeListings: 8, totalSold: 29, responseTime: "< 3 hours",
    rating: 4.7, reviews: 15,
    bio: "Specialist in luxury and premium properties across Yangon. Dedicated to matching clients with their dream homes.",
    bioMy: "ရန်ကုန်တွင် ဇိမ်ခံ အိမ်ခြံမြေ အထူးကျွမ်းကျင်သည်။ ဖောက်သည်များအတွက် အကောင်းဆုံး အိမ်ကို ရှာဖွေပေးရန် အမြဲ အသင့်ရှိသည်။",
  },
];

interface PublicPropertyPageProps {
  onAgentLoginClick?: () => void;
}

export default function PublicPropertyPage({ onAgentLoginClick }: PublicPropertyPageProps) {
  const [lang, setLang] = useState<Lang>("my");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // ── Category definitions ──
  const CATEGORIES: Record<string, any> = {
    latestProjects: { id: "latestProjects", icon: "", titleEn: "Latest Projects", titleMy: "စီမံကိန်းသစ်များ", descEn: "Brand new developments launching across Myanmar", descMy: "မြန်မာနိုင်ငံတစ်ဝှမ်း ထွက်ပေါ်လာသော စီမံကိန်းသစ်များ", filter: (p: any) => p.isNew || p.featured },
    nearUniversities: { id: "nearUniversities", icon: "", titleEn: "Near Universities & Schools", titleMy: "တက္ကသိုလ်နှင့် ကျောင်းနီးသော အိမ်ခြံမြေ", descEn: "Properties near top educational institutions", descMy: "ကျောင်းနှင့် တက္ကသိုလ်နီးသော အိမ်ရာများ", filter: (p: any) => ["Kamayut", "Hlaing", "Bahan", "Mayangone", "Tamwe"].includes(p.township) },
    petFriendly: { id: "petFriendly", icon: "", titleEn: "Pet-Friendly Properties", titleMy: "တိရစ္ဆာန်ချစ်သူများအတွက် အိမ်ရာများ", descEn: "Homes that welcome your furry family members", descMy: "သင်၏ တိရစ္ဆာန်မိသားစုကို ကြိုဆိုသော အိမ်ရာများ", filter: (p: any) => p.petFriendly || ["Yankin", "Hlaing", "Tamwe", "Insein", "Mayangone"].includes(p.township) },
    luxury: { id: "luxury", icon: "", titleEn: "Luxury Estates & Branded Residences", titleMy: "ဇိမ်ခံ အိမ်ရာများနှင့် အမှတ်တံဆိပ် နေထိုင်မှုများ", descEn: "Myanmar's most exclusive premium addresses", descMy: "မြန်မာ၏ အထူးသီးသန့် ဇိမ်ခံ နေရပ်များ", filter: (p: any) => p.price >= 500000000 || p.type === "Penthouse" || ["Bahan", "Sanchaung"].includes(p.township) },
    resortVillas: { id: "resortVillas", icon: "", titleEn: "Resort Villas", titleMy: "ရီဆော့တ် ဗီလာများ", descEn: "Vacation-style living in Myanmar's finest destinations", descMy: "မြန်မာ၏ အကောင်းဆုံး ကျန်းမာနားနေမှု", filter: (p: any) => p.type === "Villa" || p.type === "Resort" },
    sustainable: { id: "sustainable", icon: "", titleEn: "Sustainable Living", titleMy: "သဘာဝပတ်ဝန်းကျင်နှင့် ညီညွတ်သော နေထိုင်မှု", descEn: "Eco-friendly homes with green spaces", descMy: "သဘာဝပတ်ဝန်းကျင်ကို ချစ်မြတ်နိုးသူများအတွက် နေအိမ်များ", filter: (p: any) => p.sustainable || ["Hlaingtharya", "Insein"].includes(p.township) },
    handpicked: { id: "handpicked", icon: "", titleEn: "Handpicked For You", titleMy: "သင့်အတွက် ကျွမ်းကျင်စွာ ရွေးချယ်ထားသည်", descEn: "Curated selections based on what buyers love", descMy: "မြန်မာ ဝယ်သူများ ယခု အကြိုက်ဆုံးကို အခြေခံ၍", filter: (p: any) => p.featured || p.status === "available" },
  };
  const [mainTab, setMainTab] = useState<"properties" | "projects" | "agents" | "map">("properties");
  const [projectCity, setProjectCity] = useState("all");
  const [agentSearch, setAgentSearch] = useState("");
  const [agentRegion, setAgentRegion] = useState("all");
  const [agentTownship, setAgentTownship] = useState("all");
  const [agentSpecialization, setAgentSpecialization] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTS[0] | null>(null);
  const [agentContactName, setAgentContactName] = useState("");
  const [agentContactPhone, setAgentContactPhone] = useState("");
  const [agentContactSubmitted, setAgentContactSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState<"buy" | "rent" | "projects" | "commercial" | null>(null);
  const [search, setSearch] = useState("");
  const [listingFilter, setListingFilter] = useState<"all" | "sale" | "rent">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [townshipFilter, setTownshipFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [bedsFilter, setBedsFilter] = useState("all");
  const [bathsFilter, setBathsFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selected, setSelected] = useState<Property | null>(null);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    // Load saved view counts from localStorage
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("yume_view_counts") || "{}"); } catch {}
    }
    return {};
  });
  const [activeImage, setActiveImage] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [contactStep, setContactStep] = useState<"form" | "chat">("form");
  const [chatMessages, setChatMessages] = useState<{from:"bot"|"user"; text:string; time:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const t = txt[lang];
  const ff = lang === "my" ? "'Padauk','Myanmar Text',sans-serif" : "Georgia,serif";

  const types = Array.from(new Set(PROPERTIES.map(p => p.type)));

  const filtered = useMemo(() => {
    let list = PROPERTIES.filter(p => {
      const title = lang === "my" ? p.titleMy : p.title;
      const matchSearch = !search ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.township.toLowerCase().includes(search.toLowerCase());
      const matchListing = listingFilter === "all" || p.listing === listingFilter;
      const matchType = typeFilter === "all" || p.type === typeFilter;
      const matchBeds = bedsFilter === "all" || p.bedrooms >= parseInt(bedsFilter);
      const matchBaths = bathsFilter === "all" || p.bathrooms >= parseInt(bathsFilter);
      const matchTownship = townshipFilter === "all" || p.township.toLowerCase() === townshipFilter.toLowerCase();
      const matchRegion = regionFilter === "all" || (
        regionFilter in REGIONS && REGIONS[regionFilter].townships.some(t => t.en.toLowerCase() === p.township.toLowerCase())
      );
      let matchPrice = true;
      if (minPrice !== "all" || maxPrice !== "all") {
        const priceInLakh = p.price / 100000;
        const min = minPrice !== "all" ? parseInt(minPrice) : 0;
        const max = maxPrice !== "all" ? parseInt(maxPrice) : Infinity;
        matchPrice = priceInLakh >= min && priceInLakh <= max;
      }
      return matchSearch && matchListing && matchType && matchBeds && matchBaths && matchPrice && matchTownship && matchRegion;
    });

    if (sortBy === "priceLow") list = [...list].sort((a,b) => a.price - b.price);
    else if (sortBy === "priceHigh") list = [...list].sort((a,b) => b.price - a.price);
    else list = [...list].sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return list;
  }, [search, listingFilter, typeFilter, regionFilter, townshipFilter, minPrice, maxPrice, bedsFilter, bathsFilter, sortBy, lang]);

  function openProperty(p: Property) {
    setSelected(p);
    setActiveImage(0);
    setSubmitted(false);
    setContactStep("form");
    setContactName("");
    setContactPhone("");
    setChatMessages([]);
    setChatInput("");
    // Increment view count
    setViewCounts(prev => {
      const updated = { ...prev, [p.id]: (prev[p.id] || 0) + 1 };
      if (typeof window !== "undefined") {
        localStorage.setItem("yume_view_counts", JSON.stringify(updated));
      }
      return updated;
    });
  }

  function toggleSave(id: string) {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function handleSubmit() {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setSubmitted(true);
    setContactStep("chat");
    // Auto intro messages from bot
    const msg1 = lang === "my"
      ? `မင်္ဂလာပါ ${contactName}! ${selected?.agentName} မှ ကြိုဆိုပါသည်။ သင်၏ ဆက်သွယ်မှုကို လက်ခံရရှိပါသည်။`
      : `Hello ${contactName}! This is ${selected?.agentName}. We have received your enquiry.`;
    const msg2 = lang === "my"
      ? `"${selected?.titleMy || selected?.title || "ဤအိမ်ခြံမြေ"}" အကြောင်း စိတ်ဝင်စားမှုကို ကျေးဇူးတင်ပါသည်။ ၂၄ နာရီအတွင်း ဆက်သွယ်ပေးပါမည်။ မေးမြန်းလိုသည်များ ရှိပါက ဤနေရာတွင် ရေးနိုင်ပါသည်။`
      : `Thank you for your interest in "${selected?.title || "this property"}". We will contact you within 24 hours. Feel free to leave any questions below.`;
    setChatMessages([
      { from: "bot", text: msg1, time: now() },
      { from: "bot", text: msg2, time: now() },
    ]);
  }

  function handleChatSend() {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: "user", text: chatInput.trim(), time: now() }]);
    setChatInput("");
  }

  const selectStyle = {
    padding: "10px 14px", borderRadius: "4px",
    border: `1px solid ${gold}`, background: cream,
    fontSize: "13px", fontFamily: ff, color: navy,
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eee8dc", fontFamily: ff }}>

      {/* ── MEGA HAMBURGER MENU OVERLAY ── */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex" }}>
          {/* Backdrop */}
          <div onClick={() => { setMenuOpen(false); setMenuSection(null); }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />

          {/* Drawer — slides in from right */}
          <div style={{
            position: "relative", width: "min(100%, 440px)", height: "100%",
            background: "#fff", overflowY: "auto", display: "flex", flexDirection: "column",
            boxShadow: "-4px 0 40px rgba(0,0,0,0.25)", marginLeft: "auto",
          }}>

            {/* ── Drawer header ── */}
            <div style={{ background: navy, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${gold}`, flexShrink: 0 }}>
              <img src="/logo.png" alt="Yume Estate" style={{ height: "36px", filter: "brightness(10)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Language toggle in header */}
                <div style={{ display: "flex", border: `1px solid rgba(189,148,104,0.4)`, borderRadius: "6px", overflow: "hidden" }}>
                  {(["en", "my"] as const).map(l => (
                    <button key={l} onClick={() => setLang(l)}
                      style={{ padding: "6px 12px", background: lang === l ? gold : "transparent", color: lang === l ? navy : gold, border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 700, fontFamily: ff }}>
                      {l === "en" ? "EN" : "MY"}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setMenuOpen(false); setMenuSection(null); }} aria-label="Close menu"
                  style={{ background: "rgba(255,255,255,0.1)", border: `1px solid rgba(189,148,104,0.3)`, borderRadius: "6px", padding: "8px", cursor: "pointer", color: "#fff", display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* ── Tagline strip ── */}
            <div style={{ background: "#1a2e45", padding: "8px 20px", textAlign: "center", flexShrink: 0 }}>
              <p style={{ color: gold, fontSize: "10px", letterSpacing: "3px", margin: 0, fontFamily: ff, fontStyle: "italic" }}>
                {lang === "en" ? "PREMIUM PROPERTIES · TRUSTED AGENTS · MYANMAR" : "အဆင့်မြင့် အိမ်ခြံမြေ · ယုံကြည်ရသော အေးဂျင့်များ"}
              </p>
            </div>

            {/* ── Nav items ── */}
            <div style={{ flex: 1, overflowY: "auto" }}>

              {/* ── BUY ── */}
              <div>
                <button onClick={() => { setListingFilter("sale"); setMenuSection(menuSection === "buy" ? null : "buy"); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: menuSection === "buy" ? "#faf7f2" : "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: menuSection === "buy" ? `3px solid ${gold}` : "3px solid transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: menuSection === "buy" ? navy : "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={menuSection === "buy" ? gold : "#7a6a5a"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Buy" : "ဝယ်ရန်"}</p>
                      <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Properties for sale across Myanmar" : "မြန်မာနိုင်ငံတွင် ရောင်းရန် အိမ်ခြံမြေများ"}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{ transform: menuSection === "buy" ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {menuSection === "buy" && (
                  <div style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfc4" }}>
                    <button onClick={() => { setMainTab("properties"); setListingFilter("sale"); setRegionFilter("all"); setMenuOpen(false); setMenuSection(null); }}
                      style={{ width: "100%", padding: "12px 20px 12px 74px", background: navy, border: "none", borderBottom: `2px solid ${gold}`, cursor: "pointer", textAlign: "left" }}>
                      <span style={{ color: gold, fontSize: "13px", fontFamily: ff, fontWeight: 700 }}>→ {lang === "en" ? "View all properties for sale" : "ရောင်းရန် အိမ်ခြံမြေ အားလုံး"}</span>
                    </button>
                    <div style={{ padding: "14px 20px 14px 74px" }}>
                      <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px", fontFamily: ff }}>
                        {lang === "en" ? "BY LOCATION" : "တည်နေရာ အလိုက်"}
                      </p>
                      {[
                        { en: "Yangon", my: "ရန်ကုန်", r: "yangon", count: "1,200+" },
                        { en: "Mandalay", my: "မန္တလေး", r: "mandalay", count: "340+" },
                        { en: "Naypyidaw", my: "နေပြည်တော်", r: "naypyidaw", count: "180+" },
                        { en: "Bago", my: "ပဲခူး", r: "bago", count: "95+" },
                        { en: "Ayeyarwady", my: "အင်းဝ", r: "ayeyarwady", count: "62+" },
                        { en: "Sagaing", my: "စစ်ကိုင်း", r: "sagaing", count: "48+" },
                      ].map(loc => (
                        <button key={loc.r} onClick={() => { setMainTab("properties"); setListingFilter("sale"); setRegionFilter(loc.r); setMenuOpen(false); setMenuSection(null); }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 0", background: "none", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span style={{ color: "#5a4a3a", fontSize: "14px", fontFamily: ff }}>{lang === "en" ? loc.en : loc.my}</span>
                          </div>
                          <span style={{ color: "#aaa", fontSize: "11px", fontFamily: ff }}>{loc.count}</span>
                        </button>
                      ))}
                      <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "14px 0 10px", fontFamily: ff }}>
                        {lang === "en" ? "BY TYPE" : "အမျိုးအစား အလိုက်"}
                      </p>
                      {[
                        { en: "Condo", my: "ကွန်ဒို", t: "condo", icon: "C" },
                        { en: "House / Landed", my: "အိမ်", t: "house", icon: "H" },
                        { en: "Land / Plot", my: "မြေကွက်", t: "land", icon: "L" },
                        { en: "Apartment", my: "တိုက်ခန်း", t: "apartment", icon: "A" },
                        { en: "Mini Condo", my: "မီနီကွန်ဒို", t: "minicondo", icon: "M" },
                        { en: "Villa", my: "ဗီလာ", t: "villa", icon: "V" },
                        { en: "Penthouse", my: "ပင်ထောင်", t: "penthouse", icon: "P" },
                      ].map(type => (
                        <button key={type.t} onClick={() => { setMainTab("properties"); setListingFilter("sale"); setTypeFilter(type.t); setMenuOpen(false); setMenuSection(null); }}
                          style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 0", background: "none", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", textAlign: "left" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                          <span style={{ color: "#5a4a3a", fontSize: "14px", fontFamily: ff }}>{lang === "en" ? type.en : type.my}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── RENT ── */}
              <div>
                <button onClick={() => { setListingFilter("rent"); setMenuSection(menuSection === "rent" ? null : "rent"); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: menuSection === "rent" ? "#faf7f2" : "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: menuSection === "rent" ? `3px solid ${gold}` : "3px solid transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: menuSection === "rent" ? navy : "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={menuSection === "rent" ? gold : "#7a6a5a"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Rent" : "ငှားရမ်းရန်"}</p>
                      <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Short & long-term rentals" : "အချိန်တိုနှင့် ရှည် ငှားရမ်းမှုများ"}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{ transform: menuSection === "rent" ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {menuSection === "rent" && (
                  <div style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfc4" }}>
                    <button onClick={() => { setMainTab("properties"); setListingFilter("rent"); setRegionFilter("all"); setMenuOpen(false); setMenuSection(null); }}
                      style={{ width: "100%", padding: "12px 20px 12px 74px", background: navy, border: "none", borderBottom: `2px solid ${gold}`, cursor: "pointer", textAlign: "left" }}>
                      <span style={{ color: gold, fontSize: "13px", fontFamily: ff, fontWeight: 700 }}>→ {lang === "en" ? "View all properties for rent" : "ငှားရမ်းရန် အိမ်ခြံမြေ အားလုံး"}</span>
                    </button>
                    <div style={{ padding: "14px 20px 14px 74px" }}>
                      <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px", fontFamily: ff }}>{lang === "en" ? "POPULAR SEARCHES" : "လူကြိုက်များသော ရှာဖွေမှုများ"}</p>
                      {[
                        { en: "Apartments in Yankin", my: "ရန်ကင်း တိုက်ခန်းများ", r: "yangon" },
                        { en: "Condos in Bahan", my: "ဗဟန်း ကွန်ဒိုများ", r: "yangon" },
                        { en: "Houses in Hlaing", my: "လှိုင် အိမ်များ", r: "yangon" },
                        { en: "Offices in Sanchaung", my: "စမ်းချောင်း ရုံးခန်းများ", r: "yangon" },
                        { en: "Mandalay Apartments", my: "မန္တလေး တိုက်ခန်းများ", r: "mandalay" },
                      ].map((s, i) => (
                        <button key={i} onClick={() => { setMainTab("properties"); setListingFilter("rent"); setRegionFilter(s.r); setMenuOpen(false); setMenuSection(null); }}
                          style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 0", background: "none", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", textAlign: "left" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          <span style={{ color: "#5a4a3a", fontSize: "14px", fontFamily: ff }}>{lang === "en" ? s.en : s.my}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── NEW PROJECTS ── */}
              <button onClick={() => { setMainTab("projects"); setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "New Projects" : "စီမံကိန်းသစ်များ"}</p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Latest launches from developers" : "ဒီဗယ်လပ်မာများမှ နောက်ဆုံး ထုတ်ပြန်မှုများ"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── COMMERCIALS ── */}
              <div>
                <button onClick={() => setMenuSection(menuSection === "commercial" ? null : "commercial")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: menuSection === "commercial" ? "#faf7f2" : "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: menuSection === "commercial" ? `3px solid ${gold}` : "3px solid transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: menuSection === "commercial" ? navy : "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={menuSection === "commercial" ? gold : "#7a6a5a"} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Commercials" : "စီးပွားရေး"}</p>
                      <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Office, shop, factory, warehouse" : "ရုံးခန်း၊ ဆိုင်၊ စက်ရုံ၊ ဂိုဒေါင်"}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{ transform: menuSection === "commercial" ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {menuSection === "commercial" && (
                  <div style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfc4", padding: "10px 20px 14px 74px" }}>
                    {[
                      { en: "Office Space", my: "ရုံးခန်း", t: "commercial" },
                      { en: "Shop / Retail", my: "ဆိုင်ခန်း", t: "shop" },
                      { en: "Industrial / Factory", my: "စက်ရုံ / စက်မှုဇုန်", t: "industrial" },
                      { en: "Warehouse / Storage", my: "ဂိုဒေါင်", t: "warehouse" },
                      { en: "Hotel / Restaurant", my: "ဟိုတယ် / စားသောက်ဆိုင်", t: "hotel" },
                      { en: "Hostels / Boarding", my: "ဧည့်ခန်း / အိပ်ခန်းငှားရမ်း", t: "hostel" },
                    ].map(type => (
                      <button key={type.t} onClick={() => { setMainTab("properties"); setTypeFilter(type.t); setMenuOpen(false); setMenuSection(null); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 0", background: "none", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", textAlign: "left" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        <span style={{ color: "#5a4a3a", fontSize: "14px", fontFamily: ff }}>{lang === "en" ? type.en : type.my}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── MAP SEARCH ── */}
              <button onClick={() => { setMainTab("map" as any); setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Map Search" : "မြေပုံ ရှာဖွေရန်"}</p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Find properties by location on map" : "မြေပုံပေါ်တွင် အိမ်ခြံမြေ ရှာဖွေပါ"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── WANTED LISTINGS ── */}
              <button onClick={() => { setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>
                      {lang === "en" ? "Wanted Listings" : "ရှာဖွေနေသော အိမ်ခြံမြေ"}
                      <span style={{ background: "#2d7a3a", color: "#fff", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px", fontWeight: 700 }}>NEW</span>
                    </p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Post what you're looking for — agents find you" : "ရှာနေသည်ကို တင်ပါ — အေးဂျင့်က ရှာပေးမည်"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── PROPERTY GUIDES ── */}
              <div>
                <button onClick={() => setMenuSection(menuSection === "guides" ? null : "guides")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: menuSection === "guides" ? "#faf7f2" : "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: menuSection === "guides" ? `3px solid ${gold}` : "3px solid transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: menuSection === "guides" ? navy : "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={menuSection === "guides" ? gold : "#7a6a5a"} strokeWidth="1.8" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Guides & Knowledge" : "လမ်းညွှန် & အသိပညာ"}</p>
                      <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Buying tips, legal guides, market news" : "ဝယ်ယူမှု အကြံပြု၊ ဥပဒေ လမ်းညွှန်"}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{ transform: menuSection === "guides" ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {menuSection === "guides" && (
                  <div style={{ background: "#faf7f2", borderBottom: "1px solid #e8dfc4", padding: "10px 20px 14px 74px" }}>
                    {[
                      { en: "Buyer's Guide", my: "ဝယ်သူ လမ်းညွှန်" },
                      { en: "Land Title Types Explained", my: "မြေပိုင်ဆိုင်မှု အမျိုးအစားများ" },
                      { en: "Mortgage & Home Loans", my: "အချေးငွေ & နေအိမ်ချေးငွေ" },
                      { en: "Property Investment Tips", my: "အိမ်ခြံမြေ ရင်းနှီးမြှုပ်နှံမှု" },
                      { en: "Myanmar Property Law", my: "မြန်မာ အိမ်ခြံမြေ ဥပဒေ" },
                      { en: "Property News", my: "အိမ်ခြံမြေ သတင်းများ" },
                      { en: "Q&A Forum", my: "မေးဖြေ ဖိုရမ်" },
                    ].map((g, i) => (
                      <button key={i} onClick={() => { setMenuOpen(false); setMenuSection(null); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 0", background: "none", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", textAlign: "left" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        <span style={{ color: "#5a4a3a", fontSize: "14px", fontFamily: ff }}>{lang === "en" ? g.en : g.my}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── MORTGAGE CALCULATOR ── */}
              <button onClick={() => { setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Mortgage Calculator" : "အချေးငွေ တွက်ချက်ကိရိယာ"}</p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Calculate monthly payments in MMK" : "လစဉ်ပြန်ဆပ်ငွေ တွက်ချက်ပါ"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── FIND AGENTS ── */}
              <button onClick={() => { setMainTab("agents"); setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Find Agents & Agencies" : "အေးဂျင့် & အေဂျင်စီ ရှာရန်"}</p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Verified real estate professionals" : "အတည်ပြုထားသော ကျွမ်းကျင်သူများ"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── PROPERTY EXPO ── */}
              <button onClick={() => { setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>
                      {lang === "en" ? "Property Expo & Events" : "အိမ်ခြံမြေ ပြပွဲများ"}
                      <span style={{ background: gold, color: "#fff", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px", fontWeight: 700 }}>SOON</span>
                    </p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "Upcoming property exhibitions" : "လာမည့် အိမ်ခြံမြေ ပြပွဲများ"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── ADVERTISE ── */}
              <button onClick={() => { setMenuOpen(false); setMenuSection(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#fff", border: "none", borderBottom: "1px solid #f0ece4", cursor: "pointer", borderLeft: "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "en" ? "Advertise with Yume" : "Yume နှင့် ကြော်ငြာပါ"}</p>
                    <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "en" ? "List your project or development" : "သင်၏ ပရောဂျက် ကြော်ငြာပါ"}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

            </div>

            {/* ── Footer — Agent portal ── */}
            <div style={{ padding: "16px 20px", borderTop: `2px solid ${gold}`, background: "#faf7f2", flexShrink: 0 }}>
              <button onClick={() => { onAgentLoginClick?.(); setMenuOpen(false); }}
                style={{ width: "100%", background: navy, color: gold, border: `2px solid ${gold}`, padding: "14px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: ff, letterSpacing: "1px", marginBottom: "10px" }}>
                {lang === "en" ? "AGENT LOGIN / SIGN UP" : "အေးဂျင့် ဝင်ရောက် / မှတ်ပုံတင်ရန်"}
              </button>
              <p style={{ color: "#aaa", fontSize: "10px", textAlign: "center", margin: 0, fontFamily: ff }}>
                {lang === "en" ? "© 2025 Yume Estate · Premium Properties · Myanmar" : "© ၂၀၂၅ Yume Estate · မြန်မာ"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER — responsive: full nav desktop, hamburger mobile ── */}
      <style>{`
        .yn-nav { display: flex; }
        .yn-ham { display: none; }
        @media (max-width: 900px) {
          .yn-nav { display: none !important; }
          .yn-ham { display: flex !important; }
        }
        .yn-item { position: relative; height: 80px; display: flex; align-items: center; }
        .yn-btn {
          height: 100%; padding: 0 14px;
          background: none; border: none; cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px; font-weight: 700; color: #222;
          display: flex; align-items: center; gap: 4px;
          letter-spacing: 0.2px; white-space: nowrap; flex-shrink: 0;
        }
        .yn-btn:hover { color: #bd9468; }
        .yn-arrow { font-size: 9px; color: #111d2b; }
        .yn-drop {
          display: none;
          position: absolute; top: 100%; left: 0;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          min-width: 190px;
          padding: 10px 0;
          z-index: 999;
        }
        .yn-item:hover .yn-drop { display: block; }
        .yn-dd-btn {
          display: block; width: 100%;
          padding: 9px 22px;
          background: none; border: none; cursor: pointer;
          text-align: left; font-family: Georgia, serif;
          font-size: 13px; color: #333;
        }
        .yn-dd-btn:hover { color: #bd9468; }
        .yn-dd-top {
          display: block; width: 100%;
          padding: 4px 22px 10px;
          background: none; border: none; cursor: pointer;
          text-align: left; font-family: Georgia, serif;
          font-size: 13px; color: #111d2b; font-weight: 700;
        }
        .yn-dd-top:hover { color: #bd9468; }
        .yn-cat {
          display: block;
          font-size: 10px; color: #bd9468; font-weight: 700;
          letter-spacing: 1.5px; padding: 10px 22px 4px;
        }
        .yn-cat:first-child { padding-top: 4px; }
      `}</style>

      <header style={{ background: "#fbf3da", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${gold}`, height: "80px", position: "sticky", top: 0, zIndex: 200 }}>

        {/* Logo */}
        <img src="/logo.png" alt="Yume Estate" style={{ height: "76px", width: "auto", maxWidth: "220px", flexShrink: 0, objectFit: "contain" }} />

        {/* ── Desktop nav ── */}
        <nav className="yn-nav" style={{ flex: 1, justifyContent: "center", alignItems: "center", height: "80px", display: "flex" }}>

          {/* Buy */}
          <div className="yn-item">
            <button className="yn-btn" onClick={() => { setListingFilter("sale"); setMainTab("properties"); }}>
              {lang === "en" ? "Buy" : "ဝယ်ရန်"} <span className="yn-arrow">▾</span>
            </button>
            <div className="yn-drop">
              <button className="yn-dd-top" onClick={() => { setListingFilter("sale"); setRegionFilter("all"); setMainTab("properties"); }}>
                {lang === "en" ? "View all for sale →" : "ရောင်းရန် အားလုံး →"}
              </button>
              <span className="yn-cat">{lang === "en" ? "LOCATION" : "တည်နေရာ"}</span>
              {[{en:"Yangon",my:"ရန်ကုန်",r:"yangon"},{en:"Mandalay",my:"မန္တလေး",r:"mandalay"},{en:"Naypyidaw",my:"နေပြည်တော်",r:"naypyidaw"},{en:"Bago",my:"ပဲခူး",r:"bago"}].map(l=>(
                <button key={l.r} className="yn-dd-btn" onClick={() => { setListingFilter("sale"); setRegionFilter(l.r); setMainTab("properties"); }}>
                  {lang === "en" ? l.en : l.my}
                </button>
              ))}
              <span className="yn-cat">{lang === "en" ? "TYPE" : "အမျိုးအစား"}</span>
              {[{en:"Condo",my:"ကွန်ဒို",t:"condo"},{en:"House",my:"အိမ်",t:"house"},{en:"Land",my:"မြေ",t:"land"},{en:"Apartment",my:"တိုက်ခန်း",t:"apartment"}].map(t=>(
                <button key={t.t} className="yn-dd-btn" onClick={() => { setListingFilter("sale"); setTypeFilter(t.t); setMainTab("properties"); }}>
                  {lang === "en" ? t.en : t.my}
                </button>
              ))}
            </div>
          </div>

          {/* Rent */}
          <div className="yn-item">
            <button className="yn-btn" onClick={() => { setListingFilter("rent"); setMainTab("properties"); }}>
              {lang === "en" ? "Rent" : "ငှားရမ်းရန်"} <span className="yn-arrow">▾</span>
            </button>
            <div className="yn-drop">
              <button className="yn-dd-top" onClick={() => { setListingFilter("rent"); setRegionFilter("all"); setMainTab("properties"); }}>
                {lang === "en" ? "View all for rent →" : "ငှားရမ်းရန် အားလုံး →"}
              </button>
              <span className="yn-cat">{lang === "en" ? "POPULAR" : "လူကြိုက်များ"}</span>
              {[{en:"Yankin Apartments",my:"ရန်ကင်း တိုက်ခန်း",r:"yangon"},{en:"Bahan Condos",my:"ဗဟန်း ကွန်ဒို",r:"yangon"},{en:"Hlaing Houses",my:"လှိုင် အိမ်",r:"yangon"},{en:"Mandalay Rentals",my:"မန္တလေး ငှားရမ်း",r:"mandalay"}].map((s,i)=>(
                <button key={i} className="yn-dd-btn" onClick={() => { setListingFilter("rent"); setRegionFilter(s.r); setMainTab("properties"); }}>
                  {lang === "en" ? s.en : s.my}
                </button>
              ))}
            </div>
          </div>

          {/* Commercial */}
          <div className="yn-item">
            <button className="yn-btn" onClick={() => { setTypeFilter("commercial"); setMainTab("properties"); }}>
              {lang === "en" ? "Commercial" : "စီးပွားရေး"} <span className="yn-arrow">▾</span>
            </button>
            <div className="yn-drop">
              {[{en:"Office Space",my:"ရုံးခန်း"},{en:"Shop / Retail",my:"ဆိုင်ခန်း"},{en:"Warehouse",my:"ဂိုဒေါင်"},{en:"Factory",my:"စက်ရုံ"}].map((t,i)=>(
                <button key={i} className="yn-dd-btn" onClick={() => { setTypeFilter("commercial"); setMainTab("properties"); }}>
                  {lang === "en" ? t.en : t.my}
                </button>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div className="yn-item">
            <button className="yn-btn">{lang === "en" ? "Guides" : "လမ်းညွှန်"}</button>
          </div>

          {/* Advertise */}
          <div className="yn-item">
            <button className="yn-btn">{lang === "en" ? "Advertise" : "ကြော်ငြာ"}</button>
          </div>

          {/* ── Divider ── */}
          <div style={{ width: "1px", height: "24px", background: "#ddd", margin: "0 6px", flexShrink: 0 }} />

          {/* ── Page tabs (Properties / Map / Projects / Agents) ── */}
          {([
            ["properties", lang === "en" ? "Properties" : "အိမ်ခြံမြေ"],
            ["map", lang === "en" ? "Map" : "မြေပုံ"],
            ["projects", lang === "en" ? "New Projects" : "စီမံကိန်းသစ်"],
            ["agents", lang === "en" ? "Agents" : "အေးဂျင့်"],
          ] as const).map(([tab, label]) => (
            <div key={tab} className="yn-item">
              <button className="yn-btn"
                onClick={() => setMainTab(tab as any)}
                style={{ color: mainTab === tab ? "#bd9468" : "#222", borderBottom: mainTab === tab ? "3px solid #bd9468" : "3px solid transparent", height: "100%", paddingBottom: "0" }}>
                {label}
              </button>
            </div>
          ))}

        </nav>

        {/* ── Desktop right actions ── */}
        <div className="yn-nav" style={{ alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ display: "flex" }}>
            {(["en","my"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ padding: "5px 10px", fontSize: "12px", fontWeight: 700, border: "none", background: lang === l ? navy : "none", color: lang === l ? gold : "#999", borderRadius: "4px", cursor: "pointer", fontFamily: ff }}>
                {l === "en" ? "EN" : "MY"}
              </button>
            ))}
          </div>
          <button onClick={() => onAgentLoginClick?.()}
            style={{ background: navy, color: gold, border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: ff, whiteSpace: "nowrap" }}>
            {lang === "en" ? "Agent Login" : "အေးဂျင့် ဝင်ရောက်"}
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button className="yn-ham" onClick={() => setMenuOpen(true)} aria-label="Open menu"
          style={{ background: navy, border: "none", borderRadius: "8px", padding: "13px 16px", cursor: "pointer", flexDirection: "column", gap: "6px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "24px", height: "2px", background: gold, borderRadius: "2px" }} />
          <div style={{ width: "24px", height: "2px", background: gold, borderRadius: "2px" }} />
          <div style={{ width: "24px", height: "2px", background: gold, borderRadius: "2px" }} />
        </button>

      </header>


      {/* ── SLOGAN STRIP ── */}
      <div style={{ background: "#111d2b", padding: "7px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", borderBottom: "2px solid #bd9468" }}>
        <span style={{ color: "#bd9468", fontSize: "14px" }}>—</span>
        <p style={{ color: "#d4af7a", fontSize: "10px", letterSpacing: "5px", margin: 0, fontStyle: "italic", fontFamily: ff, whiteSpace: "nowrap" }}>
          {lang === "en" ? "PREMIUM PROPERTIES · TRUSTED AGENTS · MYANMAR" : "အဆင့်မြင့် အိမ်ခြံမြေ · ယုံကြည်ရသော အေးဂျင့်များ · မြန်မာ"}
        </p>
        <span style={{ color: "#bd9468", fontSize: "14px" }}>—</span>
      </div>



      {mainTab === "properties" && <>
      {/* ── HERO — cinematic CSS particle background ── */}

      <div style={{ background: "radial-gradient(ellipse at top, #1a2e45 0%, #0a1520 100%)", padding: "40px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>

        {/* Gold line top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #bd9468, transparent)", pointerEvents: "none" }} />

        {/* Gold radial glow top-center */}
        <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(189,148,104,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Twinkling gold particles — pure divs */}
        {[
          {l:"8%",  t:"12%", s:2,   d:2.1}, {l:"23%", t:"67%", s:1.5, d:3.4},
          {l:"37%", t:"23%", s:2.5, d:1.8}, {l:"51%", t:"82%", s:1,   d:4.2},
          {l:"65%", t:"18%", s:2,   d:2.7}, {l:"79%", t:"55%", s:1.5, d:3.1},
          {l:"91%", t:"30%", s:2,   d:1.5}, {l:"14%", t:"45%", s:1,   d:4.8},
          {l:"28%", t:"88%", s:2.5, d:2.3}, {l:"43%", t:"8%",  s:1.5, d:3.7},
          {l:"57%", t:"72%", s:2,   d:1.2}, {l:"71%", t:"38%", s:1,   d:4.5},
          {l:"84%", t:"85%", s:2.5, d:2.9}, {l:"96%", t:"15%", s:1.5, d:3.3},
          {l:"5%",  t:"75%", s:2,   d:1.9}, {l:"19%", t:"32%", s:1,   d:4.1},
          {l:"33%", t:"58%", s:2.5, d:2.6}, {l:"47%", t:"42%", s:1.5, d:3.8},
          {l:"61%", t:"93%", s:2,   d:1.4}, {l:"75%", t:"7%",  s:1,   d:4.6},
          {l:"88%", t:"68%", s:2.5, d:2.2}, {l:"2%",  t:"55%", s:1.5, d:3.5},
          {l:"16%", t:"20%", s:2,   d:1.7}, {l:"30%", t:"78%", s:1,   d:4.3},
          {l:"44%", t:"35%", s:2.5, d:2.8}, {l:"58%", t:"60%", s:1.5, d:3.2},
          {l:"72%", t:"25%", s:2,   d:1.6}, {l:"86%", t:"92%", s:1,   d:4.7},
          {l:"11%", t:"50%", s:2.5, d:2.4}, {l:"25%", t:"5%",  s:1.5, d:3.6},
          {l:"39%", t:"95%", s:2,   d:1.3}, {l:"53%", t:"48%", s:1,   d:4.4},
          {l:"67%", t:"80%", s:2.5, d:2.0}, {l:"81%", t:"42%", s:1.5, d:3.9},
          {l:"94%", t:"62%", s:2,   d:1.1},
        ].map((p, i) => (
          <div key={i} className="yp" style={{
            left: p.l, top: p.t,
            width: `${p.s}px`, height: `${p.s}px`,
            animation: `${i % 3 === 0 ? "yumeTwinkleA" : i % 3 === 1 ? "yumeTwinkleB" : "yumeTwinkleC"} ${p.d}s ease-in-out infinite`,
          }} />
        ))}
        <h1 style={{ color: white, fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2, fontFamily: ff, letterSpacing: "-0.5px", position: "relative" }}>{t.hero1}</h1>
        <h2 style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", fontWeight: 400, margin: "0 0 28px", fontFamily: ff, position: "relative" }}>{t.hero2}</h2>

        {/* ── BUY / RENT toggle ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", position: "relative" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "4px", display: "inline-flex" }}>
            {([["sale", lang === "my" ? "ဝယ်ရန်" : "Buy"],
               ["rent", lang === "my" ? "ငှားရမ်းရန်" : "Rent"]] as const).map(([v, label]) => (
              <button key={v}
                onClick={() => { setListingFilter(v); setMinPrice("all"); setMaxPrice("all"); }}
                style={{
                  padding: "11px 44px", borderRadius: "10px", border: "none", cursor: "pointer",
                  background: listingFilter === v || (v === "sale" && listingFilter === "all") ? white : "transparent",
                  color: listingFilter === v || (v === "sale" && listingFilter === "all") ? navy : "rgba(255,255,255,0.65)",
                  fontSize: "15px", fontWeight: 700, fontFamily: ff, transition: "all 0.2s",
                  boxShadow: listingFilter === v || (v === "sale" && listingFilter === "all") ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search panel — centered ── */}
        <div style={{ maxWidth: "740px", margin: "0 auto", background: white, borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", position: "relative" }}>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Row 2 — Keyword search */}
            <div style={{ position: "relative" }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{ width: "100%", padding: "12px 16px 12px 40px", border: `1px solid #ddd5c0`, borderRadius: "6px", fontSize: "14px", fontFamily: ff, color: navy, boxSizing: "border-box", outline: "none" }} />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: gold, fontSize: "16px" }}></span>
            </div>

                {/* Region → Township */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <select value={regionFilter} onChange={e => { setRegionFilter(e.target.value); setTownshipFilter("all"); }}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="all">{lang === "en" ? "All Regions" : "ဒေသများ အားလုံး"}</option>
                    {Object.entries(REGIONS).map(([key, r]) => (
                      <option key={key} value={key}>{lang === "en" ? r.en : r.my}</option>
                    ))}
                  </select>
                  <select value={townshipFilter} onChange={e => setTownshipFilter(e.target.value)}
                    disabled={regionFilter === "all"}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid ${regionFilter === "all" ? "#e8dfc4" : "#ddd5c0"}`, background: regionFilter === "all" ? "#f5f0e8" : "#faf7f2", fontSize: "13px", fontFamily: ff, color: regionFilter === "all" ? "#aaa" : navy, cursor: regionFilter === "all" ? "not-allowed" : "pointer" }}>
                    <option value="all">{lang === "en" ? (regionFilter === "all" ? "Select Region First" : "All Townships") : (regionFilter === "all" ? "ဒေသ အရင်ရွေးပါ" : "မြို့နယ်အားလုံး")}</option>
                    {regionFilter !== "all" && REGIONS[regionFilter]?.townships.map(tp => (
                      <option key={tp.en} value={tp.en}>{lang === "en" ? tp.en : tp.my}</option>
                    ))}
                  </select>
                </div>

                {/* Type + Beds */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="all">{t.allTypes}</option>
                    {types.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                  </select>
                  <select value={bedsFilter} onChange={e => setBedsFilter(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="all">{t.anyBeds}</option>
                    <option value="1">{t.bed1}</option>
                    <option value="2">{t.bed2}</option>
                    <option value="3">{t.bed3}</option>
                    <option value="4">{t.bed4}</option>
                  </select>
                </div>

                {/* Baths + Sort */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <select value={bathsFilter} onChange={e => setBathsFilter(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="all">{t.anyBaths}</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="newest">{t.newest}</option>
                    <option value="price_asc">{t.priceLow}</option>
                    <option value="price_desc">{t.priceHigh}</option>
                    <option value="featured">{t.featured}</option>
                  </select>
                </div>

                {/* Min + Max price */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <select value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="all">{t.minPrice}</option>
                    {(listingFilter === "rent" ? [1,2,3,5,8,10,15,20,30,50,100] : [100,200,300,400,500,600,700,800,900,1000,1500,2000,3000,5000,7000,10000,15000,20000,50000,999999]).map(v => (
                      <option key={v} value={v}>{v === 999999 ? (lang === "en" ? "50,000+ Lakh" : "သိန်း ၅၀,၀၀၀ အထက်") : `${v.toLocaleString()} ${lang === "en" ? "Lakh" : "သိန်း"}`}</option>
                    ))}
                  </select>
                  <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "6px", border: `1px solid #ddd5c0`, background: "#faf7f2", fontSize: "13px", fontFamily: ff, color: navy }}>
                    <option value="all">{t.maxPrice}</option>
                    {(listingFilter === "rent" ? [1,2,3,5,8,10,15,20,30,50,100] : [100,200,300,400,500,600,700,800,900,1000,1500,2000,3000,5000,7000,10000,15000,20000,50000,999999]).map(v => (
                      <option key={v} value={v}>{v === 999999 ? (lang === "en" ? "50,000+ Lakh" : "သိန်း ၅၀,၀၀၀ အထက်") : `${v.toLocaleString()} ${lang === "en" ? "Lakh" : "သိန်း"}`}</option>
                    ))}
                  </select>
                </div>

                {/* Search button */}
                <button style={{ width: "100%", background: navy, color: gold, border: `2px solid ${gold}`, padding: "14px", borderRadius: "6px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: ff, letterSpacing: lang === "en" ? "2px" : "0" }}>
                  {lang === "en" ? "SEARCH" : "ရှာဖွေပါ"}
                </button>

                {/* Quick reset */}
                {(search || listingFilter !== "all" || typeFilter !== "all" || regionFilter !== "all" || minPrice !== "all" || maxPrice !== "all" || bedsFilter !== "all" || bathsFilter !== "all") && (
                  <button onClick={() => { setSearch(""); setListingFilter("all"); setTypeFilter("all"); setRegionFilter("all"); setTownshipFilter("all"); setMinPrice("all"); setMaxPrice("all"); setBedsFilter("all"); setBathsFilter("all"); }}
                    style={{ width: "100%", background: "transparent", color: "#7a6a5a", border: "1px solid #ddd5c0", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: ff }}>
                    ✕ {t.clearFilters}
                  </button>
                )}

          </div>
        </div>
      </div>


      {/* ── CATEGORY PAGE ── */}
      {activeCategory && CATEGORIES[activeCategory] && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, overflowY: "auto", background: "#f8f6f2" }}>
          <CategoryPage
            category={CATEGORIES[activeCategory]}
            lang={lang}
            defaultListingType={listingFilter === "rent" ? "rent" : "sale"}
            onBack={() => setActiveCategory(null)}
            onPropertyClick={(p) => { setActiveCategory(null); openProperty(p); }}
            allProperties={PROPERTIES}
          />
        </div>
      )}

      {/* ── DD PROPERTY INSPIRED SECTIONS ── */}
      <HomePageSections
        lang={lang}
        listingType={listingFilter === "rent" ? "rent" : "sale"}
        onPropertyClick={(id) => { const p = PROPERTIES.find(x => x.id === id); if (p) openProperty(p); }}
        onViewMore={(categoryId: string) => setActiveCategory(categoryId)}
      />

      {/* ── ADVERTISEMENT BANNERS ── */}
      <div style={{ background: "#ffffff", padding: "32px 40px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#aaa", fontSize: "10px", letterSpacing: "3px", margin: "0 0 14px", fontFamily: ff, textAlign: "center" }}>
            {lang === "my" ? "ပေးငွေပေးကြော်ငြာများ" : "SPONSORED DEVELOPERS"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {[
              { dev: "Golden Hill Development", tagline: lang === "my" ? "ရန်ကုန်၏ အမြင့်ဆုံး ကွန်ဒို — ရန်ကင်းမြို့နယ်" : "Yangon's Most Premium Condo — Yankin Township", badge: "NEW LAUNCH", badgeBg: "#2d7a3a", bg: "#f0faf2", border: "#2d7a3a", textColor: "#1a4a22" },
              { dev: "Shwe Taung Group", tagline: lang === "my" ? "မြန်မာ၏ ယုံကြည်ရဆုံး ဆောက်လုပ်ရေးကုမ္ပဏီ" : "Myanmar's Most Trusted Developer Since 1990", badge: "FEATURED", badgeBg: gold, bg: "#fffbf0", border: gold, textColor: "#5a3a0a" },
              { dev: "KT Construction Group", tagline: lang === "my" ? "အရည်အသွေး မြင့်မားသော ကွန်ဒို စီမံကိန်းသစ်" : "Premium Quality Condo — New Launch 2026", badge: "PREMIUM", badgeBg: navy, bg: "#f0f4ff", border: "#2d4a8e", textColor: "#1a2e5f" },
            ].map((ad, i) => (
              <div key={i} style={{ background: ad.bg, border: `2px solid ${ad.border}`, borderRadius: "8px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div>
                  <span style={{ background: ad.badgeBg, color: "#fff", fontSize: "10px", padding: "3px 10px", borderRadius: "3px", fontWeight: 700, letterSpacing: "1px", display: "inline-block", marginBottom: "8px" }}>{ad.badge}</span>
                  <p style={{ color: navy, fontSize: "15px", fontWeight: 700, margin: "0 0 3px", fontFamily: ff }}>{ad.dev}</p>
                  <p style={{ color: ad.textColor, fontSize: "12px", margin: 0, fontFamily: ff }}>{ad.tagline}</p>
                </div>
                <div style={{ background: ad.badgeBg, color: "#fff", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BROWSE BY CATEGORY ── */}
      <div style={{ background: "#ffffff", padding: "32px 40px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#888888", fontSize: "11px", letterSpacing: "2px", margin: "0 0 16px", fontFamily: ff, fontWeight: 600 }}>
            {lang === "my" ? "အမျိုးအစားဖြင့် ရှာဖွေပါ" : "BROWSE BY CATEGORY"}
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {([
              { en: "Condo", my: "ကွန်ဒို", count: "2,847", color: "#111d2b", text: "#bd9468",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="1" width="14" height="16" rx="1" stroke="currentColor" strokeWidth="1.4"/><line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1"/><line x1="12" y1="1" x2="12" y2="17" stroke="currentColor" strokeWidth="1"/><line x1="2" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1"/><line x1="2" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1"/></svg> },
              { en: "House", my: "အိမ်", count: "1,293", color: "#78350f", text: "#ffffff",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 8L9 2L16 8V17H11V12H7V17H2V8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> },
              { en: "Apartment", my: "အပါတ်မန့်", count: "3,421", color: "#1e3a5f", text: "#ffffff",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="15" rx="1" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1"/><line x1="2" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1"/><line x1="7" y1="2" x2="7" y2="17" stroke="currentColor" strokeWidth="1"/><line x1="12" y1="2" x2="12" y2="17" stroke="currentColor" strokeWidth="1"/></svg> },
              { en: "Land", my: "မြေ", count: "892", color: "#166534", text: "#ffffff",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 7L10 11L13 6L16 14H2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><line x1="2" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { en: "Office", my: "ရုံးခန်း", count: "445", color: "#581c87", text: "#ffffff",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="1" width="14" height="16" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="5" y="5" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/><rect x="10" y="5" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/><rect x="5" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/><rect x="10" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/></svg> },
              { en: "Penthouse", my: "ပင်ထောင်", count: "128", color: "#92400e", text: "#ffffff",
                icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 10L9 3L16 10V17H2V10Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><line x1="9" y1="3" x2="9" y2="1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="7" y1="1" x2="11" y2="1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="6" y="12" width="6" height="5" stroke="currentColor" strokeWidth="1"/></svg> },
            ] as any[]).map((cat, i) => (
              <button key={i}
                onClick={() => setTypeFilter(cat.en)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px",
                  borderRadius: "10px", border: "none",
                  background: typeFilter === cat.en ? cat.color : "#ffffff",
                  color: typeFilter === cat.en ? cat.text : "#111111",
                  boxShadow: typeFilter === cat.en ? "0 4px 16px rgba(0,0,0,0.2)" : "0 0 0 1.5px #111d2b",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (typeFilter !== cat.en) { (e.currentTarget as HTMLButtonElement).style.background = cat.color; (e.currentTarget as HTMLButtonElement).style.color = cat.text; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; }}}
                onMouseLeave={e => { if (typeFilter !== cat.en) { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.color = "#111111"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 1.5px #111d2b"; }}}>
                <span style={{ display: "flex", color: "inherit" }}>{cat.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: "inherit", fontSize: "13px", fontWeight: 700, margin: 0, fontFamily: ff }}>{lang === "my" ? cat.my : cat.en}</p>
                  <p style={{ color: typeFilter === cat.en ? "rgba(255,255,255,0.65)" : "#888888", fontSize: "11px", margin: 0, fontFamily: ff }}>{cat.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── UPCOMING EVENTS ── */}
      <div style={{ background: "#ffffff", padding: "64px 40px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <p style={{ color: gold, fontSize: "11px", letterSpacing: "3px", margin: "0 0 4px", fontFamily: ff }}>
                {lang === "my" ? "ဖိတ်ကြားလိုသည်" : "UPCOMING"}
              </p>
              <h2 style={{ color: navy, fontSize: "22px", fontWeight: 400, margin: 0, fontFamily: ff }}>
                {lang === "my" ? "အိမ်ခြံမြေ အရောင်းပြပွဲများ" : "Property Events & Expos"}
              </h2>
            </div>
            <button style={{ background: "transparent", border: `1px solid ${gold}`, color: navy, padding: "8px 18px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", fontFamily: ff, letterSpacing: "1px" }}>
              {lang === "my" ? "အားလုံးကြည့်ရန်" : "VIEW ALL"} →
            </button>
          </div>

          {/* Event cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              {
                id: "E1", featured: true,
                title: "Yangon Property Expo 2026", titleMy: "ရန်ကုန် အိမ်ခြံမြေ ပြပွဲ ၂၀၂၆",
                organizer: "Yume Estate", organizerMy: "Yume Estate",
                date: "7 & 8 June 2026", dateMy: "၂၀၂၆ ခုနှစ် ဇွန်လ ၇ & ၈ ရက်",
                day: "Saturday & Sunday", dayMy: "စနေ & တနင်္ဂနွေ",
                venue: "Novotel Yangon Max, Yankin", venueMy: "နိုဗိုတယ် ရန်ကုန်မက်စ်၊ ရန်ကင်း",
                city: "Yangon", cityMy: "ရန်ကုန်",
                developers: ["Golden Hill", "Premier Homes", "KT Group", "Shwe Taung"],
                gradient: ["#1a2e45", "#2d4a6e"],
                tag: "FLAGSHIP EVENT", tagMy: "အဓိက ပွဲတော်",
              },
              {
                id: "E2", featured: false,
                title: "Mandalay Real Estate Fair", titleMy: "မန္တလေး အိမ်ခြံမြေ ဖြစ်ပွဲ",
                organizer: "Yume Estate", organizerMy: "Yume Estate",
                date: "21 June 2026", dateMy: "၂၀၂၆ ခုနှစ် ဇွန်လ ၂၁ ရက်",
                day: "Sunday", dayMy: "တနင်္ဂနွေ",
                venue: "Mandalay Hill Resort Hotel", venueMy: "မန္တလေးဟစ် ရီဆော့တ် ဟိုတယ်",
                city: "Mandalay", cityMy: "မန္တလေး",
                developers: ["Mandalay Elite", "Royal Builders", "Heritage Dev"],
                gradient: ["#2d1a0d", "#4a2e1a"],
                tag: "REGIONAL EXPO", tagMy: "ဒေသဆိုင်ရာ ပြပွဲ",
              },
              {
                id: "E3", featured: false,
                title: "Condo Investment Seminar", titleMy: "ကွန်ဒို ရင်းနှီးမြှုပ်နှံမှု သင်တန်း",
                organizer: "Yume Estate", organizerMy: "Yume Estate",
                date: "14 June 2026", dateMy: "၂၀၂၆ ခုနှစ် ဇွန်လ ၁၄ ရက်",
                day: "Sunday", dayMy: "တနင်္ဂနွေ",
                venue: "Chatrium Hotel, Yangon", venueMy: "ချတ်ထရီယမ် ဟိုတယ်၊ ရန်ကုန်",
                city: "Yangon", cityMy: "ရန်ကုန်",
                developers: ["Grand Tower Dev", "Pun Hlaing Estate"],
                gradient: ["#1e3a5f", "#0d1f33"],
                tag: "SEMINAR", tagMy: "သင်တန်း",
              },
            ].map(event => (
              <div key={event.id} style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", border: event.featured ? `2px solid ${gold}` : "1px solid #e0d8cc", boxShadow: event.featured ? `0 4px 20px rgba(189,148,104,0.2)` : "none" }}>

                {/* Event banner */}
                <div style={{ height: "140px", background: `linear-gradient(135deg, ${event.gradient[0]}, ${event.gradient[1]})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 6px", fontFamily: ff }}>
                      {lang === "my" ? event.tagMy : event.tag}
                    </p>
                    <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 600, margin: 0, lineHeight: 1.3, fontFamily: ff }}>
                      {lang === "my" ? event.titleMy : event.title}
                    </h3>
                  </div>
                  {event.featured && (
                    <div style={{ position: "absolute", top: "10px", right: "10px", background: gold, color: "#fff", fontSize: "9px", padding: "3px 8px", borderRadius: "2px", fontWeight: 700, letterSpacing: "1px" }}>
                      ⭐ {lang === "my" ? "အထူးဖော်ပြ" : "FEATURED"}
                    </div>
                  )}
                </div>

                {/* Event details */}
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "13px" }}></span>
                      <div>
                        <p style={{ color: navy, fontSize: "13px", fontWeight: 600, margin: 0, fontFamily: ff }}>{lang === "my" ? event.dateMy : event.date}</p>
                        <p style={{ color: gold, fontSize: "11px", margin: 0, fontFamily: ff }}>{lang === "my" ? event.dayMy : event.day}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "13px" }}></span>
                      <p style={{ color: "#5a4a3a", fontSize: "12px", margin: 0, lineHeight: 1.4, fontFamily: ff }}>{lang === "my" ? event.venueMy : event.venue}</p>
                    </div>
                  </div>

                  {/* Developer logos strip */}
                  <div style={{ borderTop: "1px solid #e8dfc4", paddingTop: "10px", marginBottom: "12px" }}>
                    <p style={{ color: "#7a6a5a", fontSize: "10px", letterSpacing: "1px", margin: "0 0 6px", fontFamily: ff }}>
                      {lang === "my" ? "ပါဝင်သော ဆောက်လုပ်ရေးများ" : "PARTICIPATING DEVELOPERS"}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {event.developers.map((d, i) => (
                        <span key={i} style={{ background: "#faf7f2", border: "1px solid #e8dfc4", color: navy, fontSize: "10px", padding: "3px 8px", borderRadius: "2px", fontFamily: ff }}>{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Register button */}
                  <button style={{ width: "100%", background: navy, color: gold, border: `2px solid ${gold}`, padding: "10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontFamily: ff, fontWeight: 600, letterSpacing: lang === "my" ? "0" : "1px" }}>
                     {lang === "my" ? "မှတ်ပုံတင်ရန်" : "REGISTER FREE"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Developer logos marquee strip */}
          <div style={{ marginTop: "24px", padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #e0d8cc" }}>
            <p style={{ color: "#7a6a5a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 12px", textAlign: "center", fontFamily: ff }}>
              {lang === "my" ? "မိတ်ဖက် ဆောက်လုပ်ရေး ကုမ္ပဏီများ" : "PARTNER DEVELOPERS"}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              {["Golden Hill Dev", "KT Group", "Shwe Taung", "Premier Homes", "Mandalay Elite", "Pun Hlaing Estate", "Grand Tower Dev"].map((dev, i) => (
                <div key={i} style={{ background: "#faf7f2", border: `1px solid ${gold}`, borderRadius: "4px", padding: "8px 16px" }}>
                  <p style={{ color: navy, fontSize: "11px", fontWeight: 600, margin: 0, fontFamily: ff }}>{dev}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      </>}

      {/* ── MAP SEARCH ── */}
      {mainTab === "map" && (
        <MapSearchView
          properties={PROPERTIES}
          lang={lang}
          onPropertyClick={(p) => openProperty(p)}
        />
      )}

      {/* ── AGENT DIRECTORY ── */}
      {mainTab === "agents" && (
        <div style={{ background: "#f8f5f0", minHeight: "60vh" }}>

          {/* Hero banner */}
          <div style={{ background: `linear-gradient(150deg, ${navy} 0%, #1a2e45 100%)`, padding: "48px 24px 36px", textAlign: "center" }}>
            <p style={{ color: gold, fontSize: "11px", letterSpacing: "4px", margin: "0 0 10px", fontFamily: ff }}>
              {lang === "en" ? "VERIFIED PROFESSIONALS" : "အတည်ပြုထားသော ကျွမ်းကျင်သူများ"}
            </p>
            <h1 style={{ color: "#fff", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 400, margin: "0 0 10px", fontFamily: ff, letterSpacing: "-0.5px" }}>
              {lang === "en" ? "Find Your Agent" : "သင်၏ အေးဂျင့် ရှာပါ"}
            </h1>
            <p style={{ color: "#8fafc8", fontSize: "14px", margin: "0 0 28px", fontFamily: ff }}>
              {lang === "en" ? "Every agent is verified, licensed and rated by real buyers" : "အေးဂျင့်တိုင်းကို အစစ်အမှန် ဝယ်သူများမှ အတည်ပြုပြီး အဆင့်သတ်မှတ်ထားသည်"}
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 5vw, 60px)", flexWrap: "wrap" }}>
              {[
                { num: "120+", en: "Active Agents", my: "တက်ကြွသောအေးဂျင့်" },
                { num: "4,800+", en: "Properties Listed", my: "တင်ထားသောအိမ်ခြံမြေ" },
                { num: "98%", en: "Verified", my: "အတည်ပြုပြီး" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ color: gold, fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, margin: "0 0 4px", fontFamily: ff }}>{s.num}</p>
                  <p style={{ color: "#8fafc8", fontSize: "12px", margin: 0, fontFamily: ff }}>{lang === "en" ? s.en : s.my}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e0d8cc", padding: "16px 24px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a6a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={agentSearch} onChange={e => setAgentSearch(e.target.value)}
                  placeholder={lang === "en" ? "Search by name or agency..." : "နာမည် သို့မဟုတ် အေဂျင်စီ ရှာပါ..."}
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: "8px", border: "1px solid #e0d8cc", fontSize: "14px", fontFamily: ff, boxSizing: "border-box", outline: "none" }} />
              </div>
              <select value={agentRegion} onChange={e => { setAgentRegion(e.target.value); setAgentTownship("all"); }}
                style={{ padding: "12px 14px", borderRadius: "8px", border: "1px solid #e0d8cc", fontSize: "14px", fontFamily: ff, background: "#fff", minWidth: "140px" }}>
                <option value="all">{lang === "en" ? "All Regions" : "မြေပိုင်နက်အားလုံး"}</option>
                {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{lang === "en" ? v.en : v.my}</option>)}
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "0 4px" }}>
                <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: gold }} />
                <span style={{ color: "#5a4a3a", fontSize: "13px", fontFamily: ff, whiteSpace: "nowrap" }}>{lang === "en" ? "Verified only" : "အတည်ပြုထားသာ"}</span>
              </label>
            </div>
          </div>

          {/* Agent cards grid */}
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px clamp(16px, 4vw, 28px)" }}>
            <p style={{ color: "#7a6a5a", fontSize: "13px", margin: "0 0 24px", fontFamily: ff }}>
              <strong style={{ color: navy }}>{AGENTS.filter(a => {
                const name = lang === "en" ? a.name : a.nameMy;
                const agency = lang === "en" ? a.agency : a.agencyMy;
                return (!agentSearch || name.toLowerCase().includes(agentSearch.toLowerCase()) || agency.toLowerCase().includes(agentSearch.toLowerCase())) &&
                  (agentRegion === "all" || a.region === agentRegion) &&
                  (!verifiedOnly || a.verified);
              }).length}</strong> {lang === "en" ? "agents found" : "ဦး တွေ့ရသည်"}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "20px" }}>
              {AGENTS
                .filter(a => {
                  const name = lang === "en" ? a.name : a.nameMy;
                  const agency = lang === "en" ? a.agency : a.agencyMy;
                  return (!agentSearch || name.toLowerCase().includes(agentSearch.toLowerCase()) || agency.toLowerCase().includes(agentSearch.toLowerCase())) &&
                    (agentRegion === "all" || a.region === agentRegion) &&
                    (!verifiedOnly || a.verified);
                })
                .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                .map(agent => (
                  <div key={agent.id} style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: agent.featured ? `2px solid ${gold}` : "1px solid #e8dfc8",
                    boxShadow: agent.featured ? "0 8px 32px rgba(189,148,104,0.15)" : "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = agent.featured ? "0 8px 32px rgba(189,148,104,0.15)" : "0 2px 12px rgba(0,0,0,0.06)"; }}>

                    {/* Card top — navy banner with avatar */}
                    <div style={{ background: `linear-gradient(135deg, ${navy}, #1a2e45)`, padding: "24px 24px 0", position: "relative" }}>
                      {agent.featured && (
                        <div style={{ position: "absolute", top: "12px", right: "12px", background: gold, color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", padding: "4px 10px", borderRadius: "4px", fontFamily: ff }}>
                          ★ FEATURED
                        </div>
                      )}
                      {/* Avatar */}
                      <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: navy, fontWeight: 800, border: `3px solid ${gold}`, marginBottom: "16px", fontFamily: ff }}>
                        {agent.avatar}
                      </div>
                      {/* Name + verified */}
                      <div style={{ paddingBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <p style={{ color: "#fff", fontSize: "17px", fontWeight: 600, margin: 0, fontFamily: ff }}>
                            {lang === "en" ? agent.name : agent.nameMy}
                          </p>
                          {agent.verified && (
                            <span style={{ background: "rgba(45,122,58,0.25)", color: "#4cd964", fontSize: "10px", padding: "2px 8px", borderRadius: "999px", border: "1px solid rgba(45,122,58,0.4)", fontFamily: ff }}>
                              ✓ {lang === "en" ? "Verified" : "အတည်ပြုပြီး"}
                            </span>
                          )}
                        </div>
                        <p style={{ color: gold, fontSize: "12px", margin: "4px 0 0", fontFamily: ff }}>
                          {lang === "en" ? agent.agency : agent.agencyMy}
                        </p>
                        <p style={{ color: "#8fafc8", fontSize: "11px", margin: "4px 0 0", fontFamily: ff }}>
                          {agent.township} · {lang === "en" ? REGIONS[agent.region]?.en : REGIONS[agent.region]?.my}
                        </p>
                      </div>
                    </div>

                    {/* Stats strip */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: "#faf7f2", borderBottom: "1px solid #e8dfc8" }}>
                      {[
                        { val: agent.activeListings, en: "Listings", my: "လစ်ဆင်း" },
                        { val: agent.totalSold, en: "Sold", my: "ရောင်းပြီး" },
                        { val: agent.rating, en: "Rating", my: "အဆင့်" },
                      ].map((s, i) => (
                        <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid #e8dfc8" : "none" }}>
                          <p style={{ color: gold, fontSize: "16px", fontWeight: 700, margin: "0 0 2px", fontFamily: ff }}>{s.val}</p>
                          <p style={{ color: "#7a6a5a", fontSize: "10px", margin: 0, fontFamily: ff }}>{lang === "en" ? s.en : s.my}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bio + specializations */}
                    <div style={{ padding: "16px 20px" }}>
                      <p style={{ color: "#5a4a3a", fontSize: "12px", lineHeight: 1.6, margin: "0 0 12px", fontFamily: ff, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {lang === "en" ? agent.bio : agent.bioMy}
                      </p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {(lang === "en" ? agent.specializations : agent.specializationsMy).map((s, i) => (
                          <span key={i} style={{ background: "#f5f0e8", border: `1px solid ${gold}`, color: navy, fontSize: "10px", padding: "3px 10px", borderRadius: "999px", fontFamily: ff }}>{s}</span>
                        ))}
                        <span style={{ background: "#f0faf2", border: "1px solid #2d7a3a", color: "#2d7a3a", fontSize: "10px", padding: "3px 10px", borderRadius: "999px", fontFamily: ff }}>
                          {agent.responseTime}
                        </span>
                      </div>

                      {/* CTA buttons */}
                      {selectedAgent?.id !== agent.id ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <button onClick={() => { setSelectedAgent(agent); setAgentContactName(""); setAgentContactPhone(""); setAgentContactSubmitted(false); }}
                            style={{ background: navy, color: gold, border: `2px solid ${gold}`, padding: "11px 8px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: ff, fontWeight: 700 }}>
                            {lang === "en" ? "Message" : "မက်ဆေ့"}
                          </button>
                          <button onClick={() => setMainTab("properties")}
                            style={{ background: "transparent", color: navy, border: "1px solid #ddd5c0", padding: "11px 8px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: ff }}>
                            {lang === "en" ? `${agent.activeListings} Listings` : `လစ်ဆင်း ${agent.activeListings}`}
                          </button>
                        </div>
                      ) : !agentContactSubmitted ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <input value={agentContactName} onChange={e => setAgentContactName(e.target.value)}
                            placeholder={lang === "en" ? "Your name" : "နာမည်"}
                            style={{ padding: "10px 12px", borderRadius: "6px", border: "1px solid #ddd5c0", fontSize: "13px", fontFamily: ff }} />
                          <input value={agentContactPhone} onChange={e => setAgentContactPhone(e.target.value)}
                            placeholder={lang === "en" ? "Your phone" : "ဖုန်းနံပါတ်"}
                            style={{ padding: "10px 12px", borderRadius: "6px", border: "1px solid #ddd5c0", fontSize: "13px", fontFamily: ff }} />
                          <button onClick={() => { if (agentContactName && agentContactPhone) setAgentContactSubmitted(true); }}
                            style={{ background: gold, color: "#fff", border: "none", padding: "11px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: ff, fontWeight: 700 }}>
                            {lang === "en" ? "Get Contact →" : "ဆက်သွယ်ရေး ရယူရန် →"}
                          </button>
                          <button onClick={() => setSelectedAgent(null)}
                            style={{ background: "none", border: "none", color: "#7a6a5a", fontSize: "12px", cursor: "pointer", fontFamily: ff }}>
                            {lang === "en" ? "Cancel" : "မလုပ်တော့ပါ"}
                          </button>
                        </div>
                      ) : (
                        <div style={{ background: navy, borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                          <p style={{ color: gold, fontSize: "9px", margin: "0 0 4px", letterSpacing: "2px", fontFamily: ff }}>DIRECT LINE</p>
                          <p style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px", fontFamily: ff }}>{agent.phone}</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <a href={`tel:${agent.phone}`}
                              style={{ background: gold, color: "#fff", padding: "10px", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontFamily: ff, fontWeight: 700, textAlign: "center" }}>
                              {lang === "en" ? "Call" : "ဖုန်းဆက်"}
                            </a>
                            <a href={`viber://chat?number=${agent.phone.replace(/\D/g,'').replace(/^09/, '+959')}`}
                              style={{ background: "#7360f2", color: "#fff", padding: "10px", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontFamily: ff, fontWeight: 700, textAlign: "center" }}>
                              Viber
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Empty state */}
            {AGENTS.filter(a => {
              const name = lang === "en" ? a.name : a.nameMy;
              return (!agentSearch || name.toLowerCase().includes(agentSearch.toLowerCase())) && (agentRegion === "all" || a.region === agentRegion) && (!verifiedOnly || a.verified);
            }).length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px", display: "block" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p style={{ color: navy, fontSize: "18px", fontWeight: 600, margin: "0 0 8px", fontFamily: ff }}>{lang === "en" ? "No agents found" : "အေးဂျင့် မတွေ့ပါ"}</p>
                <p style={{ color: "#7a6a5a", fontSize: "14px", fontFamily: ff }}>{lang === "en" ? "Try a different search or region" : "ရှာဖွေမှု သို့မဟုတ် ဒေသ ပြောင်းကြည့်ပါ"}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NEW DEVELOPMENT PROJECTS ── */}
      {mainTab === "projects" && (
        <div style={{ background: "#eee8dc", minHeight: "60vh" }}>

          {/* Hero */}
          <div style={{ background: `linear-gradient(160deg, ${navy}, ${darkNavy})`, padding: "48px 28px", textAlign: "center" }}>
            <p style={{ color: gold, fontSize: "11px", letterSpacing: "4px", margin: "0 0 8px", fontFamily: ff }}>
              {lang === "en" ? "EXCLUSIVE LISTINGS" : "အထူး ဖော်ပြချက်များ"}
            </p>
            <h1 style={{ color: cream, fontSize: "30px", fontWeight: 400, margin: "0 0 8px", fontFamily: ff }}>
              {lang === "en" ? "New Development Projects" : "စီမံကိန်းသစ်များ"}
            </h1>
            <p style={{ color: "#8fafc8", fontSize: "14px", margin: "0 0 20px", fontFamily: ff }}>
              {lang === "en" ? "Invest early in Myanmar's most exciting upcoming developments — Yangon, Mandalay, Naypyidaw, Taunggyi & Hpa-An" : "ရန်ကုန်၊ မန္တလေး၊ နေပြည်တော်၊ တောင်ကြီး နှင့် ဟားခါး၏ အကောင်းဆုံး စီမံကိန်းသစ်များတွင် အစောပိုင်း ရင်းနှီးမြှုပ်နှံပါ"}
            </p>
            <div style={{ display: "inline-flex", background: "rgba(189,148,104,0.15)", border: `1px solid ${gold}`, borderRadius: "999px", padding: "6px 20px" }}>
              <p style={{ color: gold, fontSize: "12px", margin: 0, fontFamily: ff }}>
                 {lang === "en" ? "Advertise your project here — contact Yume Estate" : "သင်၏ စီမံကိန်းကို ဤနေရာတွင် ကြော်ငြာပါ — Yume Estate သို့ ဆက်သွယ်ပါ"}
              </p>
            </div>
          </div>

          {/* City filter tabs */}
          <div style={{ background: "#fbf3da", borderBottom: `1px solid ${gold}`, display: "flex", overflowX: "auto", padding: "0 20px" }}>
            {[
              { key: "all", en: "All Cities", my: "မြို့အားလုံး" },
              { key: "yangon", en: "Yangon", my: "ရန်ကုန်" },
              { key: "mandalay", en: "Mandalay", my: "မန္တလေး" },
              { key: "naypyidaw", en: "Naypyidaw", my: "နေပြည်တော်" },
              { key: "taunggyi", en: "Taunggyi", my: "တောင်ကြီး" },
            ].map(city => (
              <button key={city.key} onClick={() => setProjectCity(city.key)}
                style={{ padding: "12px 24px", background: "transparent", border: "none", borderBottom: projectCity === city.key ? `3px solid ${gold}` : "3px solid transparent", color: projectCity === city.key ? navy : "#7a6a5a", fontSize: "13px", fontWeight: projectCity === city.key ? 700 : 400, cursor: "pointer", fontFamily: ff, whiteSpace: "nowrap" }}>
                {lang === "en" ? city.en : city.my}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "28px" }}>
            {[
              {
                id: "P1", city: "yangon", badge: "FEATURED", badgeColor: gold,
                name: "The Grand Yankin Tower", nameMy: "ဂရမ်းဒ် ရန်ကင်း တာဝါ",
                developer: "Golden Hill Development Co., Ltd.", developerMy: "ဂိုလ်ဒင်ဟစ် ဖွံ့ဖြိုးရေး ကုမ္ပဏီ လီမိတက်",
                location: "Yankin Township, Yangon", locationMy: "ရန်ကင်းမြို့နယ်၊ ရန်ကုန်",
                type: "Condo", typeMy: "ကွန်ဒို",
                units: 240, floors: 32,
                priceFrom: 1500, priceTo: 8000,
                completion: "Q4 2027", completionMy: "၂၀၂၇ ခုနှစ် Q4",
                status: "Selling Now", statusMy: "ယခု ရောင်းနေပြီ", statusColor: "#2d7a3a",
                features: ["Swimming Pool", "Gym", "24/7 Security", "Parking", "Sky Lounge"],
                featuresMy: ["ရေကူးကန်", "ကိုယ်လက်လှုပ်ရှားမှုခန်း", "လုံခြုံရေး ၂၄/၇", "ကားရပ်နားရာ", "Sky Lounge"],
                gradient: ["#1a2e45", "#2d4a6e"],
              },
              {
                id: "P2", city: "yangon", badge: "NEW LAUNCH", badgeColor: "#2d7a3a",
                name: "Hlaing Prestige Residences", nameMy: "လှိုင်း ပရက်စတစ်ဂျ် နေအိမ်များ",
                developer: "Myanmar Premier Properties Co., Ltd.", developerMy: "မြန်မာ ပရီမီယာ ပရော်ပတ်တီး ကုမ္ပဏီ",
                location: "Hlaing Township, Yangon", locationMy: "လှိုင်းမြို့နယ်၊ ရန်ကုန်",
                type: "Apartment", typeMy: "အပါတ်မန့်",
                units: 180, floors: 20,
                priceFrom: 800, priceTo: 3500,
                completion: "Q2 2026", completionMy: "၂၀၂၆ ခုနှစ် Q2",
                status: "Pre-Sale", statusMy: "ကြိုတင် ရောင်းချမှု", statusColor: "#bd9468",
                features: ["Rooftop Garden", "Kids Play Area", "CCTV", "Generator", "Lobby"],
                featuresMy: ["ခေါင်မိုးဥယျာဉ်", "ကလေးကစားကွင်း", "CCTV", "မီးစက်", "ဝင်ပေါက်ခန်း"],
                gradient: ["#2d4a6e", "#3d5a7e"],
              },
              {
                id: "P3", city: "mandalay", badge: "FEATURED", badgeColor: gold,
                name: "Mandalay Royal Condo", nameMy: "မန္တလေး ရိုင်ယယ်လ် ကွန်ဒို",
                developer: "Mandalay Elite Builders Co., Ltd.", developerMy: "မန္တလေး အယ်လိုက်တ် ဆောက်လုပ်ရေး ကုမ္ပဏီ",
                location: "Chanayethazan Township, Mandalay", locationMy: "ချမ်းအေးသာဇံမြို့နယ်၊ မန္တလေး",
                type: "Condo", typeMy: "ကွန်ဒို",
                units: 120, floors: 18,
                priceFrom: 1200, priceTo: 5000,
                completion: "Q1 2027", completionMy: "၂၀၂၇ ခုနှစ် Q1",
                status: "Selling Now", statusMy: "ယခု ရောင်းနေပြီ", statusColor: "#2d7a3a",
                features: ["Pool", "Gym", "Palace View", "Smart Home", "Parking"],
                featuresMy: ["ရေကူးကန်", "ကိုယ်လက်လှုပ်ရှားမှုခန်း", "နန်းတော်မြင်ကွင်း", "Smart Home", "ကားရပ်နားရာ"],
                gradient: ["#1a2e45", "#0d1f33"],
              },
              {
                id: "P4", city: "naypyidaw", badge: "NEW LAUNCH", badgeColor: "#2d7a3a",
                name: "Naypyidaw Garden Villas", nameMy: "နေပြည်တော် ဥယျာဉ် ဗီလာများ",
                developer: "Capital City Development Co., Ltd.", developerMy: "မြို့တော် ဖွံ့ဖြိုးရေး ကုမ္ပဏီ",
                location: "Zabuthiri Township, Naypyidaw", locationMy: "ဇဗ္ဗူသီရိမြို့နယ်၊ နေပြည်တော်",
                type: "Villa", typeMy: "ဗီလာ",
                units: 60, floors: 3,
                priceFrom: 2000, priceTo: 9000,
                completion: "Q3 2026", completionMy: "၂၀၂၆ ခုနှစ် Q3",
                status: "Pre-Sale", statusMy: "ကြိုတင် ရောင်းချမှု", statusColor: "#bd9468",
                features: ["Private Garden", "Pool", "Maid's Room", "4 Parking", "Smart Security"],
                featuresMy: ["ကိုယ်ပိုင်ဥယျာဉ်", "ရေကူးကန်", "အမှုထမ်းခန်း", "ကား ၄ စီး", "Smart လုံခြုံရေး"],
                gradient: ["#1e3a5f", "#2d4a6e"],
              },
              {
                id: "P5", city: "taunggyi", badge: "COMING SOON", badgeColor: "#7a5a3a",
                name: "Taunggyi Highland Condos", nameMy: "တောင်ကြီး မြင့်မားသောနေရာ ကွန်ဒိုများ",
                developer: "Shan State Premier Co., Ltd.", developerMy: "ရှမ်းပြည်နယ် ပရီမီယာ ကုမ္ပဏီ",
                location: "Taunggyi, Shan State", locationMy: "တောင်ကြီး၊ ရှမ်းပြည်နယ်",
                type: "Condo", typeMy: "ကွန်ဒို",
                units: 80, floors: 12,
                priceFrom: 600, priceTo: 2500,
                completion: "Q2 2028", completionMy: "၂၀၂၈ ခုနှစ် Q2",
                status: "Register Interest", statusMy: "စိတ်ဝင်စားမှု မှတ်ပုံတင်ရန်", statusColor: "#7a5a3a",
                features: ["Mountain View", "Cool Climate", "Gym", "Restaurant", "Parking"],
                featuresMy: ["တောင်မြင်ကွင်း", "အေးမြသောရာသီဥတု", "ကိုယ်လက်လှုပ်ရှားမှုခန်း", "စားသောက်ဆိုင်", "ကားရပ်နားရာ"],
                gradient: ["#2d3a1f", "#3d4a2e"],
              },
            ].filter(p => projectCity === "all" || p.city === projectCity)
              .map(project => (
                <div key={project.id} style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", border: `1px solid #e0d8cc`, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>

                  {/* Banner image */}
                  <div style={{ height: "200px", background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ opacity: 0.25 }}><rect x="8" y="16" width="36" height="30" rx="2" stroke="white" strokeWidth="2.5"/><path d="M4 18L26 4L48 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="20" y="30" width="12" height="16" stroke="white" strokeWidth="2"/></svg>

                    {/* Badge */}
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <span style={{ background: project.badgeColor, color: "#fff", fontSize: "10px", padding: "4px 12px", borderRadius: "2px", letterSpacing: "1px", fontWeight: 700, fontFamily: ff }}>
                        {project.badge}
                      </span>
                    </div>

                    {/* Status */}
                    <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "2px", fontFamily: ff }}>
                         {project.floors} {lang === "en" ? "Floors" : "ထပ်"} · {project.units} {lang === "en" ? "Units" : "ယူနစ်"}
                      </span>
                      <span style={{ background: project.statusColor, color: "#fff", fontSize: "10px", padding: "4px 10px", borderRadius: "2px", fontFamily: ff, fontWeight: 700 }}>
                        {lang === "en" ? project.status : project.statusMy}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "18px" }}>
                    {/* Project name */}
                    <h3 style={{ color: navy, fontSize: "17px", fontWeight: 600, margin: "0 0 4px", fontFamily: ff }}>
                      {lang === "en" ? project.name : project.nameMy}
                    </h3>
                    <p style={{ color: gold, fontSize: "12px", margin: "0 0 4px", fontFamily: ff }}>
                       {lang === "en" ? project.developer : project.developerMy}
                    </p>
                    <p style={{ color: "#7a6a5a", fontSize: "12px", margin: "0 0 12px", fontFamily: ff }}>
                       {lang === "en" ? project.location : project.locationMy}
                    </p>

                    {/* Price range */}
                    <div style={{ background: navy, borderRadius: "6px", padding: "12px 16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ color: gold, fontSize: "10px", margin: "0 0 2px", letterSpacing: "1px", fontFamily: ff }}>{lang === "en" ? "STARTING FROM" : "အနည်းဆုံး ဈေးနှုန်း"}</p>
                        <p style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: ff }}>
                          {project.priceFrom.toLocaleString()} {lang === "en" ? "Lakh" : "သိန်း"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#4a6a8a", fontSize: "10px", margin: "0 0 2px", fontFamily: ff }}>{lang === "en" ? "COMPLETION" : "ပြီးစီးမည့်ရက်"}</p>
                        <p style={{ color: gold, fontSize: "13px", fontWeight: 600, margin: 0, fontFamily: ff }}>
                          {lang === "en" ? project.completion : project.completionMy}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                      {(lang === "en" ? project.features : project.featuresMy).map((f, i) => (
                        <span key={i} style={{ background: "#faf7f2", border: "1px solid #e8dfc4", color: "#5a4a3a", fontSize: "10px", padding: "3px 8px", borderRadius: "999px", fontFamily: ff }}>
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button style={{ width: "100%", background: project.status === "Register Interest" ? "transparent" : navy, color: project.status === "Register Interest" ? navy : gold, border: `2px solid ${project.status === "Register Interest" ? "#ddd5c0" : gold}`, padding: "12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: ff, fontWeight: 600 }}>
                      {project.status === "Register Interest"
                        ? (lang === "en" ? " Register Interest" : " စိတ်ဝင်စားမှု မှတ်ပုံတင်ရန်")
                        : (lang === "en" ? " Enquire Now" : " ယခု စုံစမ်းရန်")
                      }
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Advertise banner */}
          <div style={{ maxWidth: "1200px", margin: "0 auto 48px", padding: "0 28px" }}>
            <div style={{ background: navy, borderRadius: "8px", padding: "32px", border: `2px solid ${gold}`, textAlign: "center" }}>
              <p style={{ color: gold, fontSize: "11px", letterSpacing: "3px", margin: "0 0 8px", fontFamily: ff }}>FOR DEVELOPERS</p>
              <h3 style={{ color: cream, fontSize: "22px", fontWeight: 400, margin: "0 0 8px", fontFamily: ff }}>
                {lang === "en" ? "Advertise Your Project Here" : "သင်၏ စီမံကိန်းကို ဤနေရာတွင် ကြော်ငြာပါ"}
              </h3>
              <p style={{ color: "#8fafc8", fontSize: "14px", margin: "0 0 20px", fontFamily: ff }}>
                {lang === "en" ? "Reach thousands of serious property buyers across Myanmar. Featured placement, banner ads, and dedicated project pages available." : "မြန်မာတစ်နိုင်ငံလုံးရှိ အိမ်ခြံမြေဝယ်ယူသူများထံ ရောက်ရှိပါ။"}
              </p>
              <button style={{ background: gold, color: "#fff", border: "none", padding: "14px 36px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontFamily: ff, fontWeight: 700 }}>
                 {lang === "en" ? "Contact Us to Advertise" : "ကြော်ငြာရန် ဆက်သွယ်ပါ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: navy, padding: "32px 28px", textAlign: "center", borderTop: `2px solid ${gold}`, marginTop: "40px" }}>
        <img src="/logo-footer.png" alt="Yume Estate" style={{ width: "160px", height: "auto", marginBottom: "16px" }} />
        <p style={{ color: gold, fontSize: "11px", letterSpacing: "3px", margin: "0 0 8px", fontFamily: ff }}>{t.tagline}</p>
        <p style={{ color: "#4a6a8a", fontSize: "12px", margin: 0, fontFamily: ff }}>© 2026 Yume Estate · Myanmar</p>
      </footer>

      {/* ── PROPERTY DETAIL MODAL ── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{ background: cream, borderRadius: "8px", width: "100%", maxWidth: "900px", maxHeight: "92vh", overflowY: "auto", border: `2px solid ${gold}` }}>

            {/* Modal header */}
            <div style={{ background: navy, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: gold, fontSize: "12px", letterSpacing: "1px", fontFamily: ff }}>{selected.code}</span>
                {selected.featured && <span style={{ background: gold, color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "2px" }}>{t.featured}</span>}
                {selected.isNew && <span style={{ background: "#2d7a3a", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "2px" }}>{t.new}</span>}
                {/* View count in modal */}
                <span style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", fontFamily: ff }}>
                   {(viewCounts[selected.id] || 0).toLocaleString()} {lang === "my" ? "ကြိမ်" : "views"}
                </span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "0" }}>

              {/* Left side */}
              <div style={{ padding: "24px" }}>
                {/* Image gallery */}
                <div style={{ height: "260px", background: `linear-gradient(135deg, ${selected.images[activeImage]}, ${selected.images[(activeImage+1)%3]})`, borderRadius: "6px", marginBottom: "10px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.25 }}><path d="M8 28L32 8L56 28V56H40V40H24V56H8V28Z" stroke="white" strokeWidth="3" strokeLinejoin="round"/></svg>
                  <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                    {selected.images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImage(i)}
                        style={{ width: i === activeImage ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === activeImage ? gold : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.2s" }} />
                    ))}
                  </div>
                </div>

                {/* Thumbnail row */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  {selected.images.map((img, i) => (
                    <div key={i} onClick={() => setActiveImage(i)}
                      style={{ flex: 1, height: "64px", background: `linear-gradient(135deg, ${img}, ${selected.images[(i+1)%3]})`, borderRadius: "4px", cursor: "pointer", border: i === activeImage ? `2px solid ${gold}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.25 }}><path d="M5 18L20 5L35 18V36H25V25H15V36H5V18Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
                    </div>
                  ))}
                </div>

                {/* Title */}
                <h1 style={{ color: navy, fontSize: "22px", fontWeight: 400, margin: "0 0 6px", lineHeight: 1.4, fontFamily: ff }}>
                  {lang === "my" ? selected.titleMy : selected.title}
                </h1>
                <p style={{ color: "#7a6a5a", fontSize: "13px", margin: "0 0 20px", fontFamily: ff }}> {selected.location}</p>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                  {[
                    { icon: "", val: `${selected.bedrooms}`, label: t.bedrooms },
                    { icon: "", val: `${selected.bathrooms}`, label: t.bathrooms },
                    { icon: "", val: `${selected.area}`, label: t.sqft },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "6px", padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "20px" }}>{s.icon}</div>
                      <div style={{ color: navy, fontSize: "18px", fontWeight: 700, fontFamily: ff }}>{s.val}</div>
                      <div style={{ color: "#7a6a5a", fontSize: "11px", fontFamily: ff }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <h3 style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: "0 0 8px", letterSpacing: "1px", fontFamily: ff }}>{t.description}</h3>
                <p style={{ color: "#5a4a3a", fontSize: "14px", lineHeight: 1.7, margin: "0 0 20px", fontFamily: ff }}>
                  {lang === "my" ? selected.descriptionMy : selected.description}
                </p>

                {/* Details table */}
                <h3 style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: "0 0 12px", letterSpacing: "1px", fontFamily: ff }}>{t.details}</h3>
                <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "6px", overflow: "hidden" }}>
                  {[
                    [t.propertyType, selected.type],
                    [t.listingType, selected.listing === "sale" ? t.forSaleBadge : t.forRentBadge],
                    [t.floorArea, `${selected.area} ${t.sqft}`],
                    [t.location, selected.location],
                    ...(selected.floor ? [[lang === "en" ? "Floor" : "အထပ်", `${selected.floor} / ${selected.totalFloors}`]] : []),
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < 3 ? "1px solid #e8dfc4" : "none", background: i % 2 === 0 ? "#faf7f2" : "#fff" }}>
                      <span style={{ color: "#7a6a5a", fontSize: "13px", fontFamily: ff }}>{label}</span>
                      <span style={{ color: navy, fontSize: "13px", fontWeight: 600, fontFamily: ff }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side — price + contact */}
              <div style={{ borderLeft: "1px solid #e0d8cc", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Price card */}
                <div style={{ background: navy, borderRadius: "8px", padding: "20px" }}>
                  <p style={{ color: gold, fontSize: "10px", letterSpacing: "2px", margin: "0 0 4px", fontFamily: ff }}>
                    {selected.listing === "sale" ? t.forSaleBadge : t.forRentBadge}
                  </p>
                  <p style={{ color: "#fff", fontSize: "26px", fontWeight: 700, margin: "0 0 4px", fontFamily: ff }}>
                    {formatPrice(selected.price, selected.listing, lang)}
                  </p>
                  <p style={{ color: "#4a6a8a", fontSize: "12px", margin: 0, fontFamily: ff }}>{selected.code}</p>
                </div>

                {/* ── CONTACT / CHAT / BOOKING SECTION ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                  {/* Agent card — always visible, owner number hidden */}
                  <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: "8px", padding: "14px" }}>
                    <p style={{ color: "#7a6a5a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px", fontFamily: ff }}>
                      {lang === "my" ? "တာဝန်ခံ အေးဂျင့်" : "LISTING AGENT"}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: gold, fontWeight: 700, flexShrink: 0 }}>
                        {selected.agentAvatar}
                      </div>
                      <div>
                        <p style={{ color: navy, fontSize: "15px", fontWeight: 600, margin: "0 0 2px", fontFamily: ff }}>{selected.agentName}</p>
                        <p style={{ color: "#2d7a3a", fontSize: "11px", margin: 0, fontFamily: ff }}>✓ {lang === "my" ? "အတည်ပြုထားသော အေးဂျင့်" : "Verified Agent"}</p>
                      </div>
                    </div>
                  </div>

                  {/* STEP 1 — Contact form */}
                  {contactStep === "form" && (
                    <div style={{ background: "#fffbf4", border: `1px solid ${gold}`, borderRadius: "8px", padding: "16px" }}>
                      <h3 style={{ color: navy, fontSize: "14px", fontWeight: 600, margin: "0 0 4px", fontFamily: ff }}>
                         {lang === "my" ? "အေးဂျင့်နှင့် ဆက်သွယ်ရန်" : "Contact Agent"}
                      </h3>
                      <p style={{ color: "#7a6a5a", fontSize: "12px", margin: "0 0 12px", lineHeight: 1.6, fontFamily: ff }}>
                        {lang === "my"
                          ? "သင်၏ နာမည်နှင့် ဖုန်းနံပါတ် ထည့်သွင်းပါ — အေးဂျင့်မှ ၂၄ နာရီအတွင်း ဆက်သွယ်ပေးပါမည်"
                          : "Enter your name and phone number — the agent will contact you within 24 hours"}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input value={contactName} onChange={e => setContactName(e.target.value)}
                          placeholder={lang === "my" ? "သင်၏ နာမည်" : "Your full name"}
                          style={{ padding: "11px 14px", borderRadius: "6px", border: "1px solid #ddd5c0", fontSize: "14px", fontFamily: ff, outline: "none" }} />
                        <input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                          placeholder={lang === "my" ? "သင်၏ ဖုန်းနံပါတ် (ဥပမာ ၀၉-xxxxxxxxx)" : "Your phone (e.g. 09-xxxxxxxxx)"} type="tel"
                          style={{ padding: "11px 14px", borderRadius: "6px", border: "1px solid #ddd5c0", fontSize: "14px", fontFamily: ff, outline: "none" }} />
                        <button onClick={handleSubmit} disabled={!contactName.trim() || !contactPhone.trim()}
                          style={{ background: contactName.trim() && contactPhone.trim() ? navy : "#ddd5c0", color: gold, border: `2px solid ${contactName.trim() && contactPhone.trim() ? gold : "#ddd5c0"}`, padding: "13px", borderRadius: "6px", fontSize: "14px", cursor: contactName.trim() && contactPhone.trim() ? "pointer" : "not-allowed", fontFamily: ff, fontWeight: 600 }}>
                           {lang === "my" ? "ချတ်ဖွင့်ရန် →" : "Start Chat →"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Persistent chatbox */}
                  {contactStep === "chat" && (
                    <div style={{ background: "#fff", border: `1px solid ${gold}`, borderRadius: "8px", overflow: "hidden" }}>

                      {/* Chat header */}
                      <div style={{ background: navy, padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                          {selected.agentAvatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: "0 0 1px", fontFamily: ff }}>{selected.agentName}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4cd964" }} />
                            <p style={{ color: "#8fafc8", fontSize: "11px", margin: 0, fontFamily: ff }}>
                              {lang === "my" ? "အတည်ပြုထားသော အေးဂျင့်" : "Verified Agent"}
                            </p>
                          </div>
                        </div>
                        <div style={{ background: "rgba(189,148,104,0.2)", border: `1px solid ${gold}`, borderRadius: "4px", padding: "4px 10px" }}>
                          <p style={{ color: gold, fontSize: "10px", margin: 0, fontFamily: ff, letterSpacing: "1px" }}>
                            {lang === "my" ? "ရက် ၂၄ အတွင်း ဆက်သွယ်မည်" : "Replies within 24hrs"}
                          </p>
                        </div>
                      </div>

                      {/* Messages area */}
                      <div style={{ height: "220px", overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", background: "#faf7f2" }}>
                        {chatMessages.map((msg, i) => (
                          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap: "2px" }}>
                            <div style={{ maxWidth: "85%", padding: "10px 13px", borderRadius: msg.from === "user" ? "14px 14px 0 14px" : "14px 14px 14px 0", background: msg.from === "user" ? navy : "#fff", color: msg.from === "user" ? "#f5f0e8" : navy, fontSize: "13px", lineHeight: 1.55, fontFamily: ff, border: msg.from === "bot" ? "1px solid #e0d8cc" : "none", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                              {msg.text}
                            </div>
                            <p style={{ color: "#aaa", fontSize: "10px", margin: 0, fontFamily: ff }}>{msg.time}</p>
                          </div>
                        ))}

                      </div>

                      {/* Chat input */}
                      <div style={{ borderTop: "1px solid #e0d8cc", display: "flex", gap: "0", background: "#fff" }}>
                        <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleChatSend()}
                          placeholder={lang === "my" ? "မေးခွန်း သို့မဟုတ် မှတ်ချက် ရေးပါ..." : "Type a question or message..."}
                          style={{ flex: 1, padding: "12px 14px", border: "none", outline: "none", fontSize: "13px", fontFamily: ff, background: "transparent" }} />
                        <button onClick={handleChatSend} disabled={!chatInput.trim()}
                          style={{ background: chatInput.trim() ? navy : "#f5f0e8", color: chatInput.trim() ? gold : "#ccc", border: "none", padding: "12px 18px", cursor: chatInput.trim() ? "pointer" : "not-allowed", fontSize: "18px", transition: "background 0.2s" }}>
                          →
                        </button>
                      </div>

                      {/* Info strip */}
                      <div style={{ background: "#faf7f2", borderTop: "1px solid #e8dfc4", padding: "8px 14px", textAlign: "center" }}>
                        <p style={{ color: "#7a6a5a", fontSize: "11px", margin: 0, fontFamily: ff }}>
                           {lang === "my" ? "သင်၏ ဖုန်းနံပါတ်ကို အေးဂျင့်မှသာ မြင်နိုင်သည်" : "Your phone number is only visible to the agent"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Save + Share buttons */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => toggleSave(selected.id)}
                      style={{ flex: 1, padding: "10px", border: "1px solid #ddd5c0", borderRadius: "4px", background: savedIds.includes(selected.id) ? "#fff0f0" : "#fff", cursor: "pointer", fontSize: "13px", fontFamily: ff, color: navy }}>
                      {savedIds.includes(selected.id) ? "♥" : "♡"} {t.save}
                    </button>
                    <button style={{ flex: 1, padding: "10px", border: "1px solid #ddd5c0", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "13px", fontFamily: ff, color: navy }}>
                       {t.share}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
