import { Scenario, RegionalLanguage, SavedPhrase, WeakAreaItem } from '../types';

export interface RegionalPreset {
  city: 'Chennai' | 'Jaipur' | 'Kolkata';
  state: string;
  language: RegionalLanguage;
  localeTag: string;
  glyph: string;
  badge: string;
  atmosphere: string;
  localGreeting: string;
  greetingScript: string;
  greetingMeaning: string;
  starterPackTitle: string;
  description: string;
  popularColleges: string[];
  accentColor: string;
  mapX: number; // percentage on India SVG
  mapY: number; // percentage on India SVG
  mitraAdvice: string;
  scenarioCount: number;
  heroImage: string;
  landmarkImage: string;
}

export const REGIONAL_PRESETS: Record<'Chennai' | 'Jaipur' | 'Kolkata', RegionalPreset> = {
  Chennai: {
    city: 'Chennai',
    state: 'TAMIL NADU',
    language: 'Tamil',
    localeTag: 'ta-IN',
    glyph: 'க',
    badge: 'TAMIL NADU',
    atmosphere: 'Temple streets, campus cafés, and conversations in Tamil.',
    localGreeting: 'Vanakkam',
    greetingScript: 'வணக்கம்',
    greetingMeaning: 'Hello / Respectful greetings',
    starterPackTitle: 'First Day in Chennai Survival Pack',
    description: 'Survive and thrive in Chennai messes, autos, and college campus.',
    popularColleges: ['IIT Madras', 'Anna University', 'Loyola College', 'SRM Kattankulathur', 'Vellore / VIT'],
    accentColor: '#A33B27',
    mapX: 52,
    mapY: 82,
    mitraAdvice: 'Vanakkam! In Chennai, adding "-nga" to any verb instantly makes you sound respectful to auto drivers and canteen workers!',
    scenarioCount: 7,
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    landmarkImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
  },
  Jaipur: {
    city: 'Jaipur',
    state: 'RAJASTHAN',
    language: 'Hindi',
    localeTag: 'hi-IN',
    glyph: 'ख',
    badge: 'RAJASTHAN',
    atmosphere: 'Pink city bazaars, hostel chai tapris, and warm Marwari greetings.',
    localGreeting: 'Khamma Ghani',
    greetingScript: 'खम्मा घणी',
    greetingMeaning: 'Warm royal greetings / May you prosper',
    starterPackTitle: 'First Day in Jaipur Survival Pack',
    description: 'Master pink city autos, hostel tapris, and bazaar bargaining.',
    popularColleges: ['MNIT Jaipur', 'Manipal University Jaipur', 'BITS Pilani', 'Rajasthan University'],
    accentColor: '#B85D36',
    mapX: 34,
    mapY: 34,
    mitraAdvice: 'Khamma Ghani! In Jaipur, addressing auto drivers as "Bhaisaab" and asking "Kachori taazi hai kya?" builds instant friendly bonding!',
    scenarioCount: 7,
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    landmarkImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  },
  Kolkata: {
    city: 'Kolkata',
    state: 'WEST BENGAL',
    language: 'Bengali',
    localeTag: 'bn-IN',
    glyph: 'ক',
    badge: 'WEST BENGAL',
    atmosphere: 'College street addas, yellow taxis, and sweet tea conversations.',
    localGreeting: 'Nomoshkar',
    greetingScript: 'নমস্কার',
    greetingMeaning: 'Respectful greetings / Welcome',
    starterPackTitle: 'First Day in Kolkata Survival Pack',
    description: 'Explore tea stalls, yellow taxis, and historic college addas.',
    popularColleges: ['Jadavpur University', 'Presidency College', 'IIT Kharagpur', 'St. Xavier\'s Kolkata'],
    accentColor: '#8B3A2B',
    mapX: 74,
    mapY: 48,
    mitraAdvice: 'Nomoshkar! At the canteen, say "Ek cup cha din dada" (Give one cup tea, brother). Calling seniors "Dada" or "Didi" earns instant respect!',
    scenarioCount: 7,
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    landmarkImage: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=600&q=80',
  },
};

export interface ArrivalStage {
  id: 'day1' | 'week1' | 'month1' | 'explorer';
  stageNumber: string;
  title: string;
  tagline: string;
  focusScenarioId: string;
  image: string;
  keyPhrase: {
    script: string;
    romanized: string;
    meaning: string;
  };
  companionNote: string;
}

export const ARRIVAL_STAGES: Record<string, ArrivalStage[]> = {
  Chennai: [
    {
      id: 'day1',
      stageNumber: '01',
      title: 'Station Auto',
      tagline: 'Hailing your first auto from Chennai Central.',
      focusScenarioId: 'transport',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'மீட்டர் போட்டு போங்க அண்ணா',
        romanized: 'Meter pottu ponga anna',
        meaning: 'Please turn on the meter and go, brother',
      },
      companionNote: 'Always confirm the gate name before stepping inside the auto.',
    },
    {
      id: 'week1',
      stageNumber: '02',
      title: 'Tiffin Canteen',
      tagline: 'Ordering morning tiffins & filter kaapi.',
      focusScenarioId: 'food',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'ஒரு மசாலா தோசை, ஃபில்டர் காபி கொடுங்க அண்ணா',
        romanized: 'Oru masala dosai, filter coffee kudu-nga anna',
        meaning: 'Give one masala dosa and filter coffee brother',
      },
      companionNote: 'Say "onnu" for 1 plate, "rendu" for 2 plates.',
    },
    {
      id: 'month1',
      stageNumber: '03',
      title: 'Campus & Library',
      tagline: 'Finding research labs & talking to batchmates.',
      focusScenarioId: 'college',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'லைப்ரரி எங்க இருக்கு?',
        romanized: 'Library enga irukku?',
        meaning: 'Where is the library located?',
      },
      companionNote: 'Use "enga irukku" to ask where any hall or building is.',
    },
    {
      id: 'explorer',
      stageNumber: '04',
      title: 'Local Markets',
      tagline: 'Scanning handwritten Tamil food boards.',
      focusScenarioId: 'shopping',
      image: 'https://images.unsplash.com/photo-1584697964190-7bb8c5a03429?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'இது எவ்ளோ அண்ணா?',
        romanized: 'Idhu evvalo anna?',
        meaning: 'How much did it come to, brother?',
      },
      companionNote: 'Take a photo with the Scanner to get an instant breakdown of any dish.',
    },
  ],
  Jaipur: [
    {
      id: 'day1',
      stageNumber: '01',
      title: 'Station Auto',
      tagline: 'Taking an auto from Jaipur Junction.',
      focusScenarioId: 'transport',
      image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'भाईसाहब, कॉलेज गेट तक कितना लोगे?',
        romanized: 'Bhaisaab, college gate tak kitna loge?',
        meaning: 'Brother, how much will you charge till college gate?',
      },
      companionNote: 'Address the driver warmly as "Bhaisaab" instead of just "Bhaiya".',
    },
    {
      id: 'week1',
      stageNumber: '02',
      title: 'Tapri Chai',
      tagline: 'Ordering hot kachoris & special chai.',
      focusScenarioId: 'food',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'एक प्याज कचौरी और स्पेशल कड़क चाय देना भाई',
        romanized: 'Ek pyaz kachori aur special kadak chai dena bhai',
        meaning: 'Give one onion kachori and strong tea brother',
      },
      companionNote: 'Ask "Teekha kam rakhna" if you prefer mild food.',
    },
    {
      id: 'month1',
      stageNumber: '03',
      title: 'Campus & Hostel',
      tagline: 'Talking with hostel roommates & seniors.',
      focusScenarioId: 'college',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'भाई, लाइब्रेरी किस तरफ है?',
        romanized: 'Bhai, library kis taraf hai?',
        meaning: 'Brother, which direction is the library?',
      },
      companionNote: 'MNIT and Rajasthan Univ campuses are huge—ask seniors for block shortcuts.',
    },
    {
      id: 'explorer',
      stageNumber: '04',
      title: 'Bapu Bazaar',
      tagline: 'Bargaining for room essentials & stationery.',
      focusScenarioId: 'shopping',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'भैया, थोड़ा डिस्काउंट मिलेगा क्या?',
        romanized: 'Bhaiya, thoda discount milega kya?',
        meaning: 'Brother, could you give a little student discount?',
      },
      companionNote: 'Show your college ID card for student discount at bookstores.',
    },
  ],
  Kolkata: [
    {
      id: 'day1',
      stageNumber: '01',
      title: 'Yellow Taxi',
      tagline: 'Navigating Howrah prepaid taxi queue.',
      focusScenarioId: 'transport',
      image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'দাদা, কলেজ স্ট্রিট যাবেন?',
        romanized: 'Dada, college street jaaben?',
        meaning: 'Brother, will you go to College Street?',
      },
      companionNote: 'Always take the prepaid queue ticket at Howrah Station.',
    },
    {
      id: 'week1',
      stageNumber: '02',
      title: 'College Adda',
      tagline: 'Ordering evening rolls & sweet bhaar chai.',
      focusScenarioId: 'food',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'একটা স্পেশাল এগ রোল আর এক কাপ চা দিন দাদা',
        romanized: 'Ekta special egg roll aar ek cup cha din dada',
        meaning: 'Please give one special egg roll and one cup of tea brother',
      },
      companionNote: 'Clay tea cups are called "Bhaar". Say "Misti kam" for less sugar.',
    },
    {
      id: 'month1',
      stageNumber: '03',
      title: 'Jadavpur Campus',
      tagline: 'Asking for department lecture notes.',
      focusScenarioId: 'college',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'লাইব্রেরিটা কোন দিকে দাদা?',
        romanized: 'Library-ta kon dike dada?',
        meaning: 'Brother, which side is the library located?',
      },
      companionNote: 'Calling seniors "Dada" or "Didi" immediately breaks the ice.',
    },
    {
      id: 'explorer',
      stageNumber: '04',
      title: 'Book Stalls',
      tagline: 'Finding second-hand engineering books.',
      focusScenarioId: 'shopping',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80',
      keyPhrase: {
        script: 'দাদা, এটা কত দাম?',
        romanized: 'Dada, eta koto daam?',
        meaning: 'Brother, how much does this cost?',
      },
      companionNote: 'Use the Camera Scanner on Bengali book shop rate boards.',
    },
  ],
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'food',
    title: 'Ordering Food at Canteen / Mess',
    personaName: 'Murugan Anna',
    personaRole: 'Canteen & Tiffin Counter Incharge',
    iconName: 'Utensils',
    badge: 'Daily Survival',
    description: 'Order hot dosas, ask for less spice, get extra sambar, and pay at the coupon counter.',
    starterPrompt: 'You just stepped up to the counter at the college canteen during lunch break.',
    locationContext: 'College Canteen / Sangeetha Tiffin Stall',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'வாங்க தம்பி! என்ன வேணும்? மசாலா தோசை, இட்லி, பூரி எல்லாம் சுட சுட இருக்கு!',
      romanized: 'Vaanga thambi! Enna venum? Masala dosai, idli, poori ellam suda suda irukku!',
      meaning: 'Welcome brother! What do you want? Masala dosa, idli, poori are all piping hot!',
      contextTip: 'Calling local service staff "Anna" (elder brother) or "Akka" (elder sister) is polite and will get you prompt service with extra chutney.',
    },
  },
  {
    id: 'transport',
    title: 'Auto Rickshaw & Taxi',
    personaName: 'Selvam Anna',
    personaRole: 'Auto Driver at Gate',
    iconName: 'Car',
    badge: 'Essential Travel',
    description: 'Negotiate fare, ask to use meter, specify campus gate landmarks, and confirm route.',
    starterPrompt: 'You need an auto from the railway station to your college hostel campus.',
    locationContext: 'Chennai Central / College Main Gate',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'எங்க போவணும் தம்பி? மீட்டர் மேல பத்து ரூபா குடுங்க, ஏறுங்க!',
      romanized: 'Enga povanum thambi? Meter mela pathu rooba kudunga, erunga!',
      meaning: 'Where do you need to go brother? Give ten rupees over the meter, hop in!',
      contextTip: 'Always say "Meter podunga anna" (Put the meter on, brother) politely before getting in.',
    },
  },
  {
    id: 'college',
    title: 'College Campus & Classmates',
    personaName: 'Karthik',
    personaRole: 'Second-Year Class Senior',
    iconName: 'GraduationCap',
    badge: 'Academics',
    description: 'Ask for directions to the library, request assignment notes, and find faculty offices.',
    starterPrompt: 'You are on campus on your first week trying to find the Physics Lab.',
    locationContext: 'Main Academic Block / Quadrangle',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'ஹாய் மச்சான்! நீங்க ஃபர்ஸ்ட் இயரா? எந்த டிபார்ட்மென்ட்? ஏதாச்சும் ஹெல்ப் வேணுமா?',
      romanized: 'Hi machan! Neenga first year-aa? Endha department? Edhaachum help venuma?',
      meaning: 'Hi bro! Are you first year? Which department? Do you need any help?',
      contextTip: '"Machan" is a friendly college slang term for buddy/friend in Tamil Nadu.',
    },
  },
  {
    id: 'landlord',
    title: 'Hostel Warden & Landlord',
    personaName: 'Ramanathan Sir',
    personaRole: 'Hostel Warden / PG Owner',
    iconName: 'Building',
    badge: 'Living & PG',
    description: 'Inquire about curfew gate timings, report water/WiFi issues, and ask about laundry.',
    starterPrompt: 'You need to ask the warden about the night curfew and room key replacement.',
    locationContext: 'Hostel Office / PG Reception',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'சொல்லுங்க தம்பி, நைட்டு ஒன்பது மணிக்கு கேட் பூட்டிடுவோம். என்ன விஷயம்?',
      romanized: 'Sollunga thambi, night onbadhu manikku gate pootiduvom. Enna vishayam?',
      meaning: 'Tell me brother, we lock the gate at 9:00 PM at night. What is the matter?',
      contextTip: 'Always use "-nga" (respectful plural) when talking to elder authorities like wardens and landlords.',
    },
  },
  {
    id: 'shopping',
    title: 'Kirana & Local Market',
    personaName: 'Ganesan',
    personaRole: 'Stationery & Provision Store Owner',
    iconName: 'ShoppingBag',
    badge: 'Everyday Needs',
    description: 'Buy notebook refills, toiletries, bottled water, snacks, and ask for UPI QR code.',
    starterPrompt: 'You are buying hostel room essentials like a bucket, mug, and notebooks.',
    locationContext: 'Market Street / Stationery Shop',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'நோட்புக், பென், பக்கெட் எல்லாம் இருக்கு தம்பி. ஜிபே (GPay) இருக்கு, ஸ்கேன் பண்ணிக்கோங்க.',
      romanized: 'Notebook, pen, bucket ellam irukku thambi. GPay irukku, scan pannikonga.',
      meaning: 'Notebooks, pens, buckets are all here brother. GPay is available, you can scan.',
      contextTip: 'Ask "Google Pay irukka?" or "QR code kaatunga" to pay digitally anywhere in India.',
    },
  },
  {
    id: 'introductions',
    title: 'Making Local Friends',
    personaName: 'Deepa',
    personaRole: 'Hostel Roommate / Lab Partner',
    iconName: 'Users',
    badge: 'Social Life',
    description: 'Introduce where you are from, ask what sports they play, and bond over tea.',
    starterPrompt: 'Sitting next to a batchmate in the student union activity lounge.',
    locationContext: 'Campus Lawn / Student Mess',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'வணக்கம்! உங்க பேர் என்ன? நீங்க நார்த் இந்தியால எங்கிருந்து வர்றீங்க?',
      romanized: 'Vanakkam! Unga per enna? Neenga North India-la engirundhu varreenga?',
      meaning: 'Hello! What is your name? Where in North India are you from?',
      contextTip: 'Learning even 3 sentences in the local language shows respect and instantly wins you local friends.',
    },
  },
  {
    id: 'emergency',
    title: 'Medical & Emergency Help',
    personaName: 'Dr. Senthil',
    personaRole: 'Campus Clinic Pharmacist',
    iconName: 'AlertTriangle',
    badge: 'Urgent',
    description: 'Describe fever, stomach upset, allergy, ask for nearest hospital or college ambulance.',
    starterPrompt: 'You have a severe cold and fever and need medication at the medical store.',
    locationContext: 'Campus Health Centre / Pharmacy',
    difficulty: 'Beginner',
    initialPersonaMessage: {
      script: 'என்ன உடம்புக்கு தம்பி? காய்ச்சலா, தலைவலியா? பயப்படாதீங்க, மருந்து தர்றேன்.',
      romanized: 'Enna udambukku thambi? Kaaichala, thalaivaliya? Bayapadaadheenga, marundhu tharren.',
      meaning: 'What is the health issue brother? Fever or headache? Do not worry, I will give medicine.',
      contextTip: '"Kaaichal" = Fever, "Vayitru vali" = Stomach pain, "Marundhu" = Medicine.',
    },
  },
];

export const INITIAL_SAVED_PHRASES: SavedPhrase[] = [
  {
    id: 'phrase-1',
    sourceText: 'Please give one masala dosa and filter coffee',
    targetScript: 'ஒரு மசாலா தோசை, ஒரு ஃபில்டர் காபி கொடுங்க அண்ணா',
    romanized: 'Oru masala dosai, oru filter coffee kudu-nga anna',
    meaning: 'Give one masala dosa and one filter coffee brother',
    category: 'food',
    difficulty: 'Beginner',
    pronunciationGuide: 'Oh-roo mah-sah-lah doh-say, oh-roo fil-ter coffee koo-doo-nga un-nah',
    savedAt: Date.now() - 3600000 * 2,
    timesPracticed: 3,
    lastScore: 92,
  },
  {
    id: 'phrase-2',
    sourceText: 'How much is it?',
    targetScript: 'எவ்ளோ ஆச்சு அண்ணா?',
    romanized: 'Evvalo aachu anna?',
    meaning: 'How much did it come to, brother?',
    category: 'shopping',
    difficulty: 'Beginner',
    pronunciationGuide: 'Ev-vah-loh ah-choo un-nah?',
    savedAt: Date.now() - 3600000 * 4,
    timesPracticed: 2,
    lastScore: 78,
  },
  {
    id: 'phrase-3',
    sourceText: 'Please put the meter on',
    targetScript: 'மீட்டர் போட்டு போங்க அண்ணா',
    romanized: 'Meter pottu ponga anna',
    meaning: 'Please turn on the meter and go, brother',
    category: 'transport',
    difficulty: 'Beginner',
    pronunciationGuide: 'Mee-ter poht-too pohng-gah un-nah',
    savedAt: Date.now() - 3600000 * 6,
    timesPracticed: 4,
    lastScore: 88,
  },
  {
    id: 'phrase-4',
    sourceText: 'Where is the library located?',
    targetScript: 'லைப்ரரி எங்க இருக்கு?',
    romanized: 'Library enga irukku?',
    meaning: 'Where is the library located?',
    category: 'college',
    difficulty: 'Beginner',
    pronunciationGuide: 'Lie-bray-ree eng-gah eer-ook-koo?',
    savedAt: Date.now() - 3600000 * 10,
    timesPracticed: 1,
    lastScore: 65,
  },
  {
    id: 'phrase-5',
    sourceText: 'Make it a little less spicy please',
    targetScript: 'கொஞ்சம் காரம் கம்மியா போடுங்க',
    romanized: 'Konjam kaaram kammiya podunga',
    meaning: 'Please put a little less chili/spice',
    category: 'food',
    difficulty: 'Beginner',
    pronunciationGuide: 'Kohn-jum kah-rum kahm-mee-yah poh-doo-ngah',
    savedAt: Date.now() - 3600000 * 12,
    timesPracticed: 2,
    lastScore: 75,
  },
];

export const INITIAL_WEAK_AREAS: WeakAreaItem[] = [
  {
    id: 'weak-1',
    phrase: 'லைப்ரரி எங்க இருக்கு?',
    romanized: 'Library enga irukku?',
    meaning: 'Where is the library?',
    category: 'college',
    errorCount: 3,
    lastPracticed: Date.now() - 3600000 * 10,
    tip: 'Shorten the "eng-gah" sound so it sounds natural like local students ask.',
  },
  {
    id: 'weak-2',
    phrase: 'மீட்டர் போட்டு போங்க அண்ணா',
    romanized: 'Meter pottu ponga anna',
    meaning: 'Please turn on the meter and go brother',
    category: 'transport',
    errorCount: 2,
    lastPracticed: Date.now() - 3600000 * 6,
    tip: 'Make sure to say the respectful ending "-nga" clearly to sound polite to the driver.',
  },
  {
    id: 'weak-3',
    phrase: 'எவ்ளோ ஆச்சு அண்ணா?',
    romanized: 'Evvalo aachu anna?',
    meaning: 'How much did it come to, brother?',
    category: 'shopping',
    errorCount: 2,
    lastPracticed: Date.now() - 3600000 * 4,
    tip: 'Pronounce the double "ll" in Evvalo by holding the tip of your tongue briefly against the upper palate.',
  },
];

export interface SampleScanPreset {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  thumbnailBadge: string;
  title: string;
  detectedScript: string;
  summary: string;
  englishTranslation: string;
  items: Array<{
    localText: string;
    romanized: string;
    englishName: string;
    description: string;
    priceOrDetail?: string;
  }>;
  practicalPhrases: Array<{
    localText: string;
    romanized: string;
    meaning: string;
    usageTip?: string;
  }>;
  studentTip: string;
}

export const SAMPLE_SCAN_PRESETS: SampleScanPreset[] = [
  {
    id: 'canteen-menu',
    name: 'Chennai Tiffin & Canteen Board',
    category: 'Food & Mess',
    thumbnailBadge: 'Hostel Mess',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    title: 'Daily Canteen Breakfast Rate Card',
    detectedScript: 'Tamil',
    summary: 'Hand-painted menu board outside the hostel canteen showing breakfast tiffin items, combo plates, and tea/coffee prices.',
    englishTranslation: 'Ghee Podi Roast, Idli Vada Combo, Poori Masala, Curd Rice, Filter Kaapi.',
    items: [
      {
        localText: 'நெய் பொடி ரோஸ்ட்',
        romanized: 'Ney Podi Roast',
        englishName: 'Ghee Gunpowder Dosa',
        description: 'Crisp dosa sprinkled with spicy roasted lentil-chili gunpowder (podi) and hot melted ghee.',
        priceOrDetail: '₹75',
      },
      {
        localText: 'இட்லி சாம்பார் (2)',
        romanized: 'Idli Sambar (Rendu)',
        englishName: 'Steamed Rice Cakes in Sambar',
        description: 'Two fluffy steamed fermented rice cakes submerged in tangy vegetable sambar.',
        priceOrDetail: '₹40',
      },
      {
        localText: 'மெது வடை (ஒன்னு)',
        romanized: 'Medu Vadai (Onnu)',
        englishName: 'Crispy Black Lentil Fritter',
        description: 'Golden-brown savory lentil doughnut with whole black pepper and curry leaves.',
        priceOrDetail: '₹20',
      },
      {
        localText: 'பில்டர் காபி',
        romanized: 'Filter Kaapi',
        englishName: 'Hot Madras Filter Coffee',
        description: 'Strong, aromatic chicory-coffee decoction whipped with whole milk.',
        priceOrDetail: '₹20',
      },
    ],
    practicalPhrases: [
      {
        localText: 'நெய் பொடி ரோஸ்ட் ஒன்னு, காபி ஒன்னு குடுங்க அண்ணா',
        romanized: 'Ney podi roast onnu, coffee onnu kudu-nga anna',
        meaning: 'Please give one ghee podi roast and one coffee brother',
        usageTip: 'Use "onnu" for one and "rendu" for two.',
      },
      {
        localText: 'டோக்கன் எங்க வாங்கணும் அண்ணா?',
        romanized: 'Token enga vaanganum anna?',
        meaning: 'Where should I buy the token brother?',
        usageTip: 'Most college messes require paying at the token counter first.',
      },
      {
        localText: 'சட்னி கொஞ்சம் எக்ஸ்ட்ரா வைங்க',
        romanized: 'Chutney konjam extra vainga',
        meaning: 'Please put a little extra chutney',
        usageTip: 'Vendors happily add extra coconut or tomato chutney if asked politely.',
      },
    ],
    studentTip: 'In Tamil Nadu messes, banana leaf eating is common. Fold the top of the leaf towards you when finished to show you enjoyed the meal!',
  },
  {
    id: 'auto-stand',
    name: 'Chennai Central Prepaid Auto Board',
    category: 'Transport',
    thumbnailBadge: 'Railway Auto Stand',
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
    title: 'Prepaid Auto Fare & Landmark Chart',
    detectedScript: 'Tamil & English',
    summary: 'Official traffic police fare board displaying prepaid counter tariffs to major college campuses like IIT Madras, Anna University, and Guindy.',
    englishTranslation: 'IIT Madras In-Gate ₹220, Anna University Guindy ₹190, SRM Kattankulathur ₹850.',
    items: [
      {
        localText: 'ஐஐடி மெயின் கேட்',
        romanized: 'IIT Main Gate',
        englishName: 'IIT Madras Sardar Patel Road',
        description: 'Prepaid fixed rate voucher destination.',
        priceOrDetail: '₹220',
      },
      {
        localText: 'அண்ணா யுனிவர்சிட்டி',
        romanized: 'Anna University',
        englishName: 'Anna University Guindy Campus',
        description: 'Major engineering hub in Chennai.',
        priceOrDetail: '₹190',
      },
    ],
    practicalPhrases: [
      {
        localText: 'ஐஐடி மெயின் கேட் போகுமா அண்ணா?',
        romanized: 'IIT main gate poguma anna?',
        meaning: 'Will it go to IIT Main Gate brother?',
        usageTip: 'Confirm before boarding whether they know the inside gate or outside gate.',
      },
      {
        localText: 'மீட்டர் போட்டு வாங்க அண்ணா',
        romanized: 'Meter pottu vaanga anna',
        meaning: 'Come with meter on, brother',
        usageTip: 'Standard request to avoid inflated night fares.',
      },
    ],
    studentTip: 'Always take the printed slip from the official police booth at the railway station rather than bargaining with private touts.',
  },
  {
    id: 'hostel-notice',
    name: 'Hostel Gate Timing & Curfew Notice',
    category: 'Hostel & PG',
    thumbnailBadge: 'Notice Board',
    imageUrl: 'https://images.unsplash.com/photo-1584697964190-7bb8c5a03429?auto=format&fit=crop&w=600&q=80',
    title: 'Hostel Entry Rules & Late Pass Notice',
    detectedScript: 'Tamil',
    summary: 'Important warden notice stating entry cutoff at 9:30 PM and required library late pass signatures.',
    englishTranslation: 'Notice: Hostel main gate closes strictly at 9:30 PM. Library late-permission slips must be pre-approved by Department HOD.',
    items: [
      {
        localText: 'மெயின் கேட் மூடும் நேரம்: இரவு 9:30',
        romanized: 'Main gate moodum neram: Iravu 9:30',
        englishName: 'Gate Closing Time: 9:30 PM',
        description: 'Strict cutoff time after which warden entry approval is required.',
        priceOrDetail: 'Rule #1',
      },
      {
        localText: 'லைப்ரரி லேட் பாஸ்',
        romanized: 'Library late pass',
        englishName: 'Library Late Stay Pass',
        description: 'Permit slip needed for studying past 10 PM in the digital research lab.',
        priceOrDetail: 'Rule #2',
      },
    ],
    practicalPhrases: [
      {
        localText: 'சார், நான் லைப்ரரில படிச்சிட்டு இருந்தேன், லேட் ஆயிடுச்சு',
        romanized: 'Sir, naan library-la padichittu irundhen, late aayiduchu',
        meaning: 'Sir, I was studying in the library, I got delayed',
        usageTip: 'Respectful explanation to the security warden.',
      },
      {
        localText: 'லேட் பாஸ் எங்கிட்ட இருக்கு சார்',
        romanized: 'Late pass engitta irukku sir',
        meaning: 'I have the late pass with me, sir',
        usageTip: 'Show your approved student ID card and slip together.',
      },
    ],
    studentTip: 'Keep your digital college ID bookmarked on your phone alongside the physical card for swift hostel gate scanning.',
  },
];
