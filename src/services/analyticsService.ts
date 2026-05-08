import { fetchApi } from '../lib/api';
import { 
  AnalyticsSummary, 
  AnalyticsTrend, 
  AnalyticsStatusDistribution, 
  ApiResponse 
} from '../types/analytics';

export const analyticsService = {
  // GET /analytics/summary
  getSummary: async (): Promise<ApiResponse<AnalyticsSummary>> => {
    return fetchApi('/analytics/summary', { method: 'GET' });
  },

  // GET /analytics/trend
  getTrend: async (): Promise<ApiResponse<AnalyticsTrend[]>> => {
    return fetchApi('/analytics/trend', { method: 'GET' });
  },

  // GET /analytics/status-distribution
  getStatusDistribution: async (): Promise<ApiResponse<AnalyticsStatusDistribution[]>> => {
    return fetchApi('/analytics/status-distribution', { method: 'GET' });
  }
};
