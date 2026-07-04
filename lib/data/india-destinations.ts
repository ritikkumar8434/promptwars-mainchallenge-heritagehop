// Local seed dataset — the guaranteed offline fallback for HeritageHop.
// This data grounds AI generations (see lib/ai/prompts.ts) and is used
// directly by the mock provider when no AI key is configured. Jaipur is
// the primary demo city and carries the richest detail.

import type { CitySeed, PlaceCard, HiddenGemCard, FoodCard, ExperienceCard, BudgetLevel } from '@/types/travel';

function place(p: {
  name: string;
  category: string;
  description: string;
  whyVisit: string;
  culturalSignificance: string;
  estimatedTime: string;
  budgetLevel: BudgetLevel;
  accessibilityNote: string;
  safetyNote: string;
  locationHint: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  confidence?: number;
}): PlaceCard {
  return { tags: [], confidence: 0.92, ...p };
}

function gem(p: {
  name: string;
  category: string;
  description: string;
  whyVisit: string;
  culturalSignificance: string;
  estimatedTime: string;
  budgetLevel: BudgetLevel;
  accessibilityNote: string;
  safetyNote: string;
  locationHint: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  confidence?: number;
  whyHidden: string;
  culturalImportance: string;
  bestTimeToVisit: string;
  responsibleTravelNote: string;
}): HiddenGemCard {
  return { tags: [], confidence: 0.85, ...p };
}

function food(p: {
  name: string;
  description: string;
  isVegetarian: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  whereToFind: string;
  priceHint: BudgetLevel;
  culturalNote: string;
}): FoodCard {
  return p;
}

function experience(p: {
  type: string;
  name: string;
  description: string;
  culturalContext: string;
  groupSuitability: string[];
  priceHint: BudgetLevel;
}): ExperienceCard {
  return { ctaOptions: ['Request Local Guide', 'Save Experience', 'Ask AI for Details'], ...p };
}

export const INDIA_DESTINATIONS: CitySeed[] = [
  // ── JAIPUR — primary demo city ────────────────────────────────────────
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    coordinates: { lat: 26.9124, lon: 75.7873 },
    tagline: 'The Pink City — forts, bazaars, and Rajput heritage',
    overview:
      'Jaipur, the capital of Rajasthan, is famed for its terracotta-pink old city walls, Rajput-era forts, and living bazaar culture. Founded in 1727 by Maharaja Sawai Jai Singh II, it blends royal heritage with block-printed textiles, gem trading, and street food traditions that continue today.',
    attractions: [
      place({
        name: 'Amber Fort',
        category: 'Fort & Palace',
        description: 'A hilltop Rajput fort of sandstone and marble overlooking Maota Lake, with mirrored halls and courtyards.',
        whyVisit: 'One of Rajasthan’s best-preserved forts, showcasing Hindu-Rajput architecture and elephant-gate courtyards.',
        culturalSignificance: 'Former seat of the Kachwaha Rajput rulers, built from the late 16th century onward.',
        estimatedTime: '2–3 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Steep ramps and uneven stone paths; limited wheelchair access. A jeep/golf-cart option exists partway up.',
        safetyNote: 'Crowded in peak hours; watch footing on worn marble steps.',
        locationHint: 'Amer, ~11 km north of Jaipur city center',
        latitude: 26.9855,
        longitude: 75.8513,
        tags: ['heritage', 'architecture', 'photography'],
      }),
      place({
        name: 'Hawa Mahal',
        category: 'Palace',
        description: 'A five-story pink sandstone facade with 953 small windows (jharokhas) built for royal women to observe street life.',
        whyVisit: 'Iconic symbol of Jaipur and a striking example of Rajput lattice-screen architecture.',
        culturalSignificance: 'Built in 1799 by Maharaja Sawai Pratap Singh; designed so royal women could watch festivals unseen, honoring purdah customs.',
        estimatedTime: '45–90 minutes',
        budgetLevel: 'Low',
        accessibilityNote: 'Narrow staircases inside; street-level facade viewing is fully accessible.',
        safetyNote: 'Busy road-facing entrance; watch for traffic while photographing from across the street.',
        locationHint: 'Badi Choupad, old walled city',
        latitude: 26.9239,
        longitude: 75.8267,
        tags: ['heritage', 'architecture', 'photography'],
      }),
      place({
        name: 'City Palace, Jaipur',
        category: 'Palace & Museum',
        description: 'A sprawling palace complex mixing Rajput and Mughal styles, still partly home to the former royal family, with museum wings of textiles and armory.',
        whyVisit: 'Direct window into Rajput royal life, courtly art, and the city’s founding history.',
        culturalSignificance: 'Built alongside the city’s founding in 1727 as the royal residence and administrative seat.',
        estimatedTime: '1.5–2.5 hours',
        budgetLevel: 'Medium',
        accessibilityNote: 'Mostly flat courtyards; some museum galleries have small steps.',
        safetyNote: 'Standard museum precautions; keep valuables secure in crowded courtyards.',
        locationHint: 'Old City, near Jantar Mantar',
        latitude: 26.9258,
        longitude: 75.8237,
        tags: ['heritage', 'museums', 'architecture'],
      }),
      place({
        name: 'Jantar Mantar, Jaipur',
        category: 'Astronomical Observatory',
        description: 'A UNESCO World Heritage collection of 19 monumental stone astronomical instruments.',
        whyVisit: 'A rare, functioning example of pre-telescope astronomical science and Rajput scholarship.',
        culturalSignificance: 'Built by Maharaja Sawai Jai Singh II between 1727–1734, reflecting his interest in astronomy.',
        estimatedTime: '1 hour',
        budgetLevel: 'Low',
        accessibilityNote: 'Mostly open flat terrain, wheelchair-passable with assistance on gravel patches.',
        safetyNote: 'Direct sun exposure at midday; carry water and a hat.',
        locationHint: 'Adjacent to City Palace, old walled city',
        latitude: 26.9246,
        longitude: 75.8246,
        tags: ['heritage', 'architecture', 'museums'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Panna Meena ka Kund',
        category: 'Stepwell',
        description: 'A symmetrical 16th-century stepwell near Amer with crisscrossing staircases descending to a small water tank.',
        whyVisit: 'A striking, lesser-crowded piece of water architecture, popular with photographers but overlooked by most tour buses.',
        culturalSignificance: 'Historic stepwells like this served as community water sources and cool gathering spots in Rajasthan’s arid climate.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Steep uneven steps around the tank; not wheelchair accessible. Viewing from the top is possible.',
        safetyNote: 'No railings around the stepwell edges — supervise children closely.',
        locationHint: 'Near Amer Fort, north Jaipur',
        latitude: 26.9789,
        longitude: 75.8535,
        tags: ['hidden gem', 'architecture', 'photography'],
        whyHidden: 'Overshadowed by nearby Amber Fort, so most day-tour groups skip it entirely.',
        culturalImportance: 'Represents Rajasthan’s centuries-old stepwell tradition for water conservation in a desert climate.',
        bestTimeToVisit: 'Early morning for soft light and fewer visitors',
        responsibleTravelNote: 'Do not climb onto the lower stair tiers near the water — they are fragile and slippery.',
      }),
      gem({
        name: 'Bapu Bazaar Textile Lane',
        category: 'Local Market',
        description: 'A working bazaar lane where Jaipur’s block-printing and mojari (leather shoe) artisans sell directly to shoppers.',
        whyVisit: 'A far more local, unhurried alternative to touristy craft emporiums, with visible artisan work.',
        culturalSignificance: 'Continues Jaipur’s centuries-old tradition of hand block-printing and leatherwork guilds.',
        estimatedTime: '1–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Flat but narrow and often crowded; can be difficult for wheelchair users during peak shopping hours.',
        safetyNote: 'Watch belongings in dense crowds; bargain politely and respectfully.',
        locationHint: 'Bapu Bazaar Road, old walled city',
        tags: ['hidden gem', 'markets', 'local life'],
        whyHidden: 'Sits beside larger, better-known bazaars, so casual visitors often skip its quieter side lanes.',
        culturalImportance: 'A living showcase of Jaipur’s hand block-printing and mojari-making traditions.',
        bestTimeToVisit: 'Late afternoon, when shopkeepers are open but crowds are thinner',
        responsibleTravelNote: 'Buy directly from artisan-run stalls where possible to support local livelihoods.',
      }),
    ],
    food: [
      food({
        name: 'Dal Baati Churma',
        description: 'Baked wheat balls (baati) served with spiced lentils (dal) and a sweet crumbled wheat-jaggery mix (churma).',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Local thali restaurants across the old city',
        priceHint: 'Low',
        culturalNote: 'A traditional Rajasthani staple, historically suited to the region’s arid climate and long-keeping ingredients.',
      }),
      food({
        name: 'Pyaaz Kachori',
        description: 'A deep-fried, flaky pastry stuffed with spiced onion filling, a Jaipur breakfast favorite.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Street stalls near Chandpole and MI Road',
        priceHint: 'Low',
        culturalNote: 'A beloved morning street food tied to Jaipur’s bazaar culture.',
      }),
      food({
        name: 'Ghewar',
        description: 'A disc-shaped, honeycombed sweet soaked in sugar syrup, often topped with rabri (thickened milk).',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Sweet shops in the old city, especially around festivals',
        priceHint: 'Low',
        culturalNote: 'Traditionally associated with the Teej and Raksha Bandhan festival seasons.',
      }),
      food({
        name: 'Laal Maas',
        description: 'A fiery mutton curry cooked with red chilies and Rajasthani spices.',
        isVegetarian: false,
        spiceLevel: 'Spicy',
        whereToFind: 'Traditional Rajasthani restaurants in the city',
        priceHint: 'Medium',
        culturalNote: 'Rooted in the hunting traditions of Rajput royal courts.',
      }),
    ],
    etiquette: [
      'Dress modestly when visiting temples and forts — cover shoulders and knees.',
      'Ask before photographing local people, especially artisans at work.',
      'Remove shoes before entering temple sanctums.',
      'Bargaining in bazaars is customary but should stay friendly and respectful.',
    ],
    safety: [
      'Use registered taxis or ride-hailing apps rather than unmarked vehicles.',
      'Stay hydrated — Jaipur summers can exceed 40°C between April and June.',
      'Keep valuables secure in crowded bazaar areas.',
    ],
    experiences: [
      experience({
        type: 'Heritage walk',
        name: 'Old City Pink Walls Walk',
        description: 'A guided walking route through Jaipur’s walled old city covering bazaars, havelis, and Hawa Mahal’s street-side view.',
        culturalContext: 'Traces the 1727 city plan commissioned by Sawai Jai Singh II, one of India’s earliest planned cities.',
        groupSuitability: ['Solo', 'Couple', 'Friends', 'Families'],
        priceHint: 'Low',
      }),
      experience({
        type: 'Artisan workshop',
        name: 'Block-Printing Demonstration',
        description: 'A hands-on introduction to Sanganeri block-printing with local textile artisans.',
        culturalContext: 'Sanganeri block-printing is a centuries-old craft tradition native to the Jaipur region.',
        groupSuitability: ['Solo', 'Couple', 'Families', 'Students'],
        priceHint: 'Medium',
      }),
    ],
    eventCategories: ['Heritage walk', 'Craft workshop', 'Food trail', 'Classical music evening', 'Local market festival'],
  },

  // ── VARANASI ───────────────────────────────────────────────────────────
  {
    slug: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.3176, lon: 82.9739 },
    tagline: 'Ghats, ritual, and one of the world’s oldest living cities',
    overview:
      'Varanasi sits on the Ganges’ western bank and is among the oldest continuously inhabited cities in the world. Its ghats host daily rituals, cremation rites, and the evening Ganga Aarti — a living spiritual tradition, not a staged performance.',
    attractions: [
      place({
        name: 'Dashashwamedh Ghat',
        category: 'Ghat',
        description: 'Varanasi’s most prominent ghat, site of the nightly Ganga Aarti ceremony.',
        whyVisit: 'Witness a centuries-old Hindu ritual honoring the Ganges river.',
        culturalSignificance: 'One of the oldest and most sacred ghats, linked in tradition to Lord Brahma.',
        estimatedTime: '1–2 hours (evening aarti)',
        budgetLevel: 'Free',
        accessibilityNote: 'Uneven stone steps to the river; viewing platforms and boats offer alternatives to walking down.',
        safetyNote: 'Very crowded during aarti — keep close to your group and watch your step near the water.',
        locationHint: 'Central ghats, along the Ganges',
        latitude: 25.3072,
        longitude: 83.0104,
        tags: ['heritage', 'spirituality'],
      }),
      place({
        name: 'Kashi Vishwanath Temple',
        category: 'Temple',
        description: 'One of the twelve Jyotirlinga shrines dedicated to Lord Shiva.',
        whyVisit: 'Among the most revered Hindu pilgrimage sites in India.',
        culturalSignificance: 'Rebuilt multiple times through history; the current structure dates to 1780.',
        estimatedTime: '1–1.5 hours',
        budgetLevel: 'Free',
        accessibilityNote: 'Security lines and narrow lanes; limited accessibility for wheelchair users.',
        safetyNote: 'Photography and phones are restricted inside — follow posted rules.',
        locationHint: 'Vishwanath Gali, old city',
        latitude: 25.3109,
        longitude: 83.0107,
        tags: ['spirituality', 'heritage'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Assi Ghat Morning Yoga Circle',
        category: 'Ghat & Community Space',
        description: 'A quieter southern ghat where locals gather at dawn for yoga, prayer, and river-facing conversation.',
        whyVisit: 'A calmer, community-oriented view of ghat life compared to the crowded central ghats.',
        culturalSignificance: 'Historically associated with the sage Agastya in local tradition.',
        estimatedTime: '45–90 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Gentler slope than most ghats, but still uneven stone.',
        safetyNote: 'Early morning area is generally calm; standard river-edge caution applies.',
        locationHint: 'Southern end of the ghats',
        tags: ['hidden gem', 'spirituality', 'local life'],
        whyHidden: 'Tourist itineraries focus on the central ghats and miss this quieter southern stretch.',
        culturalImportance: 'Reflects everyday devotional life beyond the ritual spectacle seen by most visitors.',
        bestTimeToVisit: 'Sunrise',
        responsibleTravelNote: 'Observe quietly; this is a functioning community and prayer space, not a tourist show.',
      }),
    ],
    food: [
      food({
        name: 'Kachori Sabzi',
        description: 'Fried lentil-stuffed kachori served with spiced potato curry, a classic Varanasi breakfast.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Old city breakfast stalls',
        priceHint: 'Low',
        culturalNote: 'A morning ritual food tied to the city’s bazaar rhythm.',
      }),
      food({
        name: 'Banarasi Paan',
        description: 'A betel-leaf preparation with areca nut, condiments, and sometimes sweet fillings.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Paan shops throughout the old city',
        priceHint: 'Low',
        culturalNote: 'Deeply tied to Varanasi’s identity as a symbol of hospitality and leisure.',
      }),
    ],
    etiquette: [
      'Dress conservatively, especially near temples and cremation ghats.',
      'Never photograph cremation rites at Manikarnika or Harishchandra Ghat.',
      'Ask permission before photographing pilgrims or sadhus.',
    ],
    safety: [
      'Riverbanks can be slippery — wear closed shoes with grip.',
      'Avoid swimming in the Ganges near central ghats due to strong currents.',
      'Use officially licensed boatmen for river rides.',
    ],
    experiences: [
      experience({
        type: 'Spiritual experience',
        name: 'Sunrise Boat Ride on the Ganges',
        description: 'A dawn boat trip along the ghats to observe morning rituals from the water.',
        culturalContext: 'Offers a respectful vantage point onto centuries-old riverside devotional practice.',
        groupSuitability: ['Solo', 'Couple', 'Families', 'Senior travelers'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Temple/ghat cultural visit', 'Classical music evening', 'Heritage walk'],
  },

  // ── DELHI ──────────────────────────────────────────────────────────────
  {
    slug: 'delhi',
    name: 'Delhi',
    state: 'Delhi (NCT)',
    coordinates: { lat: 28.6139, lon: 77.2090 },
    tagline: 'Layers of Mughal, colonial, and modern Indian history',
    overview:
      'Delhi has served as capital across multiple empires, leaving a dense layering of Mughal monuments, colonial-era architecture, and modern institutions side by side.',
    attractions: [
      place({
        name: 'Humayun’s Tomb',
        category: 'Mughal Monument',
        description: 'A red-sandstone and marble tomb complex that inspired the Taj Mahal’s design.',
        whyVisit: 'A UNESCO World Heritage Site and landmark of early Mughal garden-tomb architecture.',
        culturalSignificance: 'Built in 1570 for Mughal Emperor Humayun by his widow Empress Bega Begum.',
        estimatedTime: '1.5–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Paved paths through gardens; some steps at the main tomb platform.',
        safetyNote: 'Large open complex — carry water in summer heat.',
        locationHint: 'Nizamuddin East, Central Delhi',
        latitude: 28.5933,
        longitude: 77.2507,
        tags: ['heritage', 'architecture'],
      }),
      place({
        name: 'Red Fort (Lal Qila)',
        category: 'Fort',
        description: 'A massive red-sandstone Mughal fort that served as the main residence of Mughal emperors.',
        whyVisit: 'A defining symbol of Mughal power and modern Indian independence ceremonies.',
        culturalSignificance: 'Built by Shah Jahan starting 1638; site of India’s annual Independence Day flag hoisting.',
        estimatedTime: '1.5–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Large flat courtyards; some uneven pathways in outer sections.',
        safetyNote: 'Security screening at entry; keep bags minimal.',
        locationHint: 'Old Delhi, near Chandni Chowk',
        latitude: 28.6562,
        longitude: 77.2410,
        tags: ['heritage', 'architecture'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Hauz Khas Village Stepwell',
        category: 'Stepwell & Ruins',
        description: 'A 14th-century stepwell and madrasa complex beside a lake, now bordered by a creative arts district.',
        whyVisit: 'A quiet historic ruin adjoining a lively local arts and cafe neighborhood.',
        culturalSignificance: 'Built under Sultan Feroz Shah Tughlaq as a water reservoir and Islamic seminary.',
        estimatedTime: '1 hour',
        budgetLevel: 'Free',
        accessibilityNote: 'Uneven ruins terrain; village lanes can be narrow.',
        safetyNote: 'Standard urban caution in the surrounding market lanes.',
        locationHint: 'Hauz Khas, South Delhi',
        tags: ['hidden gem', 'heritage', 'architecture'],
        whyHidden: 'Overshadowed by Delhi’s larger Mughal monuments despite comparable historical depth.',
        culturalImportance: 'A rare surviving Tughlaq-era educational and water-management complex.',
        bestTimeToVisit: 'Late afternoon before sunset',
        responsibleTravelNote: 'Avoid climbing on fragile ruin structures.',
      }),
    ],
    food: [
      food({
        name: 'Chole Bhature',
        description: 'Spiced chickpea curry served with deep-fried leavened bread.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Old Delhi and Connaught Place eateries',
        priceHint: 'Low',
        culturalNote: 'A North Indian street-food staple popular across Delhi’s markets.',
      }),
      food({
        name: 'Butter Chicken',
        description: 'Tandoor-roasted chicken in a creamy tomato-based curry.',
        isVegetarian: false,
        spiceLevel: 'Mild',
        whereToFind: 'Restaurants across the city, originating near Old Delhi',
        priceHint: 'Medium',
        culturalNote: 'Said to have originated in Delhi’s Moti Mahal restaurant in the late 1940s.',
      }),
    ],
    etiquette: [
      'Dress modestly at religious sites such as Jama Masjid.',
      'Bargain respectfully in markets like Chandni Chowk.',
      'Remove footwear before entering gurdwaras, temples, and mosques.',
    ],
    safety: [
      'Use metro or registered cabs for late-night travel.',
      'Stay alert for pickpockets in crowded market areas.',
      'Air quality can be poor in winter — sensitive travelers should check daily AQI.',
    ],
    experiences: [
      experience({
        type: 'Food trail',
        name: 'Old Delhi Street Food Walk',
        description: 'A guided tasting route through Chandni Chowk’s historic food lanes.',
        culturalContext: 'Chandni Chowk has been a trading and food hub since the 17th-century Mughal era.',
        groupSuitability: ['Solo', 'Friends', 'Couple'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Museum exhibition', 'Food trail'],
  },

  // ── MUMBAI ─────────────────────────────────────────────────────────────
  {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    coordinates: { lat: 19.0760, lon: 72.8777 },
    tagline: 'Colonial architecture, coastline, and cinema culture',
    overview:
      'Mumbai grew from seven fishing islands into India’s financial and film capital, blending Indo-Gothic colonial architecture, Art Deco neighborhoods, and a vibrant coastal street-food scene.',
    attractions: [
      place({
        name: 'Gateway of India',
        category: 'Monument',
        description: 'A basalt arch monument overlooking the Arabian Sea, built in Indo-Saracenic style.',
        whyVisit: 'An iconic waterfront landmark and popular starting point for harbor boat rides.',
        culturalSignificance: 'Built in 1924 to commemorate King George V and Queen Mary’s 1911 visit.',
        estimatedTime: '45–60 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Flat, paved waterfront promenade; generally accessible.',
        safetyNote: 'Very crowded; keep an eye on belongings and children.',
        locationHint: 'Colaba, South Mumbai',
        latitude: 18.9220,
        longitude: 72.8347,
        tags: ['heritage', 'architecture', 'photography'],
      }),
      place({
        name: 'Chhatrapati Shivaji Maharaj Terminus',
        category: 'Railway Heritage',
        description: 'A UNESCO-listed Victorian Gothic railway station still in daily operation.',
        whyVisit: 'One of the finest examples of Victorian Gothic Revival architecture blended with Indian traditional elements.',
        culturalSignificance: 'Completed in 1888 during British colonial rule, named after the Maratha king Shivaji.',
        estimatedTime: '30–45 minutes (exterior/heritage viewing)',
        budgetLevel: 'Free',
        accessibilityNote: 'Busy working station; ramps available at main entrances.',
        safetyNote: 'Extremely crowded during commuter hours — visit exterior during off-peak times.',
        locationHint: 'Fort area, South Mumbai',
        latitude: 18.9398,
        longitude: 72.8355,
        tags: ['heritage', 'architecture'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Khotachiwadi Heritage Lane',
        category: 'Heritage Neighborhood',
        description: 'A small East Indian Christian hamlet of colorful 19th-century Portuguese-style bungalows.',
        whyVisit: 'A rare surviving pocket of old Mumbai village architecture amid high-rises.',
        culturalSignificance: 'Settled by the East Indian community in the 1800s, reflecting Mumbai’s Portuguese colonial-era heritage.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Narrow lanes, some uneven paving; not wheelchair-friendly.',
        safetyNote: 'Residential area — keep noise low and be respectful of private homes.',
        locationHint: 'Girgaon, South Mumbai',
        tags: ['hidden gem', 'heritage', 'local life'],
        whyHidden: 'Tucked behind busy Girgaon streets, easy to miss without local knowledge.',
        culturalImportance: 'One of the last intact examples of Mumbai’s old village-style residential heritage.',
        bestTimeToVisit: 'Weekday mornings for quiet streets',
        responsibleTravelNote: 'This is a lived-in residential area — photograph homes only with resident consent.',
      }),
    ],
    food: [
      food({
        name: 'Vada Pav',
        description: 'A spiced potato fritter in a soft bun, often served with chutneys.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Street stalls citywide',
        priceHint: 'Low',
        culturalNote: 'Considered Mumbai’s quintessential street food, born from the city’s working-class food stalls.',
      }),
      food({
        name: 'Pav Bhaji',
        description: 'A thick mixed-vegetable mash served with buttered bread rolls.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Street food stalls, especially near Chowpatty',
        priceHint: 'Low',
        culturalNote: 'Originated as a quick meal for Mumbai’s textile mill workers.',
      }),
    ],
    etiquette: [
      'Dress modestly when visiting religious sites like Haji Ali Dargah.',
      'Queue patiently — Mumbai’s public spaces are densely used.',
      'Tipping is appreciated but not mandatory in most local eateries.',
    ],
    safety: [
      'Monsoon season (June–September) can cause flooding — check forecasts.',
      'Use local trains outside rush hour if unfamiliar with the crowd levels.',
      'Stick to marked areas at Marine Drive and Juhu Beach at night.',
    ],
    experiences: [
      experience({
        type: 'Market walk',
        name: 'Colaba Causeway & Fort Heritage Walk',
        description: 'A walking tour connecting colonial architecture with the Colaba shopping strip.',
        culturalContext: 'Traces Mumbai’s growth as a British colonial port city.',
        groupSuitability: ['Solo', 'Couple', 'Friends'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Food trail', 'Museum exhibition'],
  },

  // ── KOLKATA ────────────────────────────────────────────────────────────
  {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    coordinates: { lat: 22.5726, lon: 88.3639 },
    tagline: 'Colonial grandeur, literature, and Bengali culture',
    overview:
      'Kolkata, former capital of British India, carries a rich intellectual and artistic legacy — from colonial-era architecture to its enduring literary, musical, and culinary traditions.',
    attractions: [
      place({
        name: 'Victoria Memorial',
        category: 'Monument & Museum',
        description: 'A grand white marble memorial building set in expansive gardens, housing a museum of colonial-era history.',
        whyVisit: 'A landmark of British colonial architecture and one of India’s largest museums.',
        culturalSignificance: 'Built between 1906–1921 in memory of Queen Victoria.',
        estimatedTime: '1.5–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Flat garden paths; museum interior has ramps at main entrances.',
        safetyNote: 'Popular with large crowds on weekends.',
        locationHint: 'Maidan area, central Kolkata',
        latitude: 22.5448,
        longitude: 88.3426,
        tags: ['heritage', 'museums', 'architecture'],
      }),
      place({
        name: 'Howrah Bridge',
        category: 'Landmark',
        description: 'A cantilever bridge over the Hooghly River, one of the busiest bridges in the world.',
        whyVisit: 'An engineering landmark and iconic symbol of Kolkata’s skyline.',
        culturalSignificance: 'Completed in 1943, connecting Kolkata to Howrah without any nuts or bolts in its original construction.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Pedestrian walkway can be very crowded; uneven footing in places.',
        safetyNote: 'Heavy traffic and crowds — stay within pedestrian lanes.',
        locationHint: 'Between Kolkata and Howrah',
        latitude: 22.5851,
        longitude: 88.3468,
        tags: ['heritage', 'photography'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'College Street Book Market',
        category: 'Market & Literary Landmark',
        description: 'Asia’s largest second-hand book market, lining the street outside Presidency University and Calcutta University.',
        whyVisit: 'A living tribute to Kolkata’s identity as India’s intellectual and literary capital.',
        culturalSignificance: 'Operating for over a century, tied to Bengal’s 19th-century cultural renaissance.',
        estimatedTime: '1 hour',
        budgetLevel: 'Free',
        accessibilityNote: 'Crowded narrow footpaths; not easily wheelchair accessible.',
        safetyNote: 'Watch for traffic on the adjoining road while browsing stalls.',
        locationHint: 'College Street, central Kolkata',
        tags: ['hidden gem', 'local life', 'heritage'],
        whyHidden: 'Popular with locals and students but rarely on standard tourist itineraries.',
        culturalImportance: 'Symbol of the Bengal Renaissance’s lasting emphasis on literature and education.',
        bestTimeToVisit: 'Weekday afternoons',
        responsibleTravelNote: 'Support small independent booksellers rather than only larger stalls.',
      }),
    ],
    food: [
      food({
        name: 'Kosha Mangsho',
        description: 'A slow-cooked, richly spiced mutton curry.',
        isVegetarian: false,
        spiceLevel: 'Medium',
        whereToFind: 'Bengali restaurants across the city',
        priceHint: 'Medium',
        culturalNote: 'A festive Bengali dish often served on special occasions.',
      }),
      food({
        name: 'Rosogolla',
        description: 'Soft, spongy cheese balls soaked in light sugar syrup.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Sweet shops citywide',
        priceHint: 'Low',
        culturalNote: 'A Bengali sweet with a Geographical Indication (GI) tag tied to the region.',
      }),
    ],
    etiquette: [
      'Dress modestly at temples such as Kalighat and Dakshineswar.',
      'Public discussions of politics and literature are common — engage respectfully.',
      'Tipping in local eateries is appreciated but modest.',
    ],
    safety: [
      'Monsoon flooding can affect low-lying areas June–September.',
      'Use metered taxis, prepaid taxi counters, or ride apps.',
    ],
    experiences: [
      experience({
        type: 'Heritage walk',
        name: 'North Kolkata Heritage Homes Walk',
        description: 'A walking tour through old zamindar mansions and narrow historic lanes of North Kolkata.',
        culturalContext: 'Reflects 19th-century Bengali aristocratic and cultural history.',
        groupSuitability: ['Solo', 'Couple', 'Friends', 'Senior travelers'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Classical music evening', 'Museum exhibition'],
  },

  // ── KOCHI ──────────────────────────────────────────────────────────────
  {
    slug: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    coordinates: { lat: 9.9312, lon: 76.2673 },
    tagline: 'Spice-trade harbor with layered Portuguese, Dutch, and Jewish heritage',
    overview:
      'Kochi’s Fort Kochi and Mattancherry districts preserve centuries of maritime spice-trade history, with Portuguese churches, Dutch-era palaces, Chinese fishing nets, and one of India’s oldest Jewish communities.',
    attractions: [
      place({
        name: 'Chinese Fishing Nets, Fort Kochi',
        category: 'Cultural Landmark',
        description: 'Large shore-operated fishing nets, believed introduced by traders centuries ago.',
        whyVisit: 'A distinctive and photogenic symbol of Kochi’s trading-port history.',
        culturalSignificance: 'Believed to have arrived via Chinese trade connections during the reign of Kublai Khan-era traders.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Flat waterfront promenade, generally accessible.',
        safetyNote: 'Slippery surfaces near the water’s edge.',
        locationHint: 'Fort Kochi waterfront',
        latitude: 9.9658,
        longitude: 76.2422,
        tags: ['heritage', 'photography'],
      }),
      place({
        name: 'Paradesi Synagogue',
        category: 'Religious Heritage Site',
        description: 'The oldest active synagogue in the Commonwealth, with hand-painted Chinese tiles and Belgian chandeliers.',
        whyVisit: 'A rare living record of Kochi’s centuries-old Jewish community.',
        culturalSignificance: 'Built in 1568, central to the history of Kerala’s Cochin Jewish community.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Low',
        accessibilityNote: 'Some narrow interior spaces; limited wheelchair access.',
        safetyNote: 'Closed on Saturdays (Sabbath) and Jewish holidays — check hours ahead.',
        locationHint: 'Jew Town, Mattancherry',
        latitude: 9.9580,
        longitude: 76.2593,
        tags: ['heritage', 'spirituality'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Mattancherry Spice Market Lanes',
        category: 'Traditional Market',
        description: 'Narrow warehouse lanes stacked with sacks of cardamom, pepper, and ginger, still functioning as a wholesale trade hub.',
        whyVisit: 'An aromatic, working link to Kerala’s centuries-old spice trade.',
        culturalSignificance: 'Kochi was a key node in the historic Indian Ocean spice trade routes.',
        estimatedTime: '45–60 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Narrow lanes with uneven flooring; not easily wheelchair accessible.',
        safetyNote: 'Watch footing on sacks and loading areas; narrow lanes with occasional vehicle traffic.',
        locationHint: 'Mattancherry, near Jew Town',
        tags: ['hidden gem', 'markets', 'local life'],
        whyHidden: 'Overshadowed by the more famous Jew Town antique shops nearby.',
        culturalImportance: 'A living continuation of the spice trade that first drew global traders to Kerala’s coast.',
        bestTimeToVisit: 'Weekday mornings when trading is active',
        responsibleTravelNote: 'This is a working commercial space — be mindful of laborers and loading activity.',
      }),
    ],
    food: [
      food({
        name: 'Kerala Fish Curry',
        description: 'A tangy, coconut-and-kokum-based fish curry.',
        isVegetarian: false,
        spiceLevel: 'Medium',
        whereToFind: 'Local Kerala restaurants (toddy shops and home-style eateries)',
        priceHint: 'Medium',
        culturalNote: 'Reflects Kerala’s coastal Malabar culinary tradition.',
      }),
      food({
        name: 'Appam with Stew',
        description: 'Fermented rice-and-coconut pancakes served with a mild vegetable or meat stew.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Breakfast eateries across Kochi',
        priceHint: 'Low',
        culturalNote: 'A Kerala Christian community breakfast staple, often served during festive gatherings.',
      }),
    ],
    etiquette: [
      'Dress modestly at churches, synagogues, and temples.',
      'Remove footwear before entering religious premises.',
      'Photography inside the Paradesi Synagogue is typically restricted — check posted rules.',
    ],
    safety: [
      'Monsoon season (June–September) brings heavy rain — plan indoor alternatives.',
      'Ferries are a common and generally safe way to cross harbor waters; follow posted safety guidance.',
    ],
    experiences: [
      experience({
        type: 'Cooking class',
        name: 'Kerala Home-Style Cooking Class',
        description: 'A hands-on class preparing coconut-based Kerala dishes with a local host family.',
        culturalContext: 'Introduces Kerala’s distinct coconut-and-spice culinary identity.',
        groupSuitability: ['Solo', 'Couple', 'Friends', 'Families'],
        priceHint: 'Medium',
      }),
    ],
    eventCategories: ['Heritage walk', 'Food trail', 'Classical music evening'],
  },

  // ── HYDERABAD ──────────────────────────────────────────────────────────
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    coordinates: { lat: 17.3850, lon: 78.4867 },
    tagline: 'Nizami heritage, pearls, and biryani culture',
    overview:
      'Hyderabad blends Qutb Shahi and Nizam-era Islamic architecture with a thriving modern tech sector, alongside a globally renowned culinary and pearl-trading heritage.',
    attractions: [
      place({
        name: 'Charminar',
        category: 'Monument',
        description: 'A four-towered granite and limestone monument marking the heart of the old city.',
        whyVisit: 'Hyderabad’s defining landmark and gateway to its historic bazaars.',
        culturalSignificance: 'Built in 1591 by Muhammad Quli Qutb Shah to mark the end of a plague epidemic.',
        estimatedTime: '45–60 minutes',
        budgetLevel: 'Low',
        accessibilityNote: 'Narrow spiral staircase to upper floors; ground-level viewing is accessible.',
        safetyNote: 'Very busy traffic circle — cross carefully at designated points.',
        locationHint: 'Old City, Hyderabad',
        latitude: 17.3616,
        longitude: 78.4747,
        tags: ['heritage', 'architecture'],
      }),
      place({
        name: 'Golconda Fort',
        category: 'Fort',
        description: 'A massive fortified citadel once famed for diamond trade, with acoustic engineering that carries sound across the complex.',
        whyVisit: 'A dramatic hilltop fort showcasing military and acoustic architectural ingenuity.',
        culturalSignificance: 'Capital of the Qutb Shahi dynasty and a historic diamond-trading center including the Koh-i-Noor’s reputed origin region.',
        estimatedTime: '2–3 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Extensive uneven steps and inclines; not wheelchair accessible.',
        safetyNote: 'Uneven and steep paths — wear sturdy footwear.',
        locationHint: 'Golconda, west Hyderabad',
        latitude: 17.3833,
        longitude: 78.4011,
        tags: ['heritage', 'architecture'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Paigah Tombs',
        category: 'Heritage Tombs',
        description: 'Ornate marble mausoleums of the Paigah nobility, featuring intricate inlay work, largely unvisited by tourists.',
        whyVisit: 'Exceptional stonework rivaling more famous monuments, in a peaceful setting.',
        culturalSignificance: 'Built over the 18th–20th centuries for the Paigah family, nobles closely tied to the Nizams.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Flat courtyard areas; some uneven stone flooring.',
        safetyNote: 'Quiet site — visit during daylight hours.',
        locationHint: 'Santosh Nagar, Hyderabad',
        tags: ['hidden gem', 'heritage', 'architecture'],
        whyHidden: 'Little-publicized compared to Golconda Fort and Charminar despite comparable craftsmanship.',
        culturalImportance: 'One of the finest surviving examples of Deccani marble inlay artistry.',
        bestTimeToVisit: 'Weekday mornings',
        responsibleTravelNote: 'Treat as an active burial site — maintain quiet and respectful conduct.',
      }),
    ],
    food: [
      food({
        name: 'Hyderabadi Biryani',
        description: 'Fragrant basmati rice layered and slow-cooked (dum) with marinated meat and spices.',
        isVegetarian: false,
        spiceLevel: 'Spicy',
        whereToFind: 'Biryani houses across the city, especially the old city',
        priceHint: 'Medium',
        culturalNote: 'A signature dish blending Mughlai and Deccani culinary traditions from the Nizam era.',
      }),
      food({
        name: 'Qubani ka Meetha',
        description: 'A dessert of stewed dried apricots served with cream or custard.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Nizami-style restaurants in the old city',
        priceHint: 'Low',
        culturalNote: 'A traditional Hyderabadi Nizam-era dessert.',
      }),
    ],
    etiquette: [
      'Dress modestly near Charminar and Mecca Masjid.',
      'Bargain politely in the pearl and bangle markets of Laad Bazaar.',
      'Respect prayer times when visiting active mosques.',
    ],
    safety: [
      'Old city traffic is dense — use pedestrian crossings carefully.',
      'Keep valuables secure in crowded bazaar lanes.',
    ],
    experiences: [
      experience({
        type: 'Market walk',
        name: 'Laad Bazaar Pearl & Bangle Walk',
        description: 'A walking tour of Hyderabad’s historic bangle and pearl trading lanes.',
        culturalContext: 'Reflects Hyderabad’s long-standing reputation as a global pearl-trading hub.',
        groupSuitability: ['Solo', 'Couple', 'Friends'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Food trail', 'Craft workshop'],
  },

  // ── BENGALURU ──────────────────────────────────────────────────────────
  {
    slug: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    coordinates: { lat: 12.9716, lon: 77.5946 },
    tagline: 'Garden city heritage meets India’s tech capital',
    overview:
      'Bengaluru pairs a fast-growing tech economy with Vijayanagara and Wodeyar-era heritage, colonial-era parks, and a strong contemporary arts and cafe culture.',
    attractions: [
      place({
        name: 'Bangalore Palace',
        category: 'Palace',
        description: 'A Tudor-style palace built for the Wodeyar royal family, featuring wood carvings and stained glass.',
        whyVisit: 'A striking architectural departure from typical Indo-Islamic palace styles.',
        culturalSignificance: 'Completed in 1878, inspired by England’s Windsor Castle.',
        estimatedTime: '1–1.5 hours',
        budgetLevel: 'Medium',
        accessibilityNote: 'Some interior staircases; gardens are flat and accessible.',
        safetyNote: 'Standard palace-visit precautions.',
        locationHint: 'Vasanth Nagar, central Bengaluru',
        latitude: 12.9987,
        longitude: 77.5920,
        tags: ['heritage', 'architecture'],
      }),
      place({
        name: 'Lalbagh Botanical Garden',
        category: 'Garden',
        description: 'A historic 240-acre botanical garden with a glasshouse and rare tree collections.',
        whyVisit: 'A green heritage landmark reflecting Bengaluru’s "Garden City" identity.',
        culturalSignificance: 'Founded in 1760 under Hyder Ali, later expanded by British horticulturists.',
        estimatedTime: '1.5–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Mostly flat paved paths, wheelchair-friendly in main areas.',
        safetyNote: 'Large open park — stay on marked paths after dark.',
        locationHint: 'Lalbagh, South Bengaluru',
        latitude: 12.9507,
        longitude: 77.5848,
        tags: ['nature', 'heritage'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Bangalore Pete Markets',
        category: 'Old Market Quarter',
        description: 'The city’s original market core, with specialized lanes for flowers, spices, and metalware dating to the 16th century.',
        whyVisit: 'A window into pre-colonial Bengaluru, in contrast to the modern tech-city image.',
        culturalSignificance: 'Founded around Bengaluru’s original fort area under Kempe Gowda I in the 1500s.',
        estimatedTime: '1–1.5 hours',
        budgetLevel: 'Free',
        accessibilityNote: 'Crowded, narrow lanes; not wheelchair accessible.',
        safetyNote: 'Dense traffic and foot crowds — watch belongings.',
        locationHint: 'Chickpete/Balepete area, old Bengaluru',
        tags: ['hidden gem', 'markets', 'local life'],
        whyHidden: 'Overlooked by visitors focused on Bengaluru’s modern tech-park image.',
        culturalImportance: 'Marks the founding core of the city under Kempe Gowda I.',
        bestTimeToVisit: 'Weekday mornings',
        responsibleTravelNote: 'Be mindful of narrow lanes shared with working vendors and porters.',
      }),
    ],
    food: [
      food({
        name: 'Masala Dosa',
        description: 'A crisp fermented rice-lentil crepe filled with spiced potato.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Darshinis (local fast-casual eateries) across the city',
        priceHint: 'Low',
        culturalNote: 'A South Indian breakfast staple deeply embedded in Bengaluru’s daily food culture.',
      }),
      food({
        name: 'Bisi Bele Bath',
        description: 'A spiced rice, lentil, and vegetable one-pot dish from Karnataka.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Karnataka-style restaurants citywide',
        priceHint: 'Low',
        culturalNote: 'A traditional Karnataka comfort food, often served at festive meals.',
      }),
    ],
    etiquette: [
      'Dress modestly at temple sites such as Bull Temple.',
      'Traffic can be dense — allow extra travel time between sites.',
      'Tipping in cafes and restaurants is appreciated but optional.',
    ],
    safety: [
      'Use ride-hailing apps for late-night travel.',
      'Traffic congestion is significant — plan routes with buffer time.',
    ],
    experiences: [
      experience({
        type: 'Market walk',
        name: 'Old Bengaluru Pete Walk',
        description: 'A walking tour through the historic market lanes of the original Bengaluru fort area.',
        culturalContext: 'Traces the city’s founding under Kempe Gowda I in the 16th century.',
        groupSuitability: ['Solo', 'Couple', 'Friends', 'Students'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Craft workshop', 'Museum exhibition'],
  },

  // ── UDAIPUR ────────────────────────────────────────────────────────────
  {
    slug: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    coordinates: { lat: 24.5854, lon: 73.7125 },
    tagline: 'The City of Lakes, Mewar palaces, and lakeside heritage',
    overview:
      'Udaipur, founded in 1559 by Maharana Udai Singh II, is known for its artificial lakes, Mewar-dynasty palaces, and hillside havelis reflecting Rajput royal history.',
    attractions: [
      place({
        name: 'City Palace, Udaipur',
        category: 'Palace',
        description: 'A grand palace complex overlooking Lake Pichola, combining Rajasthani and Mughal architectural styles.',
        whyVisit: 'One of the largest palace complexes in Rajasthan, still partly used by the former royal family.',
        culturalSignificance: 'Construction began in 1559 under Maharana Udai Singh II, expanded by successive Mewar rulers.',
        estimatedTime: '2 hours',
        budgetLevel: 'Medium',
        accessibilityNote: 'Multiple courtyards with stairs; some ground-floor sections are more accessible.',
        safetyNote: 'Crowded during peak season — hold onto railings on palace staircases.',
        locationHint: 'Old City, beside Lake Pichola',
        latitude: 24.5764,
        longitude: 73.6833,
        tags: ['heritage', 'architecture'],
      }),
      place({
        name: 'Lake Pichola',
        category: 'Lake',
        description: 'An artificial lake dating to 1362, surrounded by palaces, ghats, and hills.',
        whyVisit: 'The scenic centerpiece of Udaipur, best experienced by boat at sunset.',
        culturalSignificance: 'Expanded under Maharana Udai Singh II when he founded the city.',
        estimatedTime: '1–1.5 hours (boat ride)',
        budgetLevel: 'Low',
        accessibilityNote: 'Boat boarding involves a few steps; check operator for assistance.',
        safetyNote: 'Wear life jackets provided on boat rides.',
        locationHint: 'Central Udaipur',
        latitude: 24.5764,
        longitude: 73.6800,
        tags: ['nature', 'heritage', 'photography'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Bagore ki Haveli Courtyard',
        category: 'Heritage Haveli',
        description: 'An 18th-century haveli museum with restored courtyards and evening folk-dance performances.',
        whyVisit: 'Offers an intimate look at Mewar aristocratic domestic life, less crowded than the City Palace.',
        culturalSignificance: 'Built in the 18th century by a Mewar prime minister on the shores of Lake Pichola.',
        estimatedTime: '1 hour',
        budgetLevel: 'Low',
        accessibilityNote: 'Some narrow staircases between floors.',
        safetyNote: 'Standard museum precautions.',
        locationHint: 'Gangaur Ghat, Udaipur',
        tags: ['hidden gem', 'heritage', 'architecture'],
        whyHidden: 'Often skipped in favor of the larger, more famous City Palace nearby.',
        culturalImportance: 'Preserves aristocratic Mewar-era domestic architecture and folk performance traditions.',
        bestTimeToVisit: 'Early evening, ahead of the folk dance show',
        responsibleTravelNote: 'Support the museum’s ticketed folk-art performances rather than informal street replicas.',
      }),
    ],
    food: [
      food({
        name: 'Dal Baati Churma',
        description: 'Baked wheat balls with spiced lentils and sweet crumbled wheat-jaggery mix.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Rajasthani thali restaurants',
        priceHint: 'Low',
        culturalNote: 'A shared Rajasthani staple across the state, including Udaipur’s Mewar region.',
      }),
    ],
    etiquette: [
      'Dress modestly when visiting temples and palace complexes.',
      'Ask before photographing performers at cultural shows.',
    ],
    safety: [
      'Boat rides should only be taken with licensed operators wearing life jackets.',
      'Old city lanes can be narrow — watch for two-wheeler traffic.',
    ],
    experiences: [
      experience({
        type: 'Heritage walk',
        name: 'Lake Pichola Ghats Walk',
        description: 'A walking route connecting the City Palace ghats with Bagore ki Haveli.',
        culturalContext: 'Traces the Mewar dynasty’s lakeside urban planning from the 16th century onward.',
        groupSuitability: ['Solo', 'Couple', 'Families', 'Senior travelers'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Classical music evening', 'Craft workshop'],
  },

  // ── AMRITSAR ───────────────────────────────────────────────────────────
  {
    slug: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    coordinates: { lat: 31.6340, lon: 74.8723 },
    tagline: 'The Golden Temple, Sikh heritage, and Punjabi hospitality',
    overview:
      'Amritsar is the spiritual center of Sikhism, home to the Golden Temple’s community kitchen serving free meals to all, alongside a rich Punjabi food and border-history heritage.',
    attractions: [
      place({
        name: 'Golden Temple (Sri Harmandir Sahib)',
        category: 'Religious Heritage Site',
        description: 'A gold-plated Sikh gurdwara set within a sacred pool, hosting the world’s largest free community kitchen (langar).',
        whyVisit: 'The holiest Sikh shrine and a profound example of community service through free meals to all visitors.',
        culturalSignificance: 'Built in the late 16th century under the guidance of Guru Ram Das and Guru Arjan.',
        estimatedTime: '2–3 hours',
        budgetLevel: 'Free',
        accessibilityNote: 'Wheelchair access available at main entrances; marble floors can be slippery when wet.',
        safetyNote: 'Cover your head and remove shoes before entering; follow queue etiquette at the langar hall.',
        locationHint: 'Golden Temple Road, Amritsar',
        latitude: 31.6200,
        longitude: 74.8765,
        tags: ['spirituality', 'heritage'],
      }),
      place({
        name: 'Wagah Border Ceremony',
        category: 'Cultural Ceremony',
        description: 'A daily military flag-lowering ceremony at the India-Pakistan border, marked by spirited crowds.',
        whyVisit: 'A unique display of patriotic ceremony and cross-border pageantry.',
        culturalSignificance: 'A retreat ceremony held since 1959 by the Border Security Force and Pakistan Rangers.',
        estimatedTime: '1.5–2 hours including travel and seating',
        budgetLevel: 'Free',
        accessibilityNote: 'Stadium-style seating with stairs; arrive early for closer, more accessible seats.',
        safetyNote: 'Large, high-energy crowds — keep close to your group and follow security instructions.',
        locationHint: 'Wagah, ~28 km from Amritsar',
        latitude: 31.6046,
        longitude: 74.5738,
        tags: ['heritage', 'photography'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Gali Guranditta Heritage Street',
        category: 'Old City Lane',
        description: 'A quiet old-city street of preserved pre-partition havelis and traditional Punjabi facades.',
        whyVisit: 'A rare, still-standing glimpse of Amritsar’s pre-1947 residential architecture.',
        culturalSignificance: 'Reflects Amritsar’s Partition-era history as a major pre-1947 trading city.',
        estimatedTime: '30–45 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Narrow lanes with uneven paving.',
        safetyNote: 'Residential lane — keep noise levels respectful.',
        locationHint: 'Old city, near Golden Temple',
        tags: ['hidden gem', 'heritage', 'local life'],
        whyHidden: 'Rarely marketed to tourists despite being minutes from the Golden Temple.',
        culturalImportance: 'One of the few remaining stretches of pre-Partition residential heritage in the old city.',
        bestTimeToVisit: 'Daytime, weekday mornings',
        responsibleTravelNote: 'This is a residential lane — be respectful of resident privacy.',
      }),
    ],
    food: [
      food({
        name: 'Amritsari Kulcha',
        description: 'A stuffed leavened bread, often filled with spiced potato or paneer, served with chickpea curry.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Old city kulcha shops',
        priceHint: 'Low',
        culturalNote: 'A signature Amritsari street food closely tied to Punjabi culinary identity.',
      }),
      food({
        name: 'Langar Meal at the Golden Temple',
        description: 'A simple vegetarian community meal served free to all visitors regardless of background.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Golden Temple langar hall',
        priceHint: 'Free',
        culturalNote: 'Embodies the Sikh principle of equality and seva (selfless service) — accept respectfully and avoid wasting food.',
      }),
    ],
    etiquette: [
      'Cover your head with a scarf or cloth before entering the Golden Temple complex.',
      'Remove shoes and wash feet at the designated area before entering.',
      'Sit on the floor for the langar meal and avoid wasting food.',
      'Photography is restricted inside the inner sanctum.',
    ],
    safety: [
      'Marble walkways around the temple pool can be slippery — walk carefully, especially barefoot.',
      'Follow security screening procedures at the Wagah Border ceremony.',
    ],
    experiences: [
      experience({
        type: 'Community experience',
        name: 'Langar Seva (Volunteer Kitchen Service)',
        description: 'Join volunteers preparing or serving food in the Golden Temple’s community kitchen.',
        culturalContext: 'Langar is a core Sikh practice symbolizing equality and community service.',
        groupSuitability: ['Solo', 'Families', 'Students', 'Friends'],
        priceHint: 'Free',
      }),
    ],
    eventCategories: ['Temple/ghat cultural visit', 'Heritage walk'],
  },

  // ── HAMPI ──────────────────────────────────────────────────────────────
  {
    slug: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    coordinates: { lat: 15.3350, lon: 76.4600 },
    tagline: 'Ruins of the Vijayanagara Empire amid boulder landscapes',
    overview:
      'Hampi, a UNESCO World Heritage Site, was once the capital of the powerful Vijayanagara Empire. Its temple ruins and royal structures are scattered across a dramatic boulder-strewn landscape.',
    attractions: [
      place({
        name: 'Virupaksha Temple',
        category: 'Temple',
        description: 'An active temple dedicated to Lord Shiva, with a towering gopuram entrance gate.',
        whyVisit: 'One of the oldest continuously functioning temples in India, still central to local worship.',
        culturalSignificance: 'Dates back to the 7th century, expanded significantly during the Vijayanagara Empire.',
        estimatedTime: '1–1.5 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Uneven stone flooring throughout; limited wheelchair access.',
        safetyNote: 'Hot stone surfaces at midday — footwear removal required inside.',
        locationHint: 'Hampi Bazaar',
        latitude: 15.3350,
        longitude: 76.4600,
        tags: ['heritage', 'spirituality', 'architecture'],
      }),
      place({
        name: 'Vittala Temple Complex',
        category: 'Temple Complex',
        description: 'Famous for its ornate stone chariot and musical pillars that produce tonal sounds when tapped.',
        whyVisit: 'A masterpiece of Vijayanagara-era stone craftsmanship.',
        culturalSignificance: 'Built in the 15th century, considered the artistic peak of Vijayanagara temple architecture.',
        estimatedTime: '1.5–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Extensive open, uneven terrain; a shuttle covers part of the walk from the entrance.',
        safetyNote: 'Musical pillars are protected from touching/tapping to prevent damage — follow posted guidance.',
        locationHint: 'Vittala Village Road, Hampi',
        latitude: 15.3400,
        longitude: 76.4756,
        tags: ['heritage', 'architecture'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Sanapur Lake Viewpoint',
        category: 'Natural Landscape',
        description: 'A quiet reservoir surrounded by granite boulders, popular with few visitors beyond local coracle boatmen.',
        whyVisit: 'A peaceful, scenic contrast to Hampi’s busier temple ruins.',
        culturalSignificance: 'Reflects the everyday rural life that continues around Hampi’s historic core.',
        estimatedTime: '1–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Rocky, uneven terrain; not wheelchair accessible.',
        safetyNote: 'No lifeguards — exercise caution near water’s edge and during coracle rides.',
        locationHint: 'Near Anegundi, across the Tungabhadra River',
        tags: ['hidden gem', 'nature', 'photography'],
        whyHidden: 'Off the main ruins circuit, requiring a river crossing or longer drive.',
        culturalImportance: 'Showcases the rural Anegundi side of Hampi, believed linked to the ancient Kishkindha legend.',
        bestTimeToVisit: 'Late afternoon for sunset views',
        responsibleTravelNote: 'Use licensed coracle operators and avoid littering the lake area.',
      }),
    ],
    food: [
      food({
        name: 'Jolada Rotti Thali',
        description: 'A North Karnataka-style meal centered on sorghum flatbread with lentils and vegetables.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Local eateries in Hampi Bazaar',
        priceHint: 'Low',
        culturalNote: 'Reflects the agrarian food traditions of the surrounding Deccan plateau region.',
      }),
    ],
    etiquette: [
      'Dress modestly at Virupaksha and other active temples.',
      'Do not climb on protected ruins or carved structures.',
      'Respect signage protecting musical pillars from touching.',
    ],
    safety: [
      'Extreme heat is common — carry water and avoid midday sun exposure on open ruin sites.',
      'Terrain is rocky and uneven — wear sturdy, closed footwear.',
    ],
    experiences: [
      experience({
        type: 'Heritage walk',
        name: 'Royal Enclosure Ruins Walk',
        description: 'A guided walk through the royal center of the former Vijayanagara Empire.',
        culturalContext: 'Covers the political and ceremonial heart of a 14th–16th century empire.',
        groupSuitability: ['Solo', 'Couple', 'Friends', 'Students'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Heritage walk', 'Museum exhibition'],
  },

  // ── MYSURU ─────────────────────────────────────────────────────────────
  {
    slug: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    coordinates: { lat: 12.2958, lon: 76.6394 },
    tagline: 'Royal Wodeyar heritage, silk, and Dasara festivities',
    overview:
      'Mysuru (Mysore) was the seat of the Wodeyar dynasty and is renowned for its illuminated palace, silk-weaving tradition, and the grand annual Mysuru Dasara festival.',
    attractions: [
      place({
        name: 'Mysore Palace',
        category: 'Palace',
        description: 'An Indo-Saracenic palace with domes, arches, and stained glass, illuminated with thousands of lights on special occasions.',
        whyVisit: 'One of India’s most visited palaces, reflecting Wodeyar royal grandeur.',
        culturalSignificance: 'The current structure was completed in 1912 after a fire destroyed the earlier wooden palace.',
        estimatedTime: '1.5–2 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Mostly flat courtyards; some interior areas have steps.',
        safetyNote: 'Very crowded during Dasara festival season — plan for extra time.',
        locationHint: 'Central Mysuru',
        latitude: 12.3052,
        longitude: 76.6552,
        tags: ['heritage', 'architecture'],
      }),
      place({
        name: 'Chamundi Hill Temple',
        category: 'Temple',
        description: 'A hilltop temple dedicated to Goddess Chamundeshwari, overlooking the city.',
        whyVisit: 'Combines panoramic views with deep-rooted local devotional significance.',
        culturalSignificance: 'The presiding deity of the Wodeyar dynasty, with temple origins dating back centuries.',
        estimatedTime: '1–1.5 hours',
        budgetLevel: 'Low',
        accessibilityNote: 'Vehicle road to the top is available; the traditional 1,000-step climb is strenuous.',
        safetyNote: 'Crowded during festivals; watch footing on temple steps.',
        locationHint: 'Chamundi Hills, southeast Mysuru',
        latitude: 12.2724,
        longitude: 76.6730,
        tags: ['spirituality', 'heritage'],
      }),
    ],
    hiddenGems: [
      gem({
        name: 'Devaraja Market',
        category: 'Traditional Market',
        description: 'A century-old covered market bursting with flower garlands, spices, and dye powders.',
        whyVisit: 'A vivid, aromatic slice of everyday Mysuru life away from palace tourism.',
        culturalSignificance: 'Established during the Wodeyar era, still a functioning commercial hub for the local community.',
        estimatedTime: '45–60 minutes',
        budgetLevel: 'Free',
        accessibilityNote: 'Crowded and narrow aisles; not easily wheelchair accessible.',
        safetyNote: 'Watch belongings and footing on wet floors near flower and produce stalls.',
        locationHint: 'Sayyaji Rao Road, central Mysuru',
        tags: ['hidden gem', 'markets', 'local life'],
        whyHidden: 'Overshadowed by Mysore Palace despite being a richer slice of daily local life.',
        culturalImportance: 'A living Wodeyar-era commercial institution still central to local commerce.',
        bestTimeToVisit: 'Early morning when flower vendors restock',
        responsibleTravelNote: 'Buy directly from small vendors and avoid disrupting narrow working aisles.',
      }),
    ],
    food: [
      food({
        name: 'Mysore Masala Dosa',
        description: 'A crisp dosa spread with a spicy red chutney layer before the potato filling.',
        isVegetarian: true,
        spiceLevel: 'Medium',
        whereToFind: 'Local restaurants across Mysuru',
        priceHint: 'Low',
        culturalNote: 'A distinct regional variation of the classic South Indian dosa.',
      }),
      food({
        name: 'Mysore Pak',
        description: 'A dense, ghee-rich gram-flour sweet.',
        isVegetarian: true,
        spiceLevel: 'Mild',
        whereToFind: 'Sweet shops citywide, especially near the palace',
        priceHint: 'Low',
        culturalNote: 'Originated in the kitchens of the Mysore Palace during the Wodeyar era.',
      }),
    ],
    etiquette: [
      'Dress modestly at Chamundi Hill Temple and other religious sites.',
      'Photography inside the Mysore Palace interior may be restricted — check posted rules.',
      'Bargain respectfully at Devaraja Market.',
    ],
    safety: [
      'Dasara festival season brings very large crowds — keep close to your group.',
      'Carry water when climbing Chamundi Hill’s stepped pathway.',
    ],
    experiences: [
      experience({
        type: 'Market walk',
        name: 'Devaraja Market & Silk Weaving Walk',
        description: 'A walking tour through the flower and spice market followed by a visit to a silk-weaving unit.',
        culturalContext: 'Mysuru silk is a Geographical Indication (GI)-tagged craft tradition tied to the Wodeyar era.',
        groupSuitability: ['Solo', 'Couple', 'Families', 'Friends'],
        priceHint: 'Low',
      }),
    ],
    eventCategories: ['Craft workshop', 'Heritage walk', 'Local market festival'],
  },
];

export function getCityBySlug(slug: string): CitySeed | undefined {
  return INDIA_DESTINATIONS.find((c) => c.slug === slug.toLowerCase().trim());
}

// Fuzzy match for free-text city input (e.g. "jaipur india", "Jaipur, Rajasthan").
export function findClosestCity(input: string): CitySeed | undefined {
  const normalized = input.toLowerCase().trim();
  const exact = INDIA_DESTINATIONS.find((c) => c.name.toLowerCase() === normalized);
  if (exact) return exact;
  return INDIA_DESTINATIONS.find(
    (c) => normalized.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(normalized)
  );
}

export const CITY_NAMES = INDIA_DESTINATIONS.map((c) => c.name);
