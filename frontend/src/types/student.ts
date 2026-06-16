export type StudentGender = 'male' | 'female';

export interface Student {
  id: string;
  tenant_id: string;
  nis: string;
  nisn: string | null;
  name: string;
  gender: StudentGender;
  date_of_birth: string | null;
  address: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  is_active: boolean;
}

export interface StudentAcademic {
  id: string;
  student_id: string;
  tenant_id: string;
  semester: number;
  academic_year: string;
  average_score: number;
  failed_subjects_count: number;
  incomplete_assignments_count: number;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  tenant_id: string;
  semester: number;
  academic_year: string;
  present_count: number;
  sick_count: number;
  excused_count: number;
  unexcused_count: number;
  attendance_percentage: number | null;
}

export interface StudentSocioEconomic {
  id: string;
  student_id: string;
  tenant_id: string;
  parents_income: number | null;
  monthly_expenses: number | null;
  parents_education_level: string | null;
  birth_order: number | null;
  dependents_count: number | null;
  has_kip_scholarship: boolean;
  is_working_student: boolean;
  has_internet_access: boolean;
  distance_to_school_km: number | null;
  housing_status: string | null;
}

export interface StudentRiskPrediction {
  id: string;
  student_id: string;
  tenant_id: string;
  ml_model_id: string;
  risk_score: number;
  is_at_risk: boolean;
  factors_summary: string | null;
  created_at: string;
}