export interface AnalyticsSummary {
  total_responses: number;
  active_forms: number;
  average_conversion: number;
}

export interface AnalyticsTrend {
  name: string;
  value: number;
}

export interface AnalyticsStatusDistribution {
  status: string;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
