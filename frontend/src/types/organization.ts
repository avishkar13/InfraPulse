export interface Organization {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export type MembershipRole = "owner" | "admin" | "developer" | "viewer";

export interface MembershipUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

export interface Membership {
  id: string;
  user: MembershipUser;
  organization: string; // uuid
  role: MembershipRole;
  created_at: string;
}
