export interface DashboardData {
  students: {
    total_active: number;
    total_inactive: number;
  };
  users: {
    total_counselors: number;
  };
  predictions: {
    total_predicted: number;
    average_risk_score: number;
    tinggi: number;
    sedang: number;
    rendah: number;
    aman: number;
    top_critical: TopCriticalStudent[];
  };
  academic_summary: {
    average_score: number | null;
    students_with_failures: number;
    students_with_data: number;
  };
  attendance_summary: {
    average_percentage: number | null;
    students_with_data: number;
  };
  data_completeness: {
    with_academic: number;
    with_attendance: number;
    with_socio_economic: number;
  };
  semester_trends: SemesterTrend[];
  recent_activities: RecentActivity[];
}

export interface SemesterTrend {
  semester: number;
  academic_year: string;
  avg_score: number | null;
  avg_attendance: number | null;
  student_count: number;
}

export interface TopCriticalStudent {
  student_id: string;
  name: string;
  nis: string;
  nisn: string;
  risk_score: number;
  risk_status: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity_name: string;
  entity_id: string | null;
  user_name: string;
  user_id: string;
  ip_address: string | null;
  created_at: string;
}
