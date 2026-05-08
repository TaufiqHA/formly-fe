# Planning: Implementasi Endpoint Analytics

Dokumen ini berisi langkah-langkah detail untuk mengimplementasikan endpoint **Analytics** berdasarkan `API_REFERENCE.md`. Panduan ini dirancang khusus agar mudah dieksekusi oleh *junior developer* atau *model AI*.

## Daftar Endpoint yang Akan Diimplementasikan
Berdasarkan dokumentasi API, terdapat 3 endpoint untuk Analytics:
1. `GET /analytics/summary` - Mengambil Ringkasan KPI (Total responses, active forms, dll).
2. `GET /analytics/trend` - Mengambil data chart untuk trend response harian.
3. `GET /analytics/status-distribution` - Mengambil data distribusi status submission/order.

---

## Langkah 1: Buat Interface/Tipe Data Analytics
Mendefinisikan *TypeScript Interfaces* untuk data balikan dari API agar mempermudah penulisan kode (Type Safety).

**File Target:** `src/types/analytics.ts` (Buat file jika belum ada)
```typescript
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
```

---

## Langkah 2: Buat Service API Analytics
Membuat file service yang menangani seluruh komunikasi ke endpoint `/analytics`.

**File Target:** `src/services/analyticsService.ts` (Buat file baru)
```typescript
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
```

---

## Langkah 3: Integrasi dengan Halaman Dashboard
Menghubungkan data dari API dengan antarmuka pengguna pada halaman Dashboard.

**File Target:** `src/views/Dashboard.tsx`

**Instruksi Kerja:**
1. **Import Service & Types**: Import `analyticsService` ke dalam `Dashboard.tsx`.
2. **Setup State**: Buat state baru untuk menyimpan data API dan status loading.
   ```tsx
   const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
   const [trendData, setTrendData] = useState<AnalyticsTrend[]>([]);
   const [statusData, setStatusData] = useState<AnalyticsStatusDistribution[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   ```
3. **Fetch Data di `useEffect`**: Panggil ketiga endpoint tersebut secara paralel saat komponen dimuat (mounting).
   ```tsx
   useEffect(() => {
     const fetchDashboardData = async () => {
       try {
         setIsLoading(true);
         const [summaryRes, trendRes, statusRes] = await Promise.all([
           analyticsService.getSummary(),
           analyticsService.getTrend(),
           analyticsService.getStatusDistribution()
         ]);

         if (summaryRes.success) setSummary(summaryRes.data);
         if (trendRes.success) setTrendData(trendRes.data);
         if (statusRes.success) setStatusData(statusRes.data);
       } catch (error) {
         console.error("Failed to fetch analytics data", error);
       } finally {
         setIsLoading(false);
       }
     };

     fetchDashboardData();
   }, []);
   ```
4. **Implementasi Skeleton Loading**: Jika `isLoading === true`, tampilkan loading skeleton atau icon `Loader2` dari `lucide-react`.
5. **Mapping Data ke UI**:
   - Ganti *hardcoded number* pada **Summary Cards** (Total Response, Active Forms, dll) menggunakan variabel state `summary` (misal: `summary?.total_responses`).
   - Ganti *mock data* pada chart/grafik di *Dashboard* menggunakan variabel state `trendData`.
   - Tampilkan proporsi status pesanan di UI (jika ada komponen *pie chart* atau progress bar) menggunakan data dari `statusData`.

---

## Checklist Penyelesaian (Definition of Done)
- [ ] File `src/types/analytics.ts` telah terbuat dan menggunakan interface yang sesuai dengan struktur JSON API.
- [ ] File `src/services/analyticsService.ts` telah dibuat dan mengekspor 3 fungsi yang memanggil `fetchApi`.
- [ ] Pada file `src/views/Dashboard.tsx`, data statis (*hardcoded/mock data*) telah digantikan dengan *state* React.
- [ ] Terlihat *loading state* (spinner/skeleton) saat data Dashboard sedang dimuat dari server.
- [ ] Buka browser dan pastikan tab "Network" (*Developer Tools*) memperlihatkan 3 buah request ke endpoint `/analytics` menghasilkan respons HTTP `200 OK`.
- [ ] UI Dashboard berhasil merender data *Summary*, *Trend*, dan *Status Distribution* dengan benar dan tanpa *error* JavaScript di *console*.
