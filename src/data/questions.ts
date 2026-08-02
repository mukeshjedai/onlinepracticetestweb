export type Question = {
  id: number;
  question: string;
  options: [string, string, string, string];
  answer: 1 | 2 | 3 | 4;
  category: CategoryId;
};

export type CategoryId =
  | "people"
  | "democracy"
  | "government"
  | "values";

export const categories: {
  id: CategoryId;
  title: string;
  short: string;
  description: string;
}[] = [
  {
    id: "people",
    title: "Australia and its people",
    short: "People",
    description: "History, First Nations, symbols, and the story of modern Australia.",
  },
  {
    id: "democracy",
    title: "Democratic beliefs, rights and liberties",
    short: "Democracy",
    description: "Freedom, equality, the rule of law, and democratic values.",
  },
  {
    id: "government",
    title: "Government and the law in Australia",
    short: "Government",
    description: "Parliament, elections, courts, and how laws are made.",
  },
  {
    id: "values",
    title: "Australian values",
    short: "Values",
    description: "Respect, fairness, mateship, and shared responsibilities.",
  },
];

export const questions: Question[] = [
  {
    id: 1,
    category: "people",
    question: "Who are the first inhabitants of Australia?",
    options: [
      "British settlers",
      "Aboriginal and Torres Strait Islander peoples",
      "European explorers",
      "Pacific Islanders",
    ],
    answer: 2,
  },
  {
    id: 2,
    category: "people",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: 3,
  },
  {
    id: 3,
    category: "people",
    question: "Which day is Australia Day celebrated?",
    options: ["25 April", "26 January", "1 January", "11 November"],
    answer: 2,
  },
  {
    id: 4,
    category: "people",
    question: "What is Australia's national floral emblem?",
    options: ["Waratah", "Golden wattle", "Eucalyptus blossom", "Sturt's desert pea"],
    answer: 2,
  },
  {
    id: 5,
    category: "people",
    question: "Anzac Day commemorates Australians who served in which conflict first?",
    options: [
      "World War II",
      "The Vietnam War",
      "World War I (Gallipoli)",
      "The Korean War",
    ],
    answer: 3,
  },
  {
    id: 6,
    category: "people",
    question: "Which ocean borders Australia's east coast?",
    options: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Southern Ocean"],
    answer: 2,
  },
  {
    id: 7,
    category: "people",
    question: "Federation of the Australian colonies occurred in which year?",
    options: ["1788", "1901", "1915", "1945"],
    answer: 2,
  },
  {
    id: 8,
    category: "people",
    question: "What colours appear on the Australian national flag?",
    options: [
      "Blue, white and red",
      "Green and gold only",
      "Black, yellow and red",
      "Blue and gold only",
    ],
    answer: 1,
  },
  {
    id: 9,
    category: "democracy",
    question: "In Australia, voting in federal elections is:",
    options: ["Optional for adults", "Compulsory for eligible citizens", "Only for landowners", "Only for men"],
    answer: 2,
  },
  {
    id: 10,
    category: "democracy",
    question: "Freedom of speech means Australians can:",
    options: [
      "Say anything without consequences",
      "Express opinions within the law",
      "Only criticise the government",
      "Never discuss politics",
    ],
    answer: 2,
  },
  {
    id: 11,
    category: "democracy",
    question: "Equality under Australian democracy means:",
    options: [
      "Everyone earns the same income",
      "Everyone has the same opportunities under the law",
      "Only citizens can work",
      "Religion decides rights",
    ],
    answer: 2,
  },
  {
    id: 12,
    category: "democracy",
    question: "The rule of law means:",
    options: [
      "Politicians are above the law",
      "Laws apply equally to everyone",
      "Courts can ignore laws",
      "Only police follow laws",
    ],
    answer: 2,
  },
  {
    id: 13,
    category: "democracy",
    question: "Peaceful protest in Australia is:",
    options: [
      "Illegal",
      "A democratic right within the law",
      "Only allowed on Australia Day",
      "Only for political parties",
    ],
    answer: 2,
  },
  {
    id: 14,
    category: "democracy",
    question: "Religious freedom in Australia means people can:",
    options: [
      "Force others to share their beliefs",
      "Practise their religion within the law",
      "Ignore Australian laws for faith reasons",
      "Ban other religions",
    ],
    answer: 2,
  },
  {
    id: 15,
    category: "government",
    question: "Australia's system of government is a:",
    options: [
      "Presidential republic",
      "Constitutional monarchy and parliamentary democracy",
      "Military dictatorship",
      "One-party state",
    ],
    answer: 2,
  },
  {
    id: 16,
    category: "government",
    question: "Who is Australia's Head of State?",
    options: [
      "The Prime Minister",
      "The Governor-General",
      "The King of Australia",
      "The Chief Justice",
    ],
    answer: 3,
  },
  {
    id: 17,
    category: "government",
    question: "The Australian Parliament has how many houses?",
    options: ["One", "Two", "Three", "Four"],
    answer: 2,
  },
  {
    id: 18,
    category: "government",
    question: "Members of the House of Representatives are elected for:",
    options: ["2 years", "3 years", "4 years", "6 years"],
    answer: 2,
  },
  {
    id: 19,
    category: "government",
    question: "Senators are generally elected for:",
    options: ["2 years", "3 years", "6 years", "Life"],
    answer: 3,
  },
  {
    id: 20,
    category: "government",
    question: "Which court is the highest in Australia?",
    options: [
      "Federal Court",
      "High Court of Australia",
      "Supreme Court of NSW",
      "Family Court",
    ],
    answer: 2,
  },
  {
    id: 21,
    category: "government",
    question: "State governments are responsible for areas such as:",
    options: [
      "Defence and immigration",
      "Schools, hospitals and police",
      "Currency and customs",
      "Foreign affairs only",
    ],
    answer: 2,
  },
  {
    id: 22,
    category: "government",
    question: "Local councils typically look after:",
    options: [
      "National defence",
      "Rubbish collection, parks and local roads",
      "Passports",
      "Income tax rates",
    ],
    answer: 2,
  },
  {
    id: 23,
    category: "values",
    question: "A core Australian value is:",
    options: [
      "Respect for the freedom and dignity of the individual",
      "Obedience without question",
      "Privilege for one religion",
      "Avoiding community life",
    ],
    answer: 1,
  },
  {
    id: 24,
    category: "values",
    question: "Commitment to the rule of law means citizens should:",
    options: [
      "Ignore laws they dislike",
      "Obey Australia's laws",
      "Only obey local laws",
      "Let others decide the law",
    ],
    answer: 2,
  },
  {
    id: 25,
    category: "values",
    question: "Equality of opportunity in Australia means:",
    options: [
      "Everyone gets the same job",
      "People should have a fair chance to succeed",
      "Only wealthy people vote",
      "Gender decides legal rights",
    ],
    answer: 2,
  },
  {
    id: 26,
    category: "values",
    question: "Mateship in Australian culture often refers to:",
    options: [
      "Helping friends and looking after one another",
      "Competing against neighbours",
      "Avoiding teamwork",
      "Formal military ranks only",
    ],
    answer: 1,
  },
  {
    id: 27,
    category: "values",
    question: "Australian citizens are expected to:",
    options: [
      "Never travel overseas",
      "Uphold Australian laws and democratic beliefs",
      "Support only one political party",
      "Speak only English at home",
    ],
    answer: 2,
  },
  {
    id: 28,
    category: "values",
    question: "Violence as a way to settle disagreements in Australia is:",
    options: ["Accepted", "Encouraged in politics", "Not acceptable", "Required by law"],
    answer: 3,
  },
  {
    id: 29,
    category: "people",
    question: "Torres Strait Islanders are the First Nations peoples of:",
    options: [
      "Central Australia",
      "The islands between Australia and Papua New Guinea",
      "Tasmania only",
      "Western Australia deserts",
    ],
    answer: 2,
  },
  {
    id: 30,
    category: "people",
    question: "The Commonwealth Coat of Arms features which animals?",
    options: [
      "Lion and unicorn",
      "Kangaroo and emu",
      "Koala and wombat",
      "Eagle and horse",
    ],
    answer: 2,
  },
  {
    id: 31,
    category: "democracy",
    question: "A secret ballot means:",
    options: [
      "Your vote is public",
      "Your vote is private",
      "Only parties see your vote",
      "Votes are not counted",
    ],
    answer: 2,
  },
  {
    id: 32,
    category: "government",
    question: "The Prime Minister is usually:",
    options: [
      "Appointed for life",
      "The leader of the party (or coalition) with majority support in the House of Representatives",
      "Elected directly by popular vote nationwide",
      "Chosen by the High Court",
    ],
    answer: 2,
  },
  {
    id: 33,
    category: "government",
    question: "Changing the Australian Constitution requires:",
    options: [
      "A decision by the Prime Minister alone",
      "A referendum with a double majority",
      "Approval from local councils only",
      "A United Nations vote",
    ],
    answer: 2,
  },
  {
    id: 34,
    category: "values",
    question: "Compassion for those in need is reflected in Australia through:",
    options: [
      "Ignoring community services",
      "Support such as social services and volunteering",
      "Banning public hospitals",
      "Charging only private fees for emergency care",
    ],
    answer: 2,
  },
  {
    id: 35,
    category: "democracy",
    question: "Freedom of association allows people to:",
    options: [
      "Join lawful groups and organisations",
      "Force others to join a party",
      "Break laws with a group",
      "Ban all clubs",
    ],
    answer: 1,
  },
  {
    id: 36,
    category: "people",
    question: "Which event is remembered on Remembrance Day (11 November)?",
    options: [
      "Federation",
      "The end of World War I fighting",
      "Australia Day",
      "The first Olympic Games in Australia",
    ],
    answer: 2,
  },
  {
    id: 37,
    category: "government",
    question: "Taxes in Australia help pay for:",
    options: [
      "Only private businesses",
      "Public services such as schools, hospitals and roads",
      "Overseas elections",
      "Political party memberships",
    ],
    answer: 2,
  },
  {
    id: 38,
    category: "values",
    question: "Respect in Australian society includes:",
    options: [
      "Treating others fairly regardless of background",
      "Accepting discrimination",
      "Ignoring the law",
      "Preferring one ethnic group in all jobs",
    ],
    answer: 1,
  },
  {
    id: 39,
    category: "democracy",
    question: "Australians can change the government by:",
    options: [
      "Protests alone",
      "Voting in elections",
      "Writing to the King only",
      "Court cases only",
    ],
    answer: 2,
  },
  {
    id: 40,
    category: "government",
    question: "Jury service is an important civic responsibility because:",
    options: [
      "It replaces elections",
      "Ordinary citizens help decide serious criminal cases",
      "Only judges can serve on juries",
      "It sets tax rates",
    ],
    answer: 2,
  },
];
