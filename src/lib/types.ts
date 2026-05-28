export type UserRole = "farmer" | "worker";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  created_at: string;
};

export type Job = {
  id: string;
  farmer_id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  start_date: string | null;
  end_date: string | null;
  wage_text: string | null;
  housing_provided: boolean;
  meals_provided: boolean;
  equipment: string | null;
  contact_method: string;
  status: "open" | "filled" | "closed";
  created_at: string;
  updated_at: string;
};

export type JobWithFarmer = Job & {
  farmer: Pick<Profile, "id" | "full_name" | "city" | "state">;
};

export type Application = {
  id: string;
  job_id: string;
  worker_id: string;
  message: string | null;
  worker_phone: string | null;
  worker_email: string | null;
  status: "new" | "viewed" | "contacted" | "declined";
  created_at: string;
};

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
] as const;
