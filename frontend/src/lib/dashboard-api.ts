import { get } from '@/lib/api-client';

export interface StudentRecord {
  id: string;
  name: string;
  nis: string;
  nisn: string | null;
  gender?: string;
  is_active: boolean;
  address?: string;
}

export interface AcademicRecord {
  id: string;
  student_id?: string;
  semester: number;
  academic_year: string;
  average_score: number;
  failed_subjects_count: number;
  incomplete_assignments_count: number;
}

export interface AttendanceRecord {
  id: string;
  student_id?: string;
  semester: number;
  attendance_percentage: number;
  present_count: number;
  sick_count: number;
  excused_count: number;
  unexcused_count: number;
}

export interface SocioEconomicRecord {
  id: string;
  student_id?: string;
  has_kip_scholarship: boolean;
  parents_income: number;
  monthly_expenses: number;
  distance_to_school_km: number;
  parents_education_level: string;
  has_internet_access: boolean;
}

export interface RiskPredictionRecord {
  id: string;
  student_id: string;
  risk_score: number | string;
  risk_status?: string;
  is_at_risk?: boolean;
  factors_summary?: string;
  created_at: string;
}

export interface UserRecord {
  id: string;
  fullname: string;
  email: string;
  role: 'superadmin' | 'admin' | 'counselor';
  is_active: boolean;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  entity_name: string;
  details: Record<string, unknown>;
  created_at: string;
}

export async function fetchAllStudents(limit = 10000): Promise<StudentRecord[]> {
  const response = await get<{ data: StudentRecord[] }>(`/api/v1/students/?skip=0&limit=${limit}`);
  return response.data;
}

export async function fetchStudent(id: string): Promise<StudentRecord> {
  const response = await get<{ data: StudentRecord }>(`/api/v1/students/${id}`);
  return response.data;
}

export async function fetchAllUsers(limit = 10000): Promise<UserRecord[]> {
  const response = await get<{ data: UserRecord[] }>(`/api/v1/users/?skip=0&limit=${limit}`);
  return response.data;
}

export async function fetchAllAuditLogs(limit = 100): Promise<AuditLogRecord[]> {
  const response = await get<{ data: AuditLogRecord[] }>(`/api/v1/audit-logs/?skip=0&limit=${limit}`);
  return response.data;
}

export async function fetchLatestPrediction(studentId: string): Promise<RiskPredictionRecord | null> {
  try {
    const response = await get<{ data: RiskPredictionRecord }>(`/api/v1/predictions/student/${studentId}/latest`);
    return response.data;
  } catch {
    return null;
  }
}

export async function fetchAcademics(studentId: string): Promise<AcademicRecord[]> {
  const response = await get<{ data: AcademicRecord[] }>(`/api/v1/academics/?student_id=${studentId}`);
  return response.data;
}

export async function fetchAttendances(studentId: string): Promise<AttendanceRecord[]> {
  const response = await get<{ data: AttendanceRecord[] }>(`/api/v1/attendances/?student_id=${studentId}`);
  return response.data;
}

export async function fetchSocioEconomic(studentId: string): Promise<SocioEconomicRecord | null> {
  try {
    const response = await get<{ data: SocioEconomicRecord }>(`/api/v1/socio-economic/${studentId}`);
    return response.data;
  } catch {
    return null;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function riskScoreToLevel(risk_score: number | string, is_at_risk?: boolean): 'Tinggi' | 'Aman' {
  const score = typeof risk_score === 'string' ? parseFloat(risk_score) : risk_score;
  if (is_at_risk || score >= 0.75 || score >= 50 || score === 1) {
    return 'Tinggi';
  }
  return 'Aman';
}

export function formatRiskLabel(risk_score: number | string, is_at_risk?: boolean): 'Tinggi' | 'Aman' {
  return riskScoreToLevel(risk_score, is_at_risk);
}
