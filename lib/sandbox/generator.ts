// Sandbox data generator for 5,000 leads with realistic distribution

export interface SandboxLead {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  title: string;
  company: string;
  company_domain: string;
  industry: string;
  employee_count: number;
  revenue_range: string;
  location_city: string;
  location_state: string;
  location_country: string;
  email: string;
  email_status: "valid" | "risky" | "invalid" | "catchall";
  phone: string;
  linkedin_url: string;
  linkedin_about: string;
  technologies: string[];
  enrichment_status: "complete";
  enrichment_source: "apollo";
  verification_status: "valid" | "risky" | "invalid" | "catchall";
  verification_source: "millionverifier";
  created_at: string;
  last_activity: string;
  tags: string[];
}

const industries = ["SaaS", "Fintech", "E-commerce", "Healthcare", "Agency"];
const industryWeights = [0.30, 0.20, 0.20, 0.15, 0.15];

const titles = [
  "CEO",
  "CTO",
  "VP of Marketing",
  "VP of Sales",
  "Director of Marketing",
  "Director of Sales",
  "Marketing Manager",
  "Sales Manager",
  "Head of Growth",
  "Head of Revenue",
];
const titleWeights = [0.05, 0.05, 0.10, 0.10, 0.15, 0.15, 0.20, 0.15, 0.03, 0.02];

const companySizes = [
  { range: "1-10", min: 5, max: 10 },
  { range: "11-50", min: 11, max: 50 },
  { range: "51-200", min: 51, max: 200 },
  { range: "201-500", min: 201, max: 500 },
  { range: "500+", min: 501, max: 1000 },
];
const sizeWeights = [0.20, 0.25, 0.30, 0.15, 0.10];

const cities = [
  { city: "San Francisco", state: "CA", country: "USA" },
  { city: "New York", state: "NY", country: "USA" },
  { city: "Austin", state: "TX", country: "USA" },
  { city: "Boston", state: "MA", country: "USA" },
  { city: "Seattle", state: "WA", country: "USA" },
  { city: "Chicago", state: "IL", country: "USA" },
  { city: "Denver", state: "CO", country: "USA" },
  { city: "Miami", state: "FL", country: "USA" },
  { city: "London", state: "", country: "UK" },
  { city: "Berlin", state: "", country: "Germany" },
  { city: "Paris", state: "", country: "France" },
  { city: "Sydney", state: "", country: "Australia" },
  { city: "Toronto", state: "ON", country: "Canada" },
];

const firstNames = [
  "Sarah", "Marcus", "Emily", "David", "Lisa", "Michael", "Jennifer", "James",
  "Jessica", "Robert", "Amanda", "William", "Melissa", "Richard", "Michelle",
  "Joseph", "Ashley", "Thomas", "Stephanie", "Christopher", "Nicole", "Daniel",
  "Elizabeth", "Matthew", "Lauren", "Anthony", "Megan", "Mark", "Rachel",
  "Donald", "Samantha", "Steven", "Kimberly", "Paul", "Amy", "Andrew", "Angela",
  "Joshua", "Rebecca", "Kenneth", "Michelle", "Kevin", "Laura", "Brian", "Heather",
];

const lastNames = [
  "Chen", "Johnson", "Rodriguez", "Kim", "Thompson", "Williams", "Brown", "Jones",
  "Garcia", "Miller", "Davis", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas",
  "Hernandez", "Moore", "Martin", "Jackson", "Lee", "Perez", "White", "Harris",
  "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen",
  "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
];

const technologies = [
  "HubSpot", "Salesforce", "Drift", "Marketo", "Pardot", "Eloqua", "Intercom",
  "Zendesk", "Slack", "Microsoft", "Google Workspace", "AWS", "Azure", "GCP",
];

const emailStatusWeights = { valid: 0.85, risky: 0.08, invalid: 0.05, catchall: 0.02 };

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLinkedInAbout(industry: string): string {
  const templates: Record<string, string[]> = {
    SaaS: [
      "Marketing leader with 10+ years in B2B SaaS. Previously at Drift and HubSpot. Passionate about PLG and demand gen.",
      "Building the future of cloud infrastructure. Former AWS. Love hiking and dad jokes.",
      "Growth marketer focused on product-led growth. Helped scale 3 SaaS companies from 0 to $10M ARR.",
    ],
    Fintech: [
      "Fintech executive with expertise in payments and banking infrastructure. Former Stripe and Square.",
      "Building the next generation of financial services. Passionate about financial inclusion.",
      "VP of Marketing at a leading fintech. Focused on B2B growth and enterprise sales.",
    ],
    "E-commerce": [
      "E-commerce growth expert. Helped scale multiple DTC brands to 8-figures. Love data-driven marketing.",
      "Building the future of online retail. Former Amazon. Focused on conversion optimization.",
      "E-commerce marketing leader. Expert in paid acquisition and retention strategies.",
    ],
    Healthcare: [
      "Healthcare technology executive. Focused on improving patient outcomes through innovation.",
      "Building healthcare solutions that matter. Former Epic Systems. Passionate about health equity.",
      "Healthcare marketing leader with expertise in B2B health tech. HIPAA-compliant solutions.",
    ],
    Agency: [
      "Agency owner helping B2B companies scale through cold email and outbound. 500+ clients served.",
      "Growth agency founder. Specialized in cold email campaigns for SaaS companies.",
      "Marketing agency leader. We help companies build predictable revenue through outbound.",
    ],
  };

  const options = templates[industry] || templates.SaaS;
  return randomChoice(options);
}

export function generateSandboxLead(id: number): SandboxLead {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const industry = weightedRandom(industries, industryWeights);
  const title = weightedRandom(titles, titleWeights);
  const companySize = weightedRandom(companySizes, sizeWeights);
  const employeeCount = randomInt(companySize.min, companySize.max);
  const location = randomChoice(cities);
  const companyName = `${randomChoice(["Tech", "Cloud", "Data", "Growth", "Scale", "Flow", "Stack", "Lab"])}${randomChoice(["Flow", "Stack", "Labs", "Solutions", "Systems", "Tech", "Group"])}`;
  const companyDomain = companyName.toLowerCase().replace(/\s+/g, "-") + "-demo.com";
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}`;
  
  const emailStatus = weightedRandom(
    Object.keys(emailStatusWeights) as Array<keyof typeof emailStatusWeights>,
    Object.values(emailStatusWeights)
  ) as SandboxLead["email_status"];

  const revenueRanges = [
    "$0-$1M", "$1M-$5M", "$5M-$10M", "$10M-$25M", "$25M-$50M", "$50M+"
  ];
  const revenueRange = revenueRanges[Math.min(Math.floor(employeeCount / 20), revenueRanges.length - 1)];

  const techCount = randomInt(2, 5);
  const selectedTech = technologies
    .sort(() => Math.random() - 0.5)
    .slice(0, techCount);

  const tags: string[] = [];
  if (employeeCount > 200) tags.push("enterprise");
  if (["CEO", "CTO", "VP of Marketing", "VP of Sales"].includes(title)) tags.push("c-level");
  if (industry === "SaaS") tags.push("saas");
  if (emailStatus === "valid") tags.push("verified");

  const daysAgo = randomInt(0, 30);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const activityDaysAgo = randomInt(0, 7);
  const activityDate = new Date();
  activityDate.setDate(activityDate.getDate() - activityDaysAgo);
  const activities = [
    "opened email 2 days ago",
    "clicked link 1 day ago",
    "replied 3 days ago",
    "visited website 5 days ago",
  ];
  const lastActivity = randomChoice(activities);

  return {
    id: `lead_demo_${String(id).padStart(4, "0")}`,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    title,
    company: companyName,
    company_domain: companyDomain,
    industry,
    employee_count: employeeCount,
    revenue_range: revenueRange,
    location_city: location.city,
    location_state: location.state,
    location_country: location.country,
    email,
    email_status: emailStatus,
    phone: `+1-555-${String(randomInt(1000, 9999))}`,
    linkedin_url: `linkedin.com/in/demo-${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    linkedin_about: generateLinkedInAbout(industry),
    technologies: selectedTech,
    enrichment_status: "complete",
    enrichment_source: "apollo",
    verification_status: emailStatus,
    verification_source: "millionverifier",
    created_at: createdDate.toISOString().split("T")[0],
    last_activity: lastActivity,
    tags,
  };
}

export function generateSandboxLeads(count: number = 5000): SandboxLead[] {
  return Array.from({ length: count }, (_, i) => generateSandboxLead(i + 1));
}

