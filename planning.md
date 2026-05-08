# Planning Implementasi Public API (Customer-Facing)

Dokumen ini berisi panduan teknis langkah demi langkah untuk mengimplementasikan endpoint **Public** (tanpa autentikasi) pada backend Laravel 11. Panduan ini dirancang agar sangat mudah diikuti, dipahami, dan dieksekusi secara langsung oleh Junior Developer maupun model AI.

## 🎯 Tujuan
Mengimplementasikan dua endpoint publik sesuai dengan dokumen `API_REFERENCE.md`:
1. `GET /public/forms/{slug}` - Menampilkan detail konfigurasi form untuk dirender di sisi pengunjung (customer).
2. `POST /public/forms/{slug}/submit` - Menerima dan menyimpan jawaban formulir (submission) dari pengunjung.

---

## 🛠️ Langkah 1: Pembuatan Controller
Kita akan membuat `PublicController` khusus untuk menangani request eksternal yang tidak memerlukan token login.

**Perintah CLI (jalankan di terminal backend):**
```bash
php artisan make:controller Api/V1/PublicController
```

---

## 🛣️ Langkah 2: Pendaftaran Route
Daftarkan endpoint publik ke dalam sistem routing Laravel. Pastikan rute ini **TIDAK** berada di dalam grup middleware `auth:sanctum` karena endpoint ini diakses oleh publik tanpa login.

**File Target:** `routes/api.php`

**Kode yang ditambahkan:**
```php
use App\Http\Controllers\Api\V1\PublicController;

// Buat grup dengan prefix v1/public/forms
Route::prefix('v1/public/forms')->group(function () {
    // Menampilkan konfigurasi form untuk dirender
    Route::get('/{slug}', [PublicController::class, 'show']);
    
    // Menerima submit form dari customer
    Route::post('/{slug}/submit', [PublicController::class, 'submit']);
});
```

---

## 💻 Langkah 3: Implementasi Endpoint `GET` (Menampilkan Form)
Endpoint ini bertugas mengambil data `Form` berdasarkan `slug`, memastikan bahwa form tersebut sedang dalam status `active`, dan melampirkan field yang berelasi dengannya.

**File Target:** `app/Http/Controllers/Api/V1/PublicController.php`

**Kode yang ditambahkan (Method `show`):**
```php
public function show($slug)
{
    // 1. Cari form berdasarkan slug yang statusnya 'active'
    // Load relasi fields dan urutkan berdasarkan 'sort_order' agar tampil rapi di frontend
    $form = \App\Models\Form::with(['fields' => function ($query) {
        $query->orderBy('sort_order', 'asc');
    }])
    ->where('slug', $slug)
    ->where('status', 'active')
    ->first();

    // 2. Jika form tidak ditemukan atau statusnya bukan active (misal: draft), tolak dengan 404
    if (!$form) {
        return response()->json([
            'success' => false,
            'message' => 'Form tidak ditemukan atau tidak aktif'
        ], 404);
    }

    // 3. Format response sesuai spesifikasi di API_REFERENCE.md
    return response()->json([
        'success' => true,
        'data' => [
            'id' => $form->id,
            'title' => $form->title,
            'description' => $form->description,
            'fields' => $form->fields->map(function ($field) {
                return [
                    'id' => $field->id,
                    'label' => $field->label,
                    'field_type' => $field->field_type,
                    'is_required' => (bool) $field->is_required,
                    'options' => $field->options, // Pastikan ada attribute casting 'array' di Model FormField
                ];
            })
        ]
    ]);
}
```

---

## 💾 Langkah 4: Implementasi Endpoint `POST` (Submit Formulir)
Endpoint ini bertugas memproses data yang dikirim oleh pengunjung, dan menyimpannya secara aman menggunakan **Database Transaction**.

**File Target:** `app/Http/Controllers/Api/V1/PublicController.php`

**Kode yang ditambahkan (Method `submit`):**
```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

public function submit(Request $request, $slug)
{
    // 1. Cari form berdasarkan slug, pastikan statusnya 'active'
    $form = \App\Models\Form::where('slug', $slug)
        ->where('status', 'active')
        ->first();

    if (!$form) {
        return response()->json(['success' => false, 'message' => 'Form tidak valid atau tidak aktif'], 404);
    }

    // 2. Validasi Request Dasar
    $request->validate([
        'values' => 'required|array'
    ]);

    try {
        // 3. Mulai Database Transaction agar data aman jika terjadi kegagalan sistem di tengah proses
        DB::beginTransaction();

        // 4. Generate Nomor Submission yang Unik (Contoh: SUB-2023-XXXX)
        $submissionNumber = 'SUB-' . date('Y') . '-' . strtoupper(Str::random(4));

        // 5. Insert data utama ke tabel 'submissions'
        $submission = \App\Models\Submission::create([
            'form_id' => $form->id,
            'submission_number' => $submissionNumber,
            'status' => 'new',
            // Opsional: customer_name dan customer_phone bisa diekstrak dari $request->values jika mappingnya diketahui
        ]);

        // 6. Insert setiap jawaban dari customer ke tabel 'submission_values'
        $valuesToInsert = [];
        foreach ($request->values as $fieldId => $value) {
            $valuesToInsert[] = [
                'id' => Str::uuid()->toString(),
                'submission_id' => $submission->id,
                'form_field_id' => $fieldId,
                // Jika value adalah Array (contoh: multiple checkbox), simpan sebagai JSON. Jika String biasa, simpan sebagai Text.
                'value_text' => is_array($value) ? null : (string) $value,
                'value_json' => is_array($value) ? json_encode($value) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Simpan semua values sekaligus (Bulk Insert) untuk optimasi database
        \App\Models\SubmissionValue::insert($valuesToInsert);

        // 7. Commit Transaction (Simpan Permanen)
        DB::commit();

        // 8. Generate URL Redirect WhatsApp (Mockup sementara, bisa dihubungkan ke fitur Settings)
        $waUrl = "https://wa.me/6281234567890?text=Halo,%20pesanan%20{$submissionNumber}%20telah%20diterima.";

        // 9. Kembalikan Response Sukses 201 (Created)
        return response()->json([
            'success' => true,
            'data' => [
                'submission_id' => $submission->id,
                'submission_number' => $submissionNumber,
                'status' => 'new',
                'wa_redirect_url' => $waUrl
            ],
            'message' => 'Pesanan berhasil dikirim'
        ], 201);

    } catch (\Exception $e) {
        // 10. Jika ada error, batalkan semua perubahan di database
        DB::rollBack();
        
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan internal saat menyimpan data: ' . $e->getMessage()
        ], 500);
    }
}
```

---

## ✅ Panduan QA / Pengujian untuk Developer
1. **Pengecekan `GET /public/forms/{slug}`:**
   - [ ] Buka REST Client (Postman/Insomnia).
   - [ ] Panggil URL `GET http://localhost:8000/api/v1/public/forms/slug-valid`. Pastikan mereturn HTTP 200 beserta `fields` secara terurut.
   - [ ] Uji dengan form yang berstatus `draft` atau `slug` yang salah. Pastikan mereturn HTTP 404.
2. **Pengecekan `POST /public/forms/{slug}/submit`:**
   - [ ] Panggil URL menggunakan metode POST.
   - [ ] Berikan request body berupa JSON:
     ```json
     {
       "values": {
         "id-field-1": "Budi",
         "id-field-2": ["Pilihan A"]
       }
     }
     ```
   - [ ] Pastikan responsnya adalah HTTP 201 dengan object `submission_number`.
   - [ ] Periksa Database pada tabel `submissions` dan `submission_values`. Data dipastikan tersimpan dan terelasi dengan benar.
