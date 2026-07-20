export type ProjectType =
  | "professional"
  | "brand"
  | "academic"
  | "conceptual"
  | "in_development";

export type ProjectStatus =
  | "completed"
  | "in_progress"
  | "maintained"
  | "archived";

export type ContactCategory =
  | "build_site"
  | "fix_problem"
  | "promote_business"
  | "improve_identity"
  | "meet_wesley"
  | "other";

export type PreferredContact = "email" | "whatsapp";

export type ContactStatus = "new" | "in_review" | "answered" | "archived";

export type SiteLocale = "pt" | "en";

export type SiteProfileRow = {
  id: string;
  name: string;
  professional_title_pt: string;
  professional_title_en: string;
  bio_pt: string;
  bio_en: string;
  email: string;
  whatsapp: string;
  github_url: string;
  resume_path: string | null;
  profile_image_path: string | null;
  ai_visible: boolean;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  summary_pt: string;
  summary_en: string;
  problem_pt: string;
  problem_en: string;
  solution_pt: string;
  solution_en: string;
  result_pt: string | null;
  result_en: string | null;
  category: string;
  project_type: ProjectType;
  status: ProjectStatus;
  technologies: string[];
  cover_path: string | null;
  video_url: string | null;
  demo_url: string | null;
  repository_url: string | null;
  original_url: string | null;
  featured: boolean;
  is_published: boolean;
  ai_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CertificationRow = {
  id: string;
  title: string;
  issuer: string;
  category: string;
  issue_date: string;
  expiration_date: string | null;
  credential_code: string | null;
  credential_url: string | null;
  private_file_path: string | null;
  featured: boolean;
  is_published: boolean;
  ai_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  role_pt: string;
  role_en: string;
  description_pt: string;
  description_en: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  skills: string[];
  is_published: boolean;
  ai_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  category: ContactCategory;
  scope_pt: string;
  scope_en: string;
  starting_price: number | null;
  remote_available: boolean;
  onsite_available: boolean;
  featured: boolean;
  is_published: boolean;
  ai_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactRequestRow = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  category: ContactCategory;
  message: string;
  preferred_contact: PreferredContact;
  locale: SiteLocale;
  consent_at: string;
  status: ContactStatus;
  created_at: string;
};

export type PublicAiKnowledgeRow = {
  entity_type: string;
  entity_id: string;
  data: Record<string, unknown>;
};

type WithPartialDefaults<Row, Defaults extends keyof Row> = Omit<
  Row,
  Defaults
> &
  Partial<Pick<Row, Defaults>>;

export type Database = {
  public: {
    Tables: {
      site_profile: {
        Row: SiteProfileRow;
        Insert: WithPartialDefaults<
          SiteProfileRow,
          "id" | "resume_path" | "profile_image_path" | "ai_visible" | "updated_at"
        >;
        Update: Partial<SiteProfileRow>;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: WithPartialDefaults<
          ProjectRow,
          | "id"
          | "result_pt"
          | "result_en"
          | "cover_path"
          | "video_url"
          | "demo_url"
          | "repository_url"
          | "original_url"
          | "featured"
          | "is_published"
          | "ai_visible"
          | "sort_order"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      certifications: {
        Row: CertificationRow;
        Insert: WithPartialDefaults<
          CertificationRow,
          | "id"
          | "expiration_date"
          | "credential_code"
          | "credential_url"
          | "private_file_path"
          | "featured"
          | "is_published"
          | "ai_visible"
          | "sort_order"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<CertificationRow>;
        Relationships: [];
      };
      experiences: {
        Row: ExperienceRow;
        Insert: WithPartialDefaults<
          ExperienceRow,
          | "id"
          | "end_date"
          | "is_current"
          | "skills"
          | "is_published"
          | "ai_visible"
          | "sort_order"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<ExperienceRow>;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: WithPartialDefaults<
          ServiceRow,
          | "id"
          | "starting_price"
          | "remote_available"
          | "onsite_available"
          | "featured"
          | "is_published"
          | "ai_visible"
          | "sort_order"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<ServiceRow>;
        Relationships: [];
      };
      contact_requests: {
        Row: ContactRequestRow;
        Insert: WithPartialDefaults<
          ContactRequestRow,
          "id" | "email" | "whatsapp" | "status" | "created_at"
        >;
        Update: Partial<ContactRequestRow>;
        Relationships: [];
      };
    };
    Views: {
      public_ai_knowledge: {
        Row: PublicAiKnowledgeRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      project_type: ProjectType;
      project_status: ProjectStatus;
      contact_category: ContactCategory;
      preferred_contact: PreferredContact;
      contact_status: ContactStatus;
      site_locale: SiteLocale;
    };
    CompositeTypes: Record<string, never>;
  };
};
