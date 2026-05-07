# Planning Implementasi Sinkronisasi Form Fields (Frontend)

Dokumen ini berisi panduan untuk memperbaiki eror "No query results" dan menyelesaikan implementasi sinkronisasi *form fields* antara frontend dan backend.

## 1. Perbaikan Akar Masalah (Dummy ID)
Eror `No query results for model [App\Models\Form] dummy-id-123` terjadi karena aplikasi mencoba menyimpan data ke ID yang tidak ada di database. 

**Solusi:**
- Pastikan `App.tsx` membuat form baru di database *sebelum* membuka FormBuilder.
- Hilangkan nilai *default* `dummy-id-123` di `FormBuilder.tsx`.

---

## 2. Pembaruan Service (`src/services/formService.ts`)
Tambahkan method `getForm` untuk mengambil detail form (termasuk fields-nya) saat FormBuilder dibuka.

```typescript
// Tambahkan di dalam formService
  getForm: async (id: string) => {
    return fetchApi(`/forms/${id}`, { method: 'GET' });
  },
```

---

## 3. Implementasi Fetch & Mapping di `FormBuilder.tsx`
Buka `src/views/FormBuilder.tsx` dan tambahkan logika untuk memuat data dari backend.

### 3.1. Fungsi Mapping Icon
Karena backend hanya mengirim string `field_type`, kita butuh fungsi untuk mencocokkannya dengan ikon `lucide-react`.

```typescript
const getIconByType = (type: string) => {
  const icons: Record<string, any> = {
    text: Type,
    para: AlignLeft,
    drop: ChevronDown,
    check: CheckSquare,
    radio: Radio,
    email: Mail,
    phone: Phone,
    address: MapPin,
  };
  return icons[type] || Type;
};
```

### 3.2. Fetch Data saat Mount
Tambahkan `useEffect` untuk mengambil data jika `formId` tersedia.

```typescript
  useEffect(() => {
    if (!formId) return;

    const loadFormData = async () => {
      try {
        const res = await formService.getForm(formId);
        if (res.success) {
          setFormTitle(res.data.title);
          setFormDescription(res.data.description || '');
          
          // Map fields dari backend ke format state lokal
          const mappedFields = res.data.fields.map((f: any) => ({
            id: f.id,
            type: f.field_type,
            label: f.label,
            placeholder: f.placeholder || '',
            required: !!f.is_required,
            icon: getIconByType(f.field_type),
            options: f.options || undefined
          }));
          
          setFormElements(mappedFields);
          if (mappedFields.length > 0) setActiveField(mappedFields[0].id);
        }
      } catch (e) {
        console.error("Gagal memuat form", e);
      }
    };

    loadFormData();
  }, [formId]);
```

---

## 4. Finalisasi Fungsi `handleSave`
Pastikan fungsi `handleSave` mengirimkan data yang bersih (tanpa ID lokal sementara).

```typescript
  const handleSave = async () => {
    if (!formId) return alert('Form ID tidak ditemukan');
    setIsSaving(true);
    
    try {
      const formattedFields = formElements.map((el, index) => {
        // Field baru biasanya ID-nya berupa timestamp (string angka saja)
        // Backend mengharapkan ID asli (UUID) atau kosong jika baru.
        const isNew = !isNaN(Number(el.id)); 
        
        return {
          ...(isNew ? {} : { id: el.id }),
          label: el.label,
          field_type: el.type,
          placeholder: el.placeholder,
          is_required: el.required,
          options: el.options || null,
          sort_order: index
        };
      });

      await formService.updateFormFields(formId, formattedFields);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error: any) {
      alert('Gagal menyimpan form: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
```

---

## 5. Checklist Validasi
- [ ] `App.tsx` sudah mengirimkan `formId` yang valid (hasil dari `createForm`).
- [ ] `FormBuilder.tsx` berhasil menampilkan judul dan field yang sudah ada di database.
- [ ] Tombol "Simpan Form" tidak lagi menghasilkan eror "dummy-id-123".
- [ ] Perubahan urutan atau penambahan field tersimpan dengan benar di database.
