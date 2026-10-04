export type UserRole = 'admin' | 'guru' | 'siswa';

export interface Guru {
  id: string;
  email: string;
  username: string;
  name: string;
  nip?: string;
  phone?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string; // Username untuk tampilan (admin, guru, siswa)
  name: string;
  role: UserRole;
  avatar_url?: string;
  nip_nisn?: string;
  phone?: string;
  school_class?: string;
  major?: string;
  dudi_id?: string;
  guru_id?: string;
  created_at?: string;
}

export interface Dudi {
  id: string;
  name: string;
  industry_type: string;
  address: string;
  pic_name: string;
  pic_phone: string;
  quota: number;
  active_students?: number;
  status: 'active' | 'aktif' | 'inactive';
}

export interface Placement {
  id: string;
  student_id: string;
  student_name: string;
  student_class: string;
  student_nisn?: string;
  dudi_id?: string;
  dudi_name: string;
  dudi_address?: string;
  guru_id?: string;
  guru_name?: string;
  mentor_name?: string;
  industry?: string;
  division?: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'aktif' | 'completed' | 'ditolak';
}

export interface Attendance {
  id: string;
  student_id: string;
  student_name: string;
  dudi_name: string;
  date: string;
  check_in: string;
  check_out?: string;
  photo_in?: string;
  photo_out?: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  notes?: string;
  location?: string;
}

export interface Journal {
  id: string;
  student_id: string;
  student_name: string;
  dudi_name: string;
  date: string;
  division: string;
  activity_description: string;
  photo?: string;
  learning_outcomes?: string;
  duration?: string;
  status: 'pending' | 'approved' | 'revision';
  feedback?: string;
  verified_at?: string;
}

export interface Evaluation {
  id: string;
  student_id: string;
  student_name: string;
  dudi_name: string;
  discipline_score: number;
  skill_score: number;
  initiative_score: number;
  teamwork_score: number;
  final_grade: number;
  notes: string;
  evaluator_name: string;
  updated_at: string;
}

export interface SchoolSettings {
  appName: string;
  appDescription: string;
  contactEmail: string;
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolWebsite: string;
  principalName: string;
  principalNip: string;
  activeAcademicYear: string;
  // Halaman Depan
  heroTitle?: string;
  heroSubtitle?: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
}
