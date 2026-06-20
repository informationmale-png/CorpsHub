export type Project = {
  id: string;
  author_id: string;
  name: string;
  one_liner: string;
  problem: string;
  solution: string;
  setup_needs: string;
  setup_time: string;
  difficulty: string;
  sector: string;
  org_size: string;
  note_to_next: string;
  github_url: string;
  verified: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  project_id: string;
  author_name: string;
  org_name: string;
  rating: number;
  body: string;
  created_at: string;
};

export type Deployment = {
  id: string;
  project_id: string;
  org_name: string;
  state: string;
  hours_saved: number;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  cohort: string;
  host_org: string;
  sector: string;
  bio: string;
  avatar_url: string;
  linkedin_url: string;
  website: string;
  created_at: string;
};
