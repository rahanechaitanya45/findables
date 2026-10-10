import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'tech-gadgets',
    name: 'Tech & Gadgets',
    description: 'Smart accessories, chargers, hubs & audio gear',
    iconName: 'Smartphone',
    itemCount: 18,
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    description: 'Skincare essentials, grooming tools & hair stylers',
    iconName: 'Sparkles',
    itemCount: 12,
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    description: 'Time-saving prep tools, kettles & storage',
    iconName: 'Home',
    itemCount: 16,
  },
  {
    id: 'fashion-accessories',
    name: 'Fashion & Accessories',
    description: 'Minimalist watches, wallets, sunglasses & bags',
    iconName: 'Watch',
    itemCount: 10,
  },
  {
    id: 'fitness-wellness',
    name: 'Fitness & Wellness',
    description: 'Resistance bands, bottles, fitness trackers & yoga gear',
    iconName: 'Activity',
    itemCount: 11,
  },
  {
    id: 'student-essentials',
    name: 'Student Essentials',
    description: 'Study lamps, digital pads, cable pouches & stationery',
    iconName: 'GraduationCap',
    itemCount: 14,
  },
  {
    id: 'gaming-accessories',
    name: 'Gaming Accessories',
    description: 'Mouse pads, budget mechanical keyboards & headsets',
    iconName: 'Gamepad2',
    itemCount: 9,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Power banks, Bluetooth speakers & surge protectors',
    iconName: 'Cpu',
    itemCount: 15,
  },
  {
    id: 'bags-travel',
    name: 'Bags & Travel',
    description: 'Waterproof backpacks, toiletry organizers & pouches',
    iconName: 'Luggage',
    itemCount: 8,
  },
  {
    id: 'budget-under-499',
    name: 'Budget Finds Under ₹499',
    description: 'Handpicked wallet-friendly lifesavers under ₹500',
    iconName: 'Tag',
    itemCount: 20,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'boat-airdopes-141',
    asin: 'B09N3ZNHTY',
    title: 'boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds',
    brand: 'boAt',
    category: 'tech-gadgets',
    categoryName: 'Tech & Gadgets',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09N3ZNHTY.01._SCLZZZZZZZ_.jpg',
    galleryImages: [
      'https://m.media-amazon.com/images/I/51HBom8xz7L._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/P/B09N3ZNHTY.01._SCLZZZZZZZ_.jpg',
    ],
    amazonUrl: 'https://www.amazon.in/dp/B09N3ZNHTY/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 899,
    originalPrice: 4490,
    discountPercent: 80,
    rating: 4.0,
    reviewCount: 228410,
    editorialOneLiner: 'Punchy bass and up to 42-hour playtime at an unbeatable sub-₹1,000 price point.',
    editorialReview: 'One of the most reliable budget earbuds available on Amazon India. While the microphone can pick up background breeze outdoors, the battery endurance and low-latency BEAST mode make it unmatched for daily commute listening.',
    pros: [
      'Substantial 42 hours total battery backup with type-C fast charging',
      'ENx noise suppression for clearer indoor calls',
      'IPX4 sweat resistance suitable for light workouts'
    ],
    cons: [
      'Microphone quality is average in noisy Indian traffic',
      'Glossy case shows micro-scratches over time'
    ],
    bestSuitedFor: 'College students and commuters needing durable bass-heavy daily audio without spending much.',
    buyingConsiderations: [
      'Use the included medium ear tips for the best bass seal.',
      'Includes 1-year manufacturer warranty registration card in the box.'
    ],
    specs: {
      'Battery Life': 'Up to 42 hours with case',
      'Driver Size': '8mm dynamic drivers',
      'Bluetooth Version': '5.2',
      'Charging Port': 'USB Type-C Fast Charging (ASAP Charge)'
    },
    isFeatured: true,
    isTrending: true,
    isEditorPick: true,
    isUnder999: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'portronics-ruffpad-85',
    asin: 'B07M9T794G',
    title: 'Portronics Ruffpad 8.5M Re-Writable LCD Writing Notepad',
    brand: 'Portronics',
    category: 'student-essentials',
    categoryName: 'Student Essentials',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07M9T794G.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B07M9T794G/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 249,
    originalPrice: 799,
    discountPercent: 69,
    rating: 4.2,
    reviewCount: 38240,
    editorialOneLiner: 'Pocket-friendly paper-free doodle pad with one-touch erase and lock key.',
    editorialReview: 'Saves countless rough notebook pages during math calculation, grocery listings, and daily task jotting. The matte screen doesn’t emit blue light and the built-in stylus clicks snugly into the top dock.',
    pros: [
      'Saves paper for rough study math and to-do lists',
      'Physical anti-erase lock switch on the backside',
      'Runs on an ultra-long-lasting replaceable CR2016 coin cell'
    ],
    cons: [
      'No cloud sync or internal memory storage',
      'Screen contrast depends on ambient room lighting'
    ],
    bestSuitedFor: 'Students doing rough exam revisions and parents looking for screen-safe sketch boards.',
    buyingConsiderations: [
      'Ensure the rear lock switch is toggled off when trying to erase the screen.',
      'Replace battery once every 12–18 months depending on erase frequency.'
    ],
    specs: {
      'Screen Size': '8.5 inches pressure-sensitive LCD',
      'Weight': '110 grams',
      'Battery': 'Replaceable CR2016 3V Coin Cell',
      'Included Accessories': 'Pressure stylus with lanyard hole'
    },
    isFeatured: true,
    isTrending: true,
    isUnder499: true,
    isStudentEssential: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'pigeon-handy-mini-chopper',
    asin: 'B01LZKTHPT',
    title: 'Pigeon by Stovekraft Handy Mini Plastic Chopper with 3 Blades',
    brand: 'Pigeon',
    category: 'budget-under-499',
    categoryName: 'Budget Finds Under ₹499',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B01LZKTHPT.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B01LZKTHPT/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 199,
    originalPrice: 545,
    discountPercent: 63,
    rating: 4.3,
    reviewCount: 298100,
    editorialOneLiner: 'Chops onions, garlic, and chillies in 5 pulls with zero crying eyes.',
    editorialReview: 'With over 290,000 verified reviews on Amazon India, this manual string chopper is the single most practical ₹200 kitchen purchase you can make. Dishwasher safe and requires zero electricity.',
    pros: [
      'Chops onions in 10 seconds without tearing up',
      'Zero electricity needed — ideal for Indian power fluctuations',
      'Sturdy pull cord mechanism with triple stainless blades'
    ],
    cons: [
      'Do not overload with oversized unpeeled chunks to avoid straining the cord',
      'Blade is extremely sharp — handle with care while cleaning'
    ],
    bestSuitedFor: 'Every Indian home cook preparing daily tadka, salads, or omelettes.',
    buyingConsiderations: [
      'Cut onions into quarters before dropping them in for smooth pulling.',
      'Rinse blades immediately after chopping garlic or chillies.'
    ],
    specs: {
      'Capacity': '350 ml bowl',
      'Blade Material': 'High-grade stainless steel',
      'Mechanism': 'Manual pull cord with spring rewind',
      'Body Material': 'BPA-free unbreakable food plastic'
    },
    isFeatured: true,
    isTrending: true,
    isUnder499: true,
    isEditorPick: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'pigeon-stainless-electric-kettle',
    asin: 'B07WMS7TWB',
    title: 'Pigeon by Stovekraft Scarlet 1.5 Litre Stainless Steel Electric Kettle',
    brand: 'Pigeon',
    category: 'home-kitchen',
    categoryName: 'Home & Kitchen',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07WMS7TWB.01._SCLZZZZZZZ_.jpg',
    galleryImages: [
      'https://m.media-amazon.com/images/I/41xDwuBHfOL.jpg',
      'https://images-na.ssl-images-amazon.com/images/P/B07WMS7TWB.01._SCLZZZZZZZ_.jpg',
    ],
    amazonUrl: 'https://www.amazon.in/dp/B07WMS7TWB/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 629,
    originalPrice: 1245,
    discountPercent: 49,
    rating: 4.0,
    reviewCount: 165800,
    editorialOneLiner: 'Hostel and office essential for instant tea, Maggi, and boiling water in under 4 minutes.',
    editorialReview: 'An absolute workhorse in thousands of Indian bachelor pads and family kitchens. Boils a full 1.5 liters in roughly 3 to 4 minutes with auto shut-off protection so you never have to worry about dry boil.',
    pros: [
      'Automatic cut-off switch prevents dry boiling',
      'Generous 1.5-liter capacity with 360-degree swivel base',
      'Stainless steel body is easy to descale with vinegar'
    ],
    cons: [
      'Outer steel shell gets hot to touch during boiling (hold by the plastic handle only)',
      'Cord length is relatively short (~75cm)'
    ],
    bestSuitedFor: 'College hostel students, late-night tea drinkers, and anyone wanting fast boiled water.',
    buyingConsiderations: [
      'Descaling every 3 weeks with lemon or baking soda keeps the bottom heating plate spotless.',
      '1500W power draw requires standard 6A/16A plug point.'
    ],
    specs: {
      'Capacity': '1.5 Litres',
      'Power': '1500 Watts',
      'Material': 'Food-grade stainless steel interior',
      'Safety': 'Auto shut-off & boil-dry protection'
    },
    isFeatured: true,
    isTrending: true,
    isStudentEssential: true,
    isUnder999: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'wipro-smart-bulb-9w',
    asin: 'B08F7J422K',
    title: 'Wipro Next 9W B22 Wi-Fi Smart LED RGB Bulb with Music Sync',
    brand: 'Wipro',
    category: 'tech-gadgets',
    categoryName: 'Tech & Gadgets',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08F7J422K.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B08F7J422K/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 599,
    originalPrice: 2099,
    discountPercent: 71,
    rating: 4.1,
    reviewCount: 42910,
    editorialOneLiner: '16 million colors with Alexa & Google Assistant support without needing a separate hub.',
    editorialReview: 'Instantly upgrades any student bedroom or content desk aesthetic. Pairs directly over 2.4GHz home Wi-Fi and allows timer schedules so you can wake up to warm amber lighting automatically.',
    pros: [
      'Direct Wi-Fi connection — no external bridge required',
      'Works with standard Indian B22 bulb sockets',
      'Music sync mode reacts to beats played via phone microphone'
    ],
    cons: [
      'Requires 2.4GHz Wi-Fi (does not connect on 5GHz-only bands)',
      'App takes a few seconds to reconnect after sudden power cuts'
    ],
    bestSuitedFor: 'Creators setting aesthetic video backdrops and anyone building a smart bedroom.',
    buyingConsiderations: [
      'Check whether your fixture is B22 (pin-type) before ordering.',
      'Supports voice routines through Alexa and Google Home apps.'
    ],
    specs: {
      'Wattage': '9 Watts (Up to 810 Lumens)',
      'Fitting': 'B22 Pin Base',
      'Connectivity': 'Wi-Fi 802.11 b/g/n (2.4 GHz)',
      'Colors': '16 Million RGB Colors + Tunable Whites (2700K - 6500K)'
    },
    isFeatured: true,
    isTrending: false,
    isEditorPick: true,
    isUnder999: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'noise-pulse-2-max-smartwatch',
    asin: 'B0B3CQBRB4',
    title: 'Noise Pulse 2 Max 1.85" Display Bluetooth Calling Smart Watch',
    brand: 'Noise',
    category: 'fitness-wellness',
    categoryName: 'Fitness & Wellness',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B0B3CQBRB4.01._SCLZZZZZZZ_.jpg',
    galleryImages: [
      'https://m.media-amazon.com/images/I/61SSVxTSs3L._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/P/B0B3CQBRB4.01._SCLZZZZZZZ_.jpg',
    ],
    amazonUrl: 'https://www.amazon.in/dp/B0B3CQBRB4/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 1299,
    originalPrice: 5999,
    discountPercent: 78,
    rating: 4.1,
    reviewCount: 94200,
    editorialOneLiner: 'Vivid 550-nit display with crisp on-wrist Bluetooth calling and 10-day battery life.',
    editorialReview: 'A standout value watch in the entry wearable category. The screen is bright enough to read under bright Indian sunlight, and the built-in speaker allows quick hands-free calls while riding or cooking.',
    pros: [
      'Crisp 550 nits brightness visible outdoors',
      'Direct dial pad and favorite contact sync',
      '100 sports modes with 24/7 heart rate and SpO2 tracking'
    ],
    cons: [
      'Step counter can occasionally register false steps during bumpy bike rides',
      'Calling feature reduces battery from 10 days to around 2-3 days'
    ],
    bestSuitedFor: 'Anyone wanting notifications and quick calls without keeping their phone in hand.',
    buyingConsiderations: [
      'Requires the NoiseFit companion app on Android/iOS for watch face syncing.',
      'IP68 water resistant for rain and splashes, but not recommended for swimming.'
    ],
    specs: {
      'Display': '1.85 inch TFT LCD (550 Nits Peak)',
      'Battery Life': 'Up to 10 days standby / ~2 days with heavy calling',
      'Water Resistance': 'IP68 certified',
      'Health Sensors': 'Heart rate, SpO2, sleep tracker, stress monitor'
    },
    isFeatured: true,
    isTrending: true,
    isEditorPick: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'minimalist-niacinamide-serum',
    asin: 'B08GG9SQR2',
    title: 'Minimalist 10% Niacinamide Face Serum with Zinc for Acne Marks & Blemishes',
    brand: 'Minimalist',
    category: 'beauty-personal-care',
    categoryName: 'Beauty & Personal Care',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08GG9SQR2.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B08GG9SQR2/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 599,
    originalPrice: 699,
    discountPercent: 14,
    rating: 4.3,
    reviewCount: 31200,
    editorialOneLiner: 'Clinically tested formulation that visibly fades stubborn post-acne dark spots.',
    editorialReview: 'India’s most trusted transparent skincare staple. Contains pure European Niacinamide with Zinc PCA to balance sebum without stripping the skin barrier.',
    pros: [
      'Fragrance-free, essential oil-free and non-comedogenic',
      'Contains 1% Zinc PCA to control excess oiliness',
      'Absorbs within seconds without sticky residue'
    ],
    cons: [
      'May cause slight initial purging if you are new to active serums',
      'Patch test recommended for ultra-sensitive skin'
    ],
    bestSuitedFor: 'Oily and acne-prone skin dealing with texture and uneven tone.',
    buyingConsiderations: [
      'Apply 2-3 drops after cleansing before heavy moisturizers.',
      'Always follow up with broad-spectrum sunscreen in daytime.'
    ],
    specs: {
      'Active Ingredients': '10% Niacinamide + 1% Zinc PCA',
      'Volume': '30 ml amber dropper bottle',
      'Skin Type': 'All Skin Types (especially oily/combination)',
      'Formulation': 'Water-based lightweight serum'
    },
    isFeatured: true,
    isTrending: true,
    isEditorPick: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'philips-grooming-trimmer',
    asin: 'B07589V67W',
    title: 'Philips Multi Grooming Kit MG3710/65 9-in-1 Face, Hair & Beard Trimmer',
    brand: 'Philips',
    category: 'beauty-personal-care',
    categoryName: 'Beauty & Personal Care',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07589V67W.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B07589V67W/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 1549,
    originalPrice: 2295,
    discountPercent: 33,
    rating: 4.3,
    reviewCount: 84900,
    editorialOneLiner: 'Self-sharpening steel blades with 9 versatile attachments for clean beard and hair styling.',
    editorialReview: 'The quintessential men’s grooming kit on Amazon India. The blades stay sharp for years without oiling, and the rinseable attachments make post-trim cleanup effortless.',
    pros: [
      'Self-sharpening skin-friendly tempered steel blades',
      'Up to 60 minutes cordless runtime per charge',
      'Rinseable guards and attachments for quick hygienic cleaning'
    ],
    cons: [
      'Uses proprietary pin charger rather than USB-C',
      'Cannot be operated while plugged in on cord'
    ],
    bestSuitedFor: 'Men wanting an all-in-one beard trimming and body grooming tool.',
    buyingConsiderations: [
      'Includes nose/ear hair trimmer attachment and storage pouch.',
      'Comes with a 2-year standard Philips warranty + 1 year on web registration.'
    ],
    specs: {
      'Runtime': '60 minutes cordless',
      'Attachments': '9 tools for face & hair',
      'Blades': 'Self-sharpening DualCut steel',
      'Warranty': '2+1 Year Philips Domestic Warranty'
    },
    isFeatured: true,
    isTrending: false,
    isEditorPick: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'zebronics-dash-wireless-mouse',
    asin: 'B08F7Q894M',
    title: 'Zebronics Zeb-Dash 2.4GHz Wireless Optical Mouse with USB Nano Receiver',
    brand: 'Zebronics',
    category: 'tech-gadgets',
    categoryName: 'Tech & Gadgets',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08F7Q894M.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B08F7Q894M/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 229,
    originalPrice: 499,
    discountPercent: 54,
    rating: 4.1,
    reviewCount: 46210,
    editorialOneLiner: 'Ergonomic silent-click wireless mouse with plug-and-play USB dongle under ₹250.',
    editorialReview: 'Eliminates annoying desk clutter. The click action is whisper quiet, making it great for library study halls or late-night assignments without disturbing roommates.',
    pros: [
      'Near-silent button switches for quiet libraries and night work',
      'Compact nano receiver stores inside battery slot for travel',
      'Auto sleep mode preserves AA battery life'
    ],
    cons: [
      'Does not have side back/forward browser buttons',
      'Requires 1 standard AA battery (not always included in bulk packs)'
    ],
    bestSuitedFor: 'Laptop users tired of trackpads who want an ultra-cheap, durable wireless mouse.',
    buyingConsiderations: [
      'Nano dongle is tucked inside the bottom battery compartment lid.',
      'Works instantly with Windows, macOS, Chromebook, and Linux.'
    ],
    specs: {
      'Sensor': '1200 DPI High-precision optical tracking',
      'Connectivity': '2.4 GHz USB Type-A receiver (10m range)',
      'Buttons': 'Left, Right, Clickable Scroll Wheel',
      'Battery': '1 x AA battery (up to 6 months standby)'
    },
    isFeatured: false,
    isTrending: true,
    isUnder499: true,
    isStudentEssential: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'ambrane-20000mah-powerbank',
    asin: 'B08Z82KMLZ',
    title: 'Ambrane 20000mAh Power Bank with 20W Fast Charging (Stylo 20K)',
    brand: 'Ambrane',
    category: 'electronics',
    categoryName: 'Electronics',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08Z82KMLZ.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B08Z82KMLZ/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 1699,
    originalPrice: 3499,
    discountPercent: 51,
    rating: 4.1,
    reviewCount: 52100,
    editorialOneLiner: 'Charges an iPhone or OnePlus 4–5 times with 20W Power Delivery and Quick Charge 3.0.',
    editorialReview: 'Made in India power bank with sturdy matte finish and multiple safety circuit layers. Supports dual input (Type-C and Micro-USB) so you can charge it with whatever cable you currently carry.',
    pros: [
      'Huge 20,000mAh capacity charges modern phones multiple times',
      '20W PD output fast charges iPhones to 50% in 30 minutes',
      'Triple output ports can charge 3 devices simultaneously'
    ],
    cons: [
      'Substantial 410g weight — better suited for backpacks than pocket carry',
      'Takes ~6-7 hours to fully recharge using a standard 18W adapter'
    ],
    bestSuitedFor: 'Train travel, long college days, outdoor shoots, and emergency power backup.',
    buyingConsiderations: [
      'Complies with DGCA Indian domestic flight carry-on baggage regulations.',
      'Includes USB-A to Type-C cable in the box.'
    ],
    specs: {
      'Capacity': '20,000 mAh Li-Polymer',
      'Output Ports': '2 x USB-A (18W QC) + 1 x Type-C (20W PD)',
      'Input Ports': 'Type-C + Micro-USB',
      'Protection': '12-layer advanced chipset protection'
    },
    isFeatured: true,
    isTrending: false,
    isEditorPick: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'solimo-resistance-loop-bands',
    asin: 'B07V7ND714',
    title: 'Amazon Brand - Solimo Resistance Loop Bands Set of 5 with Carry Bag',
    brand: 'Solimo',
    category: 'fitness-wellness',
    categoryName: 'Fitness & Wellness',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07V7ND714.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B07V7ND714/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 349,
    originalPrice: 999,
    discountPercent: 65,
    rating: 4.2,
    reviewCount: 18450,
    editorialOneLiner: '5 progressive tension levels from X-Light to X-Heavy for glutes, legs, and physical rehab.',
    editorialReview: 'The most cost-effective home workout accessory. Made of 100% genuine latex that doesn’t snap easily. They slip into your pocket so you never skip training during travel.',
    pros: [
      '5 distinct color-coded resistance levels from 5 lbs to 40 lbs',
      'Non-slip genuine natural latex without chemical odor',
      'Includes compact drawstring travel pouch'
    ],
    cons: [
      'Can roll up if worn over slippery silk or nylon sweatpants',
      'Keep away from direct sunlight to preserve latex elasticity'
    ],
    bestSuitedFor: 'Home workouts, post-injury physiotherapy, and glute warm-up routines.',
    buyingConsiderations: [
      'Start with the green (Medium) band before advancing to black (X-Heavy).',
      'Wipe down with damp cloth after sweaty workout sessions.'
    ],
    specs: {
      'Material': '100% Natural Latex',
      'Tension Range': '5 to 40 lbs',
      'Dimensions': '12 inches x 2 inches each',
      'Included': '5 loop bands + instruction sheet + mesh pouch'
    },
    isFeatured: false,
    isTrending: true,
    isUnder499: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'boldfit-water-bottle-1l',
    asin: 'B09B2Q82G8',
    title: 'Boldfit Compact 1 Litre Water Bottle with Straw & Motivational Hourly Time Markers',
    brand: 'Boldfit',
    category: 'fitness-wellness',
    categoryName: 'Fitness & Wellness',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09B2Q82G8.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B09B2Q82G8/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 399,
    originalPrice: 999,
    discountPercent: 60,
    rating: 4.3,
    reviewCount: 22800,
    editorialOneLiner: 'BPA-free leakproof sipper bottle with hourly reminders that actually keep you hydrated.',
    editorialReview: 'Helps you hit your daily 3-liter hydration goal effortlessly. The silicone straw pops up with one press of the thumb lock, and the frosted exterior provides a non-slip grip during gym workouts.',
    pros: [
      'Motivational timeline keeps you accountable throughout desk shifts',
      'Secure safety lock prevents accidental bag leaks',
      'BPA-free, non-toxic food-grade Tritan plastic'
    ],
    cons: [
      'Not suitable for hot boiling water or microwave use',
      'Straw requires cleaning with a thin straw brush'
    ],
    bestSuitedFor: 'Gym-goers, office desk workers, and students tracking daily water intake.',
    buyingConsiderations: [
      'Wash with mild soapy water before first use.',
      'Fits standard bicycle and car cup holders.'
    ],
    specs: {
      'Capacity': '1000 ml (1 Litre)',
      'Material': 'BPA-Free Food Grade Plastic',
      'Lid Type': 'One-Click Flip Top with Pop-up Straw',
      'Features': 'Time markers, measurement ounces, carry loop'
    },
    isFeatured: false,
    isTrending: true,
    isUnder499: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'fovero-leather-slim-wallet',
    asin: 'B09V7N8631',
    title: 'Urban Forest Leather RFID Blocking Slim Bifold Wallet for Men',
    brand: 'Urban Forest',
    category: 'fashion-accessories',
    categoryName: 'Fashion & Accessories',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09V7N8631.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B09V7N8631/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 479,
    originalPrice: 1500,
    discountPercent: 68,
    rating: 4.3,
    reviewCount: 31200,
    editorialOneLiner: 'Genuine top-grain leather with built-in RFID blocking shield against digital pickpocketing.',
    editorialReview: 'A classy everyday carry item that looks and feels like it costs 3x more. Fits Indian currency notes without folding them awkwardly, and the RFID layer protects your contactless debit cards in crowded metros.',
    pros: [
      'Tested RFID-blocking lining protects cards from wireless skimmers',
      'Slim profile doesn’t create an ugly rear pocket bulge',
      'Comes in a premium matte gift box'
    ],
    cons: [
      'Leather requires a 1-week break-in period to soften up',
      'Holds maximum 6-8 cards comfortably without stretching'
    ],
    bestSuitedFor: 'Minimalists carrying 4–6 cards, Metro card, and folded currency notes.',
    buyingConsiderations: [
      'Great gift choice for birthdays or festive occasions due to box packaging.'
    ],
    specs: {
      'Material': 'Genuine Top-Grain Leather',
      'Security': '13.56 MHz RFID Shielding',
      'Slots': '6 Card Slots, 2 Currency Pockets, 1 ID Window',
      'Thickness': '1.2 cm when folded'
    },
    isFeatured: false,
    isTrending: false,
    isUnder499: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'boat-bassheads-100',
    asin: 'B07WHSB867',
    title: 'boAt Bassheads 100 in-Ear Wired Earphones with Super Extra Bass & Mic',
    brand: 'boAt',
    category: 'budget-under-499',
    categoryName: 'Budget Finds Under ₹499',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07WHSB867.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B07WHSB867/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 399,
    originalPrice: 999,
    discountPercent: 60,
    rating: 4.1,
    reviewCount: 389000,
    editorialOneLiner: 'India’s highest-selling budget wired earphones with hawk-inspired design and deep bass.',
    editorialReview: 'With nearly 400,000 ratings on Amazon, this is the definitive zero-latency wired backup. Never runs out of battery, has a clear inline microphone for phone calls, and costs less than ₹400.',
    pros: [
      'Zero audio delay for gaming and online lecture sessions',
      'Deep 10mm dynamic bass drivers',
      'Tangle-free 1.2m coated cable with built-in mic'
    ],
    cons: [
      'Requires 3.5mm jack (or 3.5mm-to-Type-C dongle for newer phones)',
      'Ear tip isolation depends on correct size selection'
    ],
    bestSuitedFor: 'Students taking Zoom calls, gamers wanting instant audio feedback, and emergency travel backups.',
    buyingConsiderations: [
      'Comes with extra small and large silicone ear buds in the packaging.'
    ],
    specs: {
      'Driver Size': '10mm Dynamic Drivers',
      'Jack': '3.5mm Gold-plated angled jack',
      'Cable Length': '1.2 metres',
      'Inline Controls': 'Single button playback & mic'
    },
    isFeatured: true,
    isTrending: true,
    isUnder499: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'wipro-garnet-table-lamp',
    asin: 'B07K6MQ21Y',
    title: 'Wipro Garnet 6W LED Table Lamp with 3-Grade Dimming & Touch Control',
    brand: 'Wipro',
    category: 'student-essentials',
    categoryName: 'Student Essentials',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07K6MQ21Y.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B07K6MQ21Y/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 849,
    originalPrice: 1690,
    discountPercent: 50,
    rating: 4.2,
    reviewCount: 19400,
    editorialOneLiner: 'Flexible gooseneck study lamp with soft anti-glare light and 3-step brightness touch sensor.',
    editorialReview: 'Engineered specifically to prevent eye fatigue during late night exam preparations. The flexible silicone neck bends 360 degrees without squeaking and the touch base is super responsive.',
    pros: [
      'Zero flicker illumination prevents eye fatigue during 3-hour reading sessions',
      '3 brightness presets (Low, Medium, High) adjusted with a single touch tap',
      'Flexible rubberized gooseneck directs light precisely onto your book'
    ],
    cons: [
      'Operates on standard wall plug power (does not have internal rechargeable battery)',
      'Base footprint requires ~15cm of desk space'
    ],
    bestSuitedFor: 'Late night students, book readers, and desk workers in shared hostel rooms.',
    buyingConsiderations: [
      'Uses energy-saving 6W LED array with 25,000-hour rated lifespan.'
    ],
    specs: {
      'Wattage': '6 Watts (Cool Day White)',
      'Control': 'Soft Touch Sensor Base',
      'Neck': '360° Flexible Silicone Gooseneck',
      'Lifespan': 'Up to 25,000 Hours'
    },
    isFeatured: true,
    isTrending: false,
    isStudentEssential: true,
    isUnder999: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'redgear-mp35-gaming-mousepad',
    asin: 'B01J1C7JBE',
    title: 'Redgear MP35 Speed-Type Gaming Mouse Mat with Stitched Anti-Fray Edges',
    brand: 'Redgear',
    category: 'gaming-accessories',
    categoryName: 'Gaming Accessories',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B01J1C7JBE.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B01J1C7JBE/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 299,
    originalPrice: 650,
    discountPercent: 54,
    rating: 4.4,
    reviewCount: 78900,
    editorialOneLiner: 'Ultra-smooth micro-textured cloth with reinforced perimeter stitching under ₹300.',
    editorialReview: 'The default gaming pad of choice for Indian Valorant and CS:GO players on a budget. The dense rubber base anchors firmly to wooden tables without slipping, and stitched borders ensure it won’t peel after months of use.',
    pros: [
      'Reinforced stitched borders prevent edge fraying',
      'Textured natural rubber bottom grips desk surface firmly',
      'Spill-resistant and can be hand-washed with mild soap'
    ],
    cons: [
      'Initial unboxing has a slight rubber smell that dissipates in 24 hours',
      'Standard medium size (35cm x 25cm), not a full desk-covering mat'
    ],
    bestSuitedFor: 'Gamers and desk workers wanting smooth cursor glide without spending much.',
    buyingConsiderations: [
      'Clean periodically with a damp microfiber cloth to remove palm dust.'
    ],
    specs: {
      'Surface Type': 'Speed-type micro-weave cloth',
      'Dimensions': '350 mm x 250 mm x 4 mm',
      'Base': 'Non-slip textured natural rubber',
      'Border': '360° Anti-fray precision stitching'
    },
    isFeatured: false,
    isTrending: true,
    isUnder499: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'cosmic-byte-firefly-keyboard',
    asin: 'B091J4PN6M',
    title: 'Cosmic Byte CB-GK-16 Firefly Tenkeyless Mechanical Keyboard with RGB',
    brand: 'Cosmic Byte',
    category: 'gaming-accessories',
    categoryName: 'Gaming Accessories',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B091J4PN6M.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B091J4PN6M/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 2199,
    originalPrice: 2999,
    discountPercent: 27,
    rating: 4.3,
    reviewCount: 16500,
    editorialOneLiner: 'Genuine Outemu mechanical switches with tenkeyless compact form factor and per-key RGB.',
    editorialReview: 'The highest-rated entry mechanical board in India. The compact TKL layout leaves massive desk space for mouse sweeps, and the clicky feedback makes coding and typing feel extraordinarily crisp.',
    pros: [
      '100% Anti-Ghosting with full N-Key Rollover',
      'Compact Tenkeyless (87-key) design frees up desk space',
      'Brilliant 11 RGB lighting modes with adjustable brightness'
    ],
    cons: [
      'Blue switches produce loud acoustic clicks (best in private rooms)',
      'Braided cable is fixed rather than detachable'
    ],
    bestSuitedFor: 'Coders and competitive gamers seeking authentic tactile mechanical key travel.',
    buyingConsiderations: [
      'Includes keycap puller in the box for easy maintenance and cleaning.'
    ],
    specs: {
      'Switches': 'Outemu Mechanical Blue Switches (50M Keystrokes)',
      'Layout': 'Tenkeyless (87 Keys)',
      'Lighting': 'Per-Key Multi-color RGB with 11 Effects',
      'Cable': '1.6m Heavy-duty Braided USB'
    },
    isFeatured: true,
    isTrending: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'milton-thermosteel-flask',
    asin: 'B08N5WRWNW',
    title: 'Milton Thermosteel Flip Lid Insulated Stainless Steel Flask (1000 ml)',
    brand: 'Milton',
    category: 'home-kitchen',
    categoryName: 'Home & Kitchen',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08N5WRWNW.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B08N5WRWNW/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 949,
    originalPrice: 1290,
    discountPercent: 26,
    rating: 4.4,
    reviewCount: 68400,
    editorialOneLiner: 'Keeps water or chai piping hot or ice-cold for 24 hours with copper coating technology.',
    editorialReview: 'The benchmark thermos in Indian households. Whether taking chilled water on a humid commute or keeping ginger tea warm on winter night shifts, the double-walled vacuum insulation performs flawlessly.',
    pros: [
      'Retains hot or cold beverage temperature for up to 24 hours',
      '100% rust-proof grade 304 stainless steel interior and exterior',
      'Flip lid doubles as a convenient serving cup'
    ],
    cons: [
      'Heavy when filled with a full 1 liter of liquid (~1.5 kg total)',
      'Not recommended for carbonated soda drinks'
    ],
    bestSuitedFor: 'Office workers, long train travelers, and anyone who wants hot water on hand.',
    buyingConsiderations: [
      'Pre-condition with hot water for 2 minutes before filling tea for maximum heat retention.'
    ],
    specs: {
      'Capacity': '1000 ml (1 Litre)',
      'Material': 'Grade 304 18/8 Stainless Steel with Copper Coating',
      'Insulation': 'Double Wall Vacuum Insulated',
      'Temperature Retention': 'Up to 24 Hours Hot / Cold'
    },
    isFeatured: true,
    isTrending: false,
    isUnder999: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  },
  {
    id: 'arctic-fox-slope-backpack',
    asin: 'B08F7J42ZX',
    title: 'Arctic Fox Slope 23L Anti-Theft Water Resistant Laptop Backpack',
    brand: 'Arctic Fox',
    category: 'bags-travel',
    categoryName: 'Bags & Travel',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08F7J42ZX.01._SCLZZZZZZZ_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B08F7J42ZX/?tag=amazonde0941f-21&ref=as_li_ss_tl',
    currentPrice: 999,
    originalPrice: 2499,
    discountPercent: 60,
    rating: 4.3,
    reviewCount: 14800,
    editorialOneLiner: 'Weather-resistant 23-liter commuter pack with dedicated 15.6" padded laptop sleeve.',
    editorialReview: 'Sleek, aerodynamic aesthetic with thick shoulder padding that distributes textbook and laptop weight evenly. Features hidden quick-access pockets for metro tokens and earphones.',
    pros: [
      'Padded shock-absorbent 15.6-inch laptop compartment',
      'Water-repellent polyester fabric protects against sudden monsoon drizzles',
      'Breathable airflow back panel prevents sweaty shirts'
    ],
    cons: [
      'Side bottle pocket fits standard 750ml bottles, but tight for 1L thermos flasks',
      'Zippers are durable but not 100% waterproof in heavy torrential downpours'
    ],
    bestSuitedFor: 'Daily college commuters and young professionals carrying a laptop and notes.',
    buyingConsiderations: [
      'Includes a 1-year domestic warranty against manufacturing defects.'
    ],
    specs: {
      'Capacity': '23 Litres',
      'Laptop Fit': 'Up to 15.6 inch laptops',
      'Material': 'Water-repellent 400D Polyester',
      'Weight': '480 grams'
    },
    isFeatured: true,
    isTrending: false,
    isStudentEssential: true,
    published: true,
    updatedAt: '2026-10-10T08:00:00Z',
    source: 'manual',
  }
];
