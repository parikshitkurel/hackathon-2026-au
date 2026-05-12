export interface Team {
  id: string;
  team_name: string;
  project_name: string;
  members: number;
  category: string;
  description: string;
  github_url: string;
  demo_url: string;
  submitted_at: string;
  status: 'pending' | 'evaluated';
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
  submitted_at: string;
}

export const mockTeams: Team[] = [
  {
    id: "t-001",
    team_name: "Pixel Pioneers",
    project_name: "Generative Landscapes",
    members: 3,
    category: "Generative Art",
    description: "An interactive web experience that generates unique procedural landscapes based on user mouse movements and ambient sound inputs. Built using Three.js and Web Audio API.",
    github_url: "https://github.com/example/gen-land",
    demo_url: "https://gen-land.example.com",
    submitted_at: "2026-05-10T10:00:00Z",
    status: "pending"
  },
  {
    id: "t-002",
    team_name: "Syntax Sorcerers",
    project_name: "SynthWave Vis",
    members: 2,
    category: "Audio Visualization",
    description: "A real-time audio visualizer that transforms Spotify playlists into 80s synthwave style 3D environments.",
    github_url: "https://github.com/example/synth-vis",
    demo_url: "https://synth-vis.example.com",
    submitted_at: "2026-05-10T11:30:00Z",
    status: "evaluated"
  },
  {
    id: "t-003",
    team_name: "Void Walkers",
    project_name: "Null Pointer",
    members: 4,
    category: "Interactive Storytelling",
    description: "A text-based interactive story where the environment dynamically changes color palettes based on the emotional weight of the user's choices.",
    github_url: "https://github.com/example/null-pointer",
    demo_url: "https://null-pointer.example.com",
    submitted_at: "2026-05-11T09:15:00Z",
    status: "pending"
  },
  {
    id: "t-004",
    team_name: "Creative Core",
    project_name: "Motion Canvas",
    members: 1,
    category: "Generative Art",
    description: "A collaborative drawing tool where strokes are mathematically interpolated and animated to create beautiful geometric patterns.",
    github_url: "https://github.com/example/motion-canvas",
    demo_url: "",
    submitted_at: "2026-05-11T14:20:00Z",
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
    submitted_at: "2026-05-11T16:00:00Z"
  }
];
