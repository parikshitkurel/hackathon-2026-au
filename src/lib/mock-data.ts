export interface Team {
  id: string;
  team_name: string;
  project_name: string;
  category: string;
  members: number;
  member_names: string[];
  description: string;
  github_url: string;
  demo_url: string;
  status: 'pending' | 'evaluated';
  submitted_at: string;
}

export interface Score {
  id: string;
  judge_id: string;
  team_id: string;
  creativity_score: number;
  technical_score: number;
  design_score: number;
  theme_score: number;
  engagement_score: number;
  total_score: number;
  feedback: string;
  edit_count: number;
  submitted_at: string;
}

export const mockTeams: Team[] = [
  {
    id: "t-001",
    team_name: "Pixiora_cc2026",
    project_name: "Pixiora",
    members: 2,
    member_names: ["Anshera Siddiqui", "Anshika Pandya"],
    category: "Salute to Motherhood",
    description: "Expressing the feeling of nostalgia in our creation.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:43:05Z",
    status: "pending"
  },
  {
    id: "t-002",
    team_name: "EcoVision",
    project_name: "EcoVision EV",
    members: 2,
    member_names: ["Abubakar Nagori", "Uzair Khan"],
    category: "Electric Vehicle Representation",
    description: "Combining graphics, animations, and interactivity to create a visually engaging EV experience.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:49:48Z",
    status: "pending"
  },
  {
    id: "t-003",
    team_name: "Team Art Attack",
    project_name: "Art Attack",
    members: 2,
    member_names: ["Ayush Sharma", "Sanya Raj"],
    category: "Electric Vehicle Representation",
    description: "Just creative expression of ideas.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:52:35Z",
    status: "pending"
  },
  {
    id: "t-004",
    team_name: "Team Cosmic Coders",
    project_name: "Cosmic Coders",
    members: 2,
    member_names: ["Atharv Jain", "Pranav Mehta"],
    category: "Space Research (ISRO)",
    description: "Excited to innovate, learn, and build something inspiring together.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:52:38Z",
    status: "pending"
  },
  {
    id: "t-005",
    team_name: "DesiDynamics",
    project_name: "DesiDynamics",
    members: 2,
    member_names: ["VIDHI CHOUHAN", "PRARTHNA TRIVEDI"],
    category: "Indian Culture and Tradition",
    description: "CREATIVE CHALLENGES + VISUALIZATION",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:53:10Z",
    status: "pending"
  },
  {
    id: "t-006",
    team_name: "Highway Hackers",
    project_name: "Fastag Simulation",
    members: 2,
    member_names: ["Hemant Parmar", "Pradeep Kalmodiya"],
    category: "Indian Tollways Simulation",
    description: "Creative challenge and learning new skills.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:54:10Z",
    status: "pending"
  },
  {
    id: "t-007",
    team_name: "Bit-Bharat",
    project_name: "Bit-Bharat UPI",
    members: 2,
    member_names: ["Gulshan Jatwa", "Tushar Nagar"],
    category: "Digital Payments (UPI)",
    description: "Learning new skills and inspiring the world.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:55:28Z",
    status: "pending"
  },
  {
    id: "t-008",
    team_name: "Team AstroVikram",
    project_name: "AstroVikram",
    members: 2,
    member_names: ["Divyansh Sharma", "Priyanka Jadhav"],
    category: "Space Research (ISRO)",
    description: "Learning creativity and technology.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:57:31Z",
    status: "pending"
  },
  {
    id: "t-009",
    team_name: "Vyom Tech",
    project_name: "Vyom Space",
    members: 2,
    member_names: ["Vardan kumawat", "Reva Parmar"],
    category: "Space Research (ISRO)",
    description: "Learning creative coding and building innovation visual projects using P5.js.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:57:36Z",
    status: "pending"
  },
  {
    id: "t-010",
    team_name: "ARthNova",
    project_name: "ARthNova SDG",
    members: 2,
    member_names: ["Rupal hada", "Aditi meena"],
    category: "Sustainable Development Goals",
    description: "About experiencing making our imagination come alive on the screen.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:57:57Z",
    status: "pending"
  },
  {
    id: "t-011",
    team_name: "UPI Ninjas",
    project_name: "UPI Ninjas",
    members: 2,
    member_names: ["Sameer Upadhyay", "Sudhanshu Sachan"],
    category: "Digital Payments (UPI)",
    description: "Creative Challenges",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:58:16Z",
    status: "pending"
  },
  {
    id: "t-012",
    team_name: "Pixel Predators",
    project_name: "Pixel Culture",
    members: 2,
    member_names: ["Aditya Kumar Singh", "Prakhar Sachan"],
    category: "Indian Culture and Tradition",
    description: "Learning New skills with creative challenge.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:58:24Z",
    status: "pending"
  },
  {
    id: "t-013",
    team_name: "Shades of Weather",
    project_name: "Weather Moods",
    members: 2,
    member_names: ["Priyansh Parashar", "Vidit Tiwari"],
    category: "Weather as Mood",
    description: "Learning and Skills Development.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:58:43Z",
    status: "pending"
  },
  {
    id: "t-014",
    team_name: "Code Yatra",
    project_name: "MP Tourism Interaction",
    members: 2,
    member_names: ["Arpit Rathore", "Paneri Mandavgane"],
    category: "Madhya Pradesh Tourism",
    description: "New learnings and gaining experiences.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:58:54Z",
    status: "pending"
  },
  {
    id: "t-015",
    team_name: "HeartBeat MP",
    project_name: "HeartBeat MP",
    members: 2,
    member_names: ["Pratishtha Sen", "Priya Tomar"],
    category: "Madhya Pradesh Tourism",
    description: "Experiencing first time 48 hours hackathon and pressure of doing in a given timeline.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:59:07Z",
    status: "pending"
  },
  {
    id: "t-016",
    team_name: "Runtime Terror",
    project_name: "Runtime Terror",
    members: 2,
    member_names: ["Lakshita sharma", "Mamta Chandrawat"],
    category: "One-Button Games",
    description: "Learning new skills.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:59:09Z",
    status: "pending"
  },
  {
    id: "t-017",
    team_name: "Aditya-L1",
    project_name: "Aditya-L1 Space",
    members: 2,
    member_names: ["Stuti Patel", "Raj Kumar Mali"],
    category: "Space Research (ISRO)",
    description: "Creative challenge.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:59:36Z",
    status: "pending"
  },
  {
    id: "t-018",
    team_name: "The Slackers",
    project_name: "Slacker Tourism",
    members: 2,
    member_names: ["Shravan Goyal", "Raghav Pathak"],
    category: "Madhya Pradesh Tourism",
    description: "Creative Challenge and HIstorical Knowledge.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T11:59:56Z",
    status: "pending"
  },
  {
    id: "t-019",
    team_name: "The WhimPhantasia Duo",
    project_name: "WhimPhantasia Weather",
    members: 2,
    member_names: ["Aditya kushwah", "Gouri Jaiswal"],
    category: "Weather as Mood",
    description: "The craetive challenges that we will face during hacakthon.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T12:00:02Z",
    status: "pending"
  },
  {
    id: "t-020",
    team_name: "Gaming Titans",
    project_name: "Titan Weather",
    members: 2,
    member_names: ["Krishna Bakde", "Sumit Verma"],
    category: "Weather as Mood",
    description: "Creative challenge.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T12:00:52Z",
    status: "pending"
  },
  {
    id: "t-021",
    team_name: "BharatFlux",
    project_name: "BharatFlux Fastag",
    members: 2,
    member_names: ["Ansh Pandya", "Shubhdeeep Goyal"],
    category: "Indian Tollways Simulation",
    description: "I’m excited to explore creative coding, build an interactive project, learn new skills.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T12:00:57Z",
    status: "pending"
  },
  {
    id: "t-022",
    team_name: "Ctrl Creators",
    project_name: "Ctrl Creators",
    members: 2,
    member_names: ["Payal Priya", "Dhawal Hatiya"],
    category: "One-Button Games",
    description: "Challenge and learning new skills.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T12:01:27Z",
    status: "pending"
  },
  {
    id: "t-023",
    team_name: "indic builders",
    project_name: "Indic Tourism",
    members: 2,
    member_names: ["Devyani Wagh", "Shaurya Sharma"],
    category: "Madhya Pradesh Tourism",
    description: "creative coding.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T12:01:38Z",
    status: "pending"
  },
  {
    id: "t-024",
    team_name: "HexNova",
    project_name: "HexNova Games",
    members: 2,
    member_names: ["Rudraksh Nagar", "Rabit Mansuri"],
    category: "One-Button Games",
    description: "Creative Challenge.",
    github_url: "",
    demo_url: "",
    submitted_at: "2026-05-12T12:06:36Z",
    status: "pending"
  }
];

export const mockScores: Score[] = [
  {
    id: "s-001",
    judge_id: "j-001",
    team_id: "t-002",
    creativity_score: 18,
    technical_score: 15,
    design_score: 20,
    theme_score: 16,
    engagement_score: 19,
    total_score: 88,
    feedback: "Incredible visual aesthetic. The audio syncing was slightly off during heavy bass drops, but overall a stunning project.",
    edit_count: 0,
    submitted_at: "2026-05-11T16:00:00Z"
  }
];
