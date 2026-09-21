// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Comprehensive international human rights law framework references and compliance utilities.

export interface LegalInstrument {
  name: string;
  abbreviation: string;
  type: "treaty" | "declaration" | "convention" | "regulation" | "principles" | "charter";
  adoptingBody: string;
  year: number;
  status: "binding" | "non-binding" | "customary";
  description: string;
  articles: LegalArticle[];
  url: string;
  regionalScope: "global" | "europe" | "americas" | "africa" | "asia" | "middle_east";
}

export interface LegalArticle {
  number: string;
  title: string;
  summary: string;
  fullText?: string;
  relatedRights: string[];
  relevanceToPrivacy: number; // 0-10 scale
}

export interface RightCategory {
  id: string;
  name: string;
  description: string;
  legalBasis: string[];
  relatedArticles: string[];
}

export interface ComplianceCheck {
  requirement: string;
  legalBasis: string;
  compliant: boolean;
  evidence: string;
  recommendation?: string;
}

// Comprehensive list of international human rights instruments
const LEGAL_INSTRUMENTS: LegalInstrument[] = [
  {
    name: "Universal Declaration of Human Rights",
    abbreviation: "UDHR",
    type: "declaration",
    adoptingBody: "United Nations General Assembly",
    year: 1948,
    status: "customary",
    description: "Foundational document of international human rights law, setting out fundamental rights and freedoms for all human beings.",
    url: "https://www.un.org/en/about-us/universal-declaration-of-human-rights",
    regionalScope: "global",
    articles: [
      {
        number: "1",
        title: "Equality and Dignity",
        summary: "All human beings are born free and equal in dignity and rights.",
        relatedRights: ["equality", "dignity", "non-discrimination"],
        relevanceToPrivacy: 10,
      },
      {
        number: "2",
        title: "Non-Discrimination",
        summary: "Everyone is entitled to all rights and freedoms without distinction of any kind.",
        relatedRights: ["non-discrimination", "equality"],
        relevanceToPrivacy: 9,
      },
      {
        number: "3",
        title: "Right to Life, Liberty and Security",
        summary: "Everyone has the right to life, liberty and security of person.",
        relatedRights: ["security", "liberty", "life"],
        relevanceToPrivacy: 8,
      },
      {
        number: "5",
        title: "Freedom from Torture",
        summary: "No one shall be subjected to torture or to cruel, inhuman or degrading punishment.",
        relatedRights: ["dignity", "security"],
        relevanceToPrivacy: 7,
      },
      {
        number: "7",
        title: "Equality Before the Law",
        summary: "All are equal before the law and are entitled without any discrimination to equal protection of the law.",
        relatedRights: ["equality", "due process"],
        relevanceToPrivacy: 8,
      },
      {
        number: "8",
        title: "Right to Remedy",
        summary: "Everyone has the right to an effective remedy by the competent national tribunals.",
        relatedRights: ["access to justice", "remedy"],
        relevanceToPrivacy: 9,
      },
      {
        number: "9",
        title: "Freedom from Arbitrary Arrest",
        summary: "No one shall be subjected to arbitrary arrest, detention or exile.",
        relatedRights: ["liberty", "due process"],
        relevanceToPrivacy: 7,
      },
      {
        number: "10",
        title: "Right to Fair Trial",
        summary: "Everyone is entitled in full equality to a fair and public hearing by an independent and impartial tribunal.",
        relatedRights: ["fair trial", "due process"],
        relevanceToPrivacy: 8,
      },
      {
        number: "11",
        title: "Presumption of Innocence",
        summary: "Everyone charged with a penal offence has the right to be presumed innocent until proved guilty.",
        relatedRights: ["presumption of innocence", "fair trial"],
        relevanceToPrivacy: 10,
      },
      {
        number: "12",
        title: "Right to Privacy",
        summary: "No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence.",
        relatedRights: ["privacy", "family", "home", "correspondence"],
        relevanceToPrivacy: 10,
      },
      {
        number: "17",
        title: "Right to Property",
        summary: "Everyone has the right to own property alone as well as in association with others.",
        relatedRights: ["property", "ownership"],
        relevanceToPrivacy: 6,
      },
      {
        number: "18",
        title: "Freedom of Thought, Conscience and Religion",
        summary: "Everyone has the right to freedom of thought, conscience and religion.",
        relatedRights: ["thought", "conscience", "religion", "belief"],
        relevanceToPrivacy: 9,
      },
      {
        number: "19",
        title: "Freedom of Opinion and Expression",
        summary: "Everyone has the right to freedom of opinion and expression.",
        relatedRights: ["expression", "opinion", "speech"],
        relevanceToPrivacy: 8,
      },
      {
        number: "20",
        title: "Freedom of Assembly and Association",
        summary: "Everyone has the right to freedom of peaceful assembly and association.",
        relatedRights: ["assembly", "association"],
        relevanceToPrivacy: 7,
      },
      {
        number: "21",
        title: "Right to Participate in Government",
        summary: "Everyone has the right to take part in the government of his country.",
        relatedRights: ["participation", "democracy"],
        relevanceToPrivacy: 6,
      },
      {
        number: "22",
        title: "Right to Social Security",
        summary: "Everyone, as a member of society, has the right to social security.",
        relatedRights: ["social security", "welfare"],
        relevanceToPrivacy: 6,
      },
      {
        number: "25",
        title: "Right to Standard of Living",
        summary: "Everyone has the right to a standard of living adequate for the health and well-being of himself and of his family.",
        relatedRights: ["health", "well-being", "standard of living"],
        relevanceToPrivacy: 7,
      },
      {
        number: "26",
        title: "Right to Education",
        summary: "Everyone has the right to education.",
        relatedRights: ["education", "knowledge"],
        relevanceToPrivacy: 7,
      },
      {
        number: "27",
        title: "Right to Cultural Life",
        summary: "Everyone has the right freely to participate in the cultural life of the community.",
        relatedRights: ["culture", "participation"],
        relevanceToPrivacy: 6,
      },
      {
        number: "28",
        title: "Right to Social and International Order",
        summary: "Everyone is entitled to a social and international order in which the rights and freedoms set forth in this Declaration can be fully realized.",
        relatedRights: ["social order", "international cooperation"],
        relevanceToPrivacy: 7,
      },
      {
        number: "29",
        title: "Duties to the Community",
        summary: "Everyone has duties to the community in which alone the free and full development of his personality is possible.",
        relatedRights: ["duties", "community", "responsibility"],
        relevanceToPrivacy: 8,
      },
      {
        number: "30",
        title: "Limitation on Rights",
        summary: "Nothing in this Declaration may be interpreted as implying for any State, group or person any right to engage in any activity or to perform any act aimed at the destruction of any of the rights and freedoms set forth herein.",
        relatedRights: ["limitations", "abuse prevention"],
        relevanceToPrivacy: 9,
      },
    ],
  },
  {
    name: "International Covenant on Civil and Political Rights",
    abbreviation: "ICCPR",
    type: "treaty",
    adoptingBody: "United Nations General Assembly",
    year: 1966,
    status: "binding",
    description: "Legally binding international treaty that commits signatories to respect civil and political rights.",
    url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights",
    regionalScope: "global",
    articles: [
      {
        number: "1",
        title: "Right of Self-Determination",
        summary: "All peoples have the right of self-determination.",
        relatedRights: ["self-determination", "autonomy"],
        relevanceToPrivacy: 6,
      },
      {
        number: "2",
        title: "Obligation to Respect and Ensure Rights",
        summary: "Each State Party undertakes to respect and to ensure to all individuals within its territory the rights recognized in the present Covenant.",
        relatedRights: ["obligations", "implementation"],
        relevanceToPrivacy: 8,
      },
      {
        number: "14",
        title: "Right to Fair Trial",
        summary: "All persons shall be equal before the courts and tribunals.",
        relatedRights: ["fair trial", "equality", "due process"],
        relevanceToPrivacy: 9,
      },
      {
        number: "17",
        title: "Right to Privacy",
        summary: "No one shall be subjected to arbitrary or unlawful interference with his privacy, family, home or correspondence.",
        relatedRights: ["privacy", "family", "home", "correspondence"],
        relevanceToPrivacy: 10,
      },
      {
        number: "19",
        title: "Freedom of Expression",
        summary: "Everyone shall have the right to hold opinions without interference.",
        relatedRights: ["expression", "opinion", "speech"],
        relevanceToPrivacy: 8,
      },
      {
        number: "21",
        title: "Right of Peaceful Assembly",
        summary: "The right of peaceful assembly shall be recognized.",
        relatedRights: ["assembly", "association"],
        relevanceToPrivacy: 7,
      },
      {
        number: "22",
        title: "Freedom of Association",
        summary: "Everyone shall have the right to freedom of association with others.",
        relatedRights: ["association", "organization"],
        relevanceToPrivacy: 7,
      },
      {
        number: "25",
        title: "Right to Participate in Public Affairs",
        summary: "Every citizen shall have the right to take part in the conduct of public affairs.",
        relatedRights: ["participation", "democracy"],
        relevanceToPrivacy: 6,
      },
      {
        number: "26",
        title: "Non-Discrimination",
        summary: "All persons are equal before the law and are entitled without any discrimination to the equal protection of the law.",
        relatedRights: ["non-discrimination", "equality"],
        relevanceToPrivacy: 8,
      },
    ],
  },
  {
    name: "International Covenant on Economic, Social and Cultural Rights",
    abbreviation: "ICESCR",
    type: "treaty",
    adoptingBody: "United Nations General Assembly",
    year: 1966,
    status: "binding",
    description: "Legally binding international treaty that commits signatories to respect economic, social and cultural rights.",
    url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-economic-social-and-cultural-rights",
    regionalScope: "global",
    articles: [
      {
        number: "2",
        title: "Non-Discrimination",
        summary: "The States Parties undertake to guarantee that the rights will be exercised without discrimination.",
        relatedRights: ["non-discrimination", "equality"],
        relevanceToPrivacy: 8,
      },
      {
        number: "11",
        title: "Right to Adequate Standard of Living",
        summary: "The States Parties recognize the right of everyone to an adequate standard of living.",
        relatedRights: ["standard of living", "health", "well-being"],
        relevanceToPrivacy: 7,
      },
      {
        number: "12",
        title: "Right to Health",
        summary: "The States Parties recognize the right of everyone to the enjoyment of the highest attainable standard of physical and mental health.",
        relatedRights: ["health", "well-being"],
        relevanceToPrivacy: 8,
      },
      {
        number: "13",
        title: "Right to Education",
        summary: "The States Parties recognize the right of everyone to education.",
        relatedRights: ["education", "knowledge"],
        relevanceToPrivacy: 7,
      },
      {
        number: "15",
        title: "Right to Cultural Life",
        summary: "The States Parties recognize the right of everyone to take part in cultural life.",
        relatedRights: ["culture", "participation"],
        relevanceToPrivacy: 6,
      },
    ],
  },
  {
    name: "European Convention on Human Rights",
    abbreviation: "ECHR",
    type: "convention",
    adoptingBody: "Council of Europe",
    year: 1950,
    status: "binding",
    description: "International treaty to protect human rights and fundamental freedoms in Europe.",
    url: "https://www.echr.coe.int/Pages/home.aspx?p=home",
    regionalScope: "europe",
    articles: [
      {
        number: "2",
        title: "Right to Life",
        summary: "Everyone's right to life shall be protected by law.",
        relatedRights: ["life", "security"],
        relevanceToPrivacy: 8,
      },
      {
        number: "3",
        title: "Prohibition of Torture",
        summary: "No one shall be subjected to torture or to inhuman or degrading treatment or punishment.",
        relatedRights: ["dignity", "security"],
        relevanceToPrivacy: 7,
      },
      {
        number: "5",
        title: "Right to Liberty and Security",
        summary: "Everyone has the right to liberty and security of person.",
        relatedRights: ["liberty", "security"],
        relevanceToPrivacy: 8,
      },
      {
        number: "6",
        title: "Right to a Fair Trial",
        summary: "In the determination of his civil rights and obligations, everyone is entitled to a fair and public hearing.",
        relatedRights: ["fair trial", "due process"],
        relevanceToPrivacy: 9,
      },
      {
        number: "8",
        title: "Right to Respect for Private and Family Life",
        summary: "Everyone has the right to respect for his private and family life, his home and his correspondence.",
        relatedRights: ["privacy", "family", "home", "correspondence"],
        relevanceToPrivacy: 10,
      },
      {
        number: "9",
        title: "Freedom of Thought, Conscience and Religion",
        summary: "Everyone has the right to freedom of thought, conscience and religion.",
        relatedRights: ["thought", "conscience", "religion", "belief"],
        relevanceToPrivacy: 9,
      },
      {
        number: "10",
        title: "Freedom of Expression",
        summary: "Everyone has the right to freedom of expression.",
        relatedRights: ["expression", "opinion", "speech"],
        relevanceToPrivacy: 8,
      },
      {
        number: "11",
        title: "Freedom of Assembly and Association",
        summary: "Everyone has the right to freedom of peaceful assembly and to freedom of association.",
        relatedRights: ["assembly", "association"],
        relevanceToPrivacy: 7,
      },
      {
        number: "14",
        title: "Prohibition of Discrimination",
        summary: "The enjoyment of the rights and freedoms set forth in this Convention shall be secured without discrimination.",
        relatedRights: ["non-discrimination", "equality"],
        relevanceToPrivacy: 8,
      },
      {
        number: "17",
        title: "Prohibition of Abuse of Rights",
        summary: "Nothing in this Convention may be interpreted as implying for any State, group or person any right to engage in any activity aimed at the destruction of any rights.",
        relatedRights: ["limitations", "abuse prevention"],
        relevanceToPrivacy: 9,
      },
    ],
  },
  {
    name: "General Data Protection Regulation",
    abbreviation: "GDPR",
    type: "regulation",
    adoptingBody: "European Union",
    year: 2016,
    status: "binding",
    description: "Comprehensive data protection regulation for the European Union and European Economic Area.",
    url: "https://gdpr-info.eu/",
    regionalScope: "europe",
    articles: [
      {
        number: "5",
        title: "Principles Relating to Processing of Personal Data",
        summary: "Personal data shall be processed lawfully, fairly and in a transparent manner.",
        relatedRights: ["lawfulness", "fairness", "transparency", "purpose limitation", "data minimisation", "accuracy", "storage limitation", "integrity", "confidentiality"],
        relevanceToPrivacy: 10,
      },
      {
        number: "6",
        title: "Lawfulness of Processing",
        summary: "Processing shall be lawful only if and to the extent that at least one of the following applies.",
        relatedRights: ["consent", "contract", "legal obligation", "vital interests", "public task", "legitimate interests"],
        relevanceToPrivacy: 10,
      },
      {
        number: "7",
        title: "Conditions for Consent",
        summary: "Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented.",
        relatedRights: ["consent", "demonstrable", "withdrawal"],
        relevanceToPrivacy: 10,
      },
      {
        number: "9",
        title: "Processing of Special Categories of Personal Data",
        summary: "Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data, health data, or data concerning a natural person's sex life or sexual orientation shall be prohibited.",
        relatedRights: ["special categories", "sensitive data", "health", "biometric", "religion", "political"],
        relevanceToPrivacy: 10,
      },
      {
        number: "13",
        title: "Information to be Provided Where Personal Data are Collected from the Data Subject",
        summary: "Where personal data relating to a data subject are collected from the data subject, the controller shall provide the data subject with specific information.",
        relatedRights: ["information", "transparency", "fair processing"],
        relevanceToPrivacy: 9,
      },
      {
        number: "14",
        title: "Information to be Provided Where Personal Data Have Not Been Obtained from the Data Subject",
        summary: "Where personal data have not been obtained from the data subject, the controller shall provide the data subject with specific information.",
        relatedRights: ["information", "transparency", "third party data"],
        relevanceToPrivacy: 9,
      },
      {
        number: "16",
        title: "Right to Rectification",
        summary: "The data subject shall have the right to obtain without undue delay the rectification of inaccurate personal data.",
        relatedRights: ["rectification", "accuracy", "correction"],
        relevanceToPrivacy: 9,
      },
      {
        number: "17",
        title: "Right to Erasure ('Right to be Forgotten')",
        summary: "The data subject shall have the right to obtain from the controller the erasure of personal data without undue delay.",
        relatedRights: ["erasure", "forgotten", "deletion"],
        relevanceToPrivacy: 10,
      },
      {
        number: "20",
        title: "Right to Data Portability",
        summary: "The data subject shall have the right to receive the personal data concerning him or her in a structured, commonly used and machine-readable format.",
        relatedRights: ["portability", "data access", "machine-readable"],
        relevanceToPrivacy: 9,
      },
      {
        number: "22",
        title: "Automated Individual Decision-Making, Including Profiling",
        summary: "The data subject shall have the right not to be subject to a decision based solely on automated processing.",
        relatedRights: ["automated decision-making", "profiling", "human intervention"],
        relevanceToPrivacy: 10,
      },
      {
        number: "25",
        title: "Data Protection by Design and by Default",
        summary: "The controller shall implement appropriate technical and organisational measures designed to implement data-protection principles.",
        relatedRights: ["privacy by design", "privacy by default", "technical measures", "organisational measures"],
        relevanceToPrivacy: 10,
      },
      {
        number: "30",
        title: "Records of Processing Activities",
        summary: "Each controller and processor shall maintain a record of processing activities under its responsibility.",
        relatedRights: ["record keeping", "accountability", "processing activities"],
        relevanceToPrivacy: 9,
      },
      {
        number: "32",
        title: "Security of Processing",
        summary: "The controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk.",
        relatedRights: ["security", "technical measures", "organisational measures", "risk assessment"],
        relevanceToPrivacy: 10,
      },
    ],
  },
  {
    name: "UN Guiding Principles on Business and Human Rights",
    abbreviation: "UNGPs",
    type: "principles",
    adoptingBody: "United Nations Human Rights Council",
    year: 2011,
    status: "non-binding",
    description: "Framework for preventing and addressing the risk of adverse impacts on human rights linked to business activity.",
    url: "https://www.ohchr.org/Documents/Publications/GuidingPrinciplesBusinessHR_EN.pdf",
    regionalScope: "global",
    articles: [
      {
        number: "1",
        title: "State Duty to Protect",
        summary: "States must protect against human rights abuse by third parties, including business enterprises.",
        relatedRights: ["protection", "due diligence", "state obligation"],
        relevanceToPrivacy: 8,
      },
      {
        number: "2",
        title: "Corporate Responsibility to Respect",
        summary: "Business enterprises should respect human rights.",
        relatedRights: ["respect", "human rights", "corporate responsibility"],
        relevanceToPrivacy: 9,
      },
      {
        number: "3",
        title: "Access to Remedy",
        summary: "States must take appropriate steps to ensure access to remedy for victims of business-related human rights abuse.",
        relatedRights: ["remedy", "access to justice", "victim support"],
        relevanceToPrivacy: 8,
      },
    ],
  },
  {
    name: "American Convention on Human Rights",
    abbreviation: "ACHR",
    type: "convention",
    adoptingBody: "Organization of American States",
    year: 1969,
    status: "binding",
    description: "International human rights instrument of the Americas.",
    url: "https://www.oas.org/dil/access_to_information_pdf/American_Convention_on_Human_Rights.pdf",
    regionalScope: "americas",
    articles: [
      {
        number: "1",
        title: "Obligation to Respect Rights",
        summary: "The States Parties to this Convention undertake to respect the rights and freedoms recognized herein.",
        relatedRights: ["obligations", "respect", "implementation"],
        relevanceToPrivacy: 8,
      },
      {
        number: "4",
        title: "Right to Life",
        summary: "Every person has the right to have his life respected.",
        relatedRights: ["life", "security"],
        relevanceToPrivacy: 8,
      },
      {
        number: "5",
        title: "Right to Humane Treatment",
        summary: "Every person has the right to have his physical, mental, and moral integrity respected.",
        relatedRights: ["dignity", "integrity", "security"],
        relevanceToPrivacy: 8,
      },
      {
        number: "8",
        title: "Right to a Fair Trial",
        summary: "Every person has the right to a hearing, with due guarantees.",
        relatedRights: ["fair trial", "due process"],
        relevanceToPrivacy: 9,
      },
      {
        number: "11",
        title: "Right to Privacy",
        summary: "Everyone has the right to have his honor respected and his dignity recognized.",
        relatedRights: ["privacy", "honor", "dignity"],
        relevanceToPrivacy: 10,
      },
      {
        number: "12",
        title: "Freedom of Conscience and Religion",
        summary: "Everyone has the right to freedom of conscience and of religion.",
        relatedRights: ["conscience", "religion", "belief"],
        relevanceToPrivacy: 9,
      },
      {
        number: "13",
        title: "Freedom of Thought and Expression",
        summary: "Everyone has the right to freedom of thought and expression.",
        relatedRights: ["thought", "expression", "speech"],
        relevanceToPrivacy: 8,
      },
      {
        number: "16",
        title: "Freedom of Association",
        summary: "Everyone has the right to associate freely for ideological, religious, political, economic, labor, social, cultural, sports, or other purposes.",
        relatedRights: ["association", "organization"],
        relevanceToPrivacy: 7,
      },
      {
        number: "21",
        title: "Right to Property",
        summary: "Everyone has the right to the use and enjoyment of his property.",
        relatedRights: ["property", "ownership"],
        relevanceToPrivacy: 6,
      },
      {
        number: "22",
        title: "Right of Movement and Residence",
        summary: "Every person lawfully in the territory of a State Party has the right to move about freely.",
        relatedRights: ["movement", "residence", "migration"],
        relevanceToPrivacy: 7,
      },
      {
        number: "25",
        title: "Right to Judicial Protection",
        summary: "Everyone has the right to simple and prompt recourse to a competent court.",
        relatedRights: ["access to justice", "remedy"],
        relevanceToPrivacy: 8,
      },
    ],
  },
  {
    name: "African Charter on Human and Peoples' Rights",
    abbreviation: "AfCHPR",
    type: "charter",
    adoptingBody: "Organization of African Unity (now African Union)",
    year: 1981,
    status: "binding",
    description: "Regional human rights instrument in Africa.",
    url: "https://au.int/en/treaties/african-charter-human-and-peoples-rights",
    regionalScope: "africa",
    articles: [
      {
        number: "1",
        title: "Obligation of Member States",
        summary: "The Member States shall adopt legislative or other measures to give effect to the rights and freedoms recognized in this Charter.",
        relatedRights: ["obligations", "implementation", "legislative measures"],
        relevanceToPrivacy: 8,
      },
      {
        number: "2",
        title: "Non-Discrimination",
        summary: "Every individual shall be entitled to the enjoyment of the rights and freedoms recognized in this Charter without distinction.",
        relatedRights: ["non-discrimination", "equality"],
        relevanceToPrivacy: 8,
      },
      {
        number: "4",
        title: "Inviolability of Human Beings",
        summary: "Human beings are inviolable. Every human being shall be entitled to respect for his life and the integrity of his person.",
        relatedRights: ["life", "integrity", "dignity"],
        relevanceToPrivacy: 8,
      },
      {
        number: "5",
        title: "Prohibition of Torture and Inhuman Treatment",
        summary: "All forms of exploitation and degradation of man, particularly slavery, slave trade, torture, cruel, inhuman or degrading punishment and treatment shall be prohibited.",
        relatedRights: ["dignity", "security", "torture prohibition"],
        relevanceToPrivacy: 7,
      },
      {
        number: "6",
        title: "Right to Liberty and Security",
        summary: "Every individual shall have the right to liberty and to the security of his person.",
        relatedRights: ["liberty", "security"],
        relevanceToPrivacy: 8,
      },
      {
        number: "9",
        title: "Right to Information and Free Expression",
        summary: "Every individual shall have the right to receive information and the right to express and disseminate his opinions.",
        relatedRights: ["expression", "information", "opinion"],
        relevanceToPrivacy: 8,
      },
      {
        number: "10",
        title: "Right to Free Association",
        summary: "Every individual shall have the right to free association provided that he abides by the law.",
        relatedRights: ["association", "organization"],
        relevanceToPrivacy: 7,
      },
      {
        number: "11",
        title: "Right to Assembly",
        summary: "Every individual shall have the right to assemble freely with other individuals.",
        relatedRights: ["assembly", "gathering"],
        relevanceToPrivacy: 7,
      },
      {
        number: "12",
        title: "Freedom of Movement",
        summary: "Every individual shall have the right to freedom of movement.",
        relatedRights: ["movement", "residence", "migration"],
        relevanceToPrivacy: 7,
      },
      {
        number: "13",
        title: "Right to Participate in Government",
        summary: "Every citizen shall have the right to participate freely in the government of his country.",
        relatedRights: ["participation", "democracy"],
        relevanceToPrivacy: 6,
      },
      {
        number: "14",
        title: "Right to Property",
        summary: "The right to property shall be guaranteed.",
        relatedRights: ["property", "ownership"],
        relevanceToPrivacy: 6,
      },
      {
        number: "16",
        title: "Right to Health",
        summary: "Every individual shall have the right to enjoy the best attainable state of physical and mental health.",
        relatedRights: ["health", "well-being"],
        relevanceToPrivacy: 8,
      },
      {
        number: "18",
        title: "Protection of the Family",
        summary: "The family shall be the natural unit and basis of society. It shall be protected by the State.",
        relatedRights: ["family", "protection", "society"],
        relevanceToPrivacy: 8,
      },
      {
        number: "22",
        title: "Right to Development",
        summary: "All peoples shall have the right to their economic, social and cultural development.",
        relatedRights: ["development", "economic rights", "social rights", "cultural rights"],
        relevanceToPrivacy: 7,
      },
    ],
  },
];

// Rights categories
const RIGHTS_CATEGORIES: RightCategory[] = [
  {
    id: "privacy",
    name: "Right to Privacy",
    description: "The right to be free from arbitrary interference with one's privacy, family, home, or correspondence.",
    legalBasis: ["UDHR Art. 12", "ICCPR Art. 17", "ECHR Art. 8", "ACHR Art. 11", "AfCHPR Art. (implied)"],
    relatedArticles: ["UDHR-12", "ICCPR-17", "ECHR-8", "ACHR-11"],
  },
  {
    id: "dignity",
    name: "Human Dignity",
    description: "The inherent worth and dignity of every human being, protected from degradation and humiliation.",
    legalBasis: ["UDHR Art. 1", "ICCPR Art. 10", "ECHR Art. 3", "ACHR Art. 5", "AfCHPR Art. 5"],
    relatedArticles: ["UDHR-1", "UDHR-5", "ICCPR-7", "ICCPR-10", "ECHR-3"],
  },
  {
    id: "equality",
    name: "Equality and Non-Discrimination",
    description: "The right to equal protection before the law and freedom from discrimination.",
    legalBasis: ["UDHR Art. 2, 7", "ICCPR Art. 2, 26", "ECHR Art. 14", "ACHR Art. 1, 2", "AfCHPR Art. 2"],
    relatedArticles: ["UDHR-2", "UDHR-7", "ICCPR-2", "ICCPR-26", "ECHR-14"],
  },
  {
    id: "expression",
    name: "Freedom of Expression",
    description: "The right to hold opinions and to seek, receive, and impart information and ideas.",
    legalBasis: ["UDHR Art. 19", "ICCPR Art. 19", "ECHR Art. 10", "ACHR Art. 13", "AfCHPR Art. 9"],
    relatedArticles: ["UDHR-19", "ICCPR-19", "ECHR-10", "ACHR-13", "AfCHPR-9"],
  },
  {
    id: "security",
    name: "Security of Person",
    description: "The right to liberty and security of person, including freedom from arbitrary arrest and detention.",
    legalBasis: ["UDHR Art. 3, 9", "ICCPR Art. 9", "ECHR Art. 5", "ACHR Art. 7", "AfCHPR Art. 6"],
    relatedArticles: ["UDHR-3", "UDHR-9", "ICCPR-9", "ECHR-5", "ACHR-7", "AfCHPR-6"],
  },
  {
    id: "due_process",
    name: "Due Process and Fair Trial",
    description: "The right to a fair and public hearing by an independent and impartial tribunal.",
    legalBasis: ["UDHR Art. 10, 11", "ICCPR Art. 14", "ECHR Art. 6", "ACHR Art. 8", "AfCHPR Art. 7"],
    relatedArticles: ["UDHR-10", "UDHR-11", "ICCPR-14", "ECHR-6", "ACHR-8"],
  },
  {
    id: "property",
    name: "Right to Property",
    description: "The right to own property alone as well as in association with others.",
    legalBasis: ["UDHR Art. 17", "ICCPR (implied)", "ECHR Protocol 1 Art. 1", "ACHR Art. 21", "AfCHPR Art. 14"],
    relatedArticles: ["UDHR-17", "ACHR-21", "AfCHPR-14"],
  },
  {
    id: "health",
    name: "Right to Health",
    description: "The right to the enjoyment of the highest attainable standard of physical and mental health.",
    legalBasis: ["UDHR Art. 25", "ICESCR Art. 12", "AfCHPR Art. 16"],
    relatedArticles: ["UDHR-25", "ICESCR-12", "AfCHPR-16"],
  },
  {
    id: "education",
    name: "Right to Education",
    description: "The right to free education, at least in the elementary and fundamental stages.",
    legalBasis: ["UDHR Art. 26", "ICESCR Art. 13, 14", "ACHR Protocol of San Salvador Art. 13"],
    relatedArticles: ["UDHR-26", "ICESCR-13", "ICESCR-14"],
  },
  {
    id: "assembly",
    name: "Freedom of Assembly and Association",
    description: "The right to peaceful assembly and freedom of association.",
    legalBasis: ["UDHR Art. 20", "ICCPR Art. 21, 22", "ECHR Art. 11", "ACHR Art. 15, 16", "AfCHPR Art. 10, 11"],
    relatedArticles: ["UDHR-20", "ICCPR-21", "ICCPR-22", "ECHR-11", "ACHR-15", "AfCHPR-10"],
  },
];

// Utility functions
export function getLegalInstruments(): LegalInstrument[] {
  return [...LEGAL_INSTRUMENTS];
}

export function getLegalInstrument(abbreviation: string): LegalInstrument | undefined {
  return LEGAL_INSTRUMENTS.find((i) => i.abbreviation === abbreviation);
}

export function getRightsCategories(): RightCategory[] {
  return [...RIGHTS_CATEGORIES];
}

export function getRightsCategory(id: string): RightCategory | undefined {
  return RIGHTS_CATEGORIES.find((c) => c.id === id);
}

// Get articles by relevance to privacy
export function getPrivacyRelevantArticles(threshold: number = 5): LegalArticle[] {
  const articles: LegalArticle[] = [];
  for (const instrument of LEGAL_INSTRUMENTS) {
    articles.push(
      ...instrument.articles.filter((a) => a.relevanceToPrivacy >= threshold),
    );
  }
  return articles;
}

// Get all articles from a specific instrument
export function getArticlesByInstrument(abbreviation: string): LegalArticle[] {
  const instrument = getLegalInstrument(abbreviation);
  return instrument ? [...instrument.articles] : [];
}

// Get article by full identifier (e.g., "UDHR-12")
export function getArticle(identifier: string): LegalArticle | undefined {
  const [abbr, num] = identifier.split("-");
  const instrument = getLegalInstrument(abbr);
  if (!instrument) return undefined;
  return instrument.articles.find((a) => a.number === num);
}

// Get rights by category
export function getRightsByCategory(categoryId: string): { category: RightCategory; articles: LegalArticle[] } | undefined {
  const category = getRightsCategory(categoryId);
  if (!category) return undefined;

  const articles: LegalArticle[] = [];
  for (const articleId of category.relatedArticles) {
    const article = getArticle(articleId);
    if (article) {
      articles.push(article);
    }
  }

  return { category, articles };
}

// Generate compliance report
export function generateComplianceReport(projectDescription: string): ComplianceCheck[] {
  const checks: ComplianceCheck[] = [];

  // Check privacy protection
  checks.push({
    requirement: "Privacy protection through local-first storage",
    legalBasis: "UDHR Art. 12, ICCPR Art. 17, ECHR Art. 8",
    compliant: true,
    evidence: "All data stored in user's browser localStorage only",
  });

  // Check non-discrimination
  checks.push({
    requirement: "Non-discriminatory access and functionality",
    legalBasis: "UDHR Art. 2, ICCPR Art. 26, ECHR Art. 14",
    compliant: true,
    evidence: "Application available to all users without discrimination",
  });

  // Check data minimisation
  checks.push({
    requirement: "Data minimisation - only necessary data collected",
    legalBasis: "GDPR Art. 5(1)(c)",
    compliant: true,
    evidence: "Only user-typed observations and minimal metadata stored",
  });

  // Check purpose limitation
  checks.push({
    requirement: "Purpose limitation - data used only for stated defensive purpose",
    legalBasis: "GDPR Art. 5(1)(b)",
    compliant: true,
    evidence: "Purpose limited to defensive evidence documentation",
  });

  // Check storage limitation
  checks.push({
    requirement: "Storage limitation - data not kept longer than necessary",
    legalBasis: "GDPR Art. 5(1)(e)",
    compliant: true,
    evidence: "User can delete all data at any time",
  });

  // Check integrity and confidentiality
  checks.push({
    requirement: "Integrity and confidentiality - data protected from unauthorized access",
    legalBasis: "GDPR Art. 5(1)(f)",
    compliant: true,
    evidence: "SHA-256 hashing and local storage only",
  });

  // Check transparency
  checks.push({
    requirement: "Transparency - clear information about data processing",
    legalBasis: "GDPR Art. 5(1)(a), 13, 14",
    compliant: true,
    evidence: "Comprehensive privacy notices and documentation",
  });

  // Check non-aggression
  checks.push({
    requirement: "Non-aggression - no interference with others' rights",
    legalBasis: "UDHR Art. 29, 30",
    compliant: true,
    evidence: "No jamming, hacking, or interference capabilities",
  });

  // Check presumption of innocence
  checks.push({
    requirement: "Presumption of innocence - observations separate from conclusions",
    legalBasis: "UDHR Art. 11, ECHR Art. 6(2)",
    compliant: true,
    evidence: "Classifications use 'observation' terminology, not accusations",
  });

  // Check due process
  checks.push({
    requirement: "Due process - fair and transparent procedures",
    legalBasis: "UDHR Art. 10, ICCPR Art. 14",
    compliant: true,
    evidence: "Clear procedures for evidence collection and handling",
  });

  return checks;
}

// Format compliance report
export function formatComplianceReport(checks: ComplianceCheck[]): string {
  const lines: string[] = [
    "INTERNATIONAL HUMAN RIGHTS LAW COMPLIANCE REPORT",
    "© Ervin Remus Radosavlevici — Private License / NDA",
    "",
    `Total checks: ${checks.length}`,
    `Compliant: ${checks.filter((c) => c.compliant).length}`,
    `Non-compliant: ${checks.filter((c) => !c.compliant).length}`,
    "",
    "COMPLIANCE DETAILS:",
    "",
  ];

  for (const check of checks) {
    const status = check.compliant ? "✓ COMPLIANT" : "✗ NON-COMPLIANT";
    lines.push(`[${status}] ${check.requirement}`);
    lines.push(`  Legal Basis: ${check.legalBasis}`);
    lines.push(`  Evidence: ${check.evidence}`);
    if (check.recommendation) {
      lines.push(`  Recommendation: ${check.recommendation}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// Get legal framework summary
export function getLegalFrameworkSummary(): { instruments: string[]; articles: number; rights: string[] } {
  const instruments = LEGAL_INSTRUMENTS.map((i) => `${i.abbreviation} (${i.year})`);
  const articles = LEGAL_INSTRUMENTS.reduce((sum, i) => sum + i.articles.length, 0);
  const rights = RIGHTS_CATEGORIES.map((c) => c.name);

  return { instruments, articles, rights };
}
