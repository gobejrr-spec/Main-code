

## Rural Transport - Admin Panel Enhancement & Design Improvements

### Overview
Admin panel-д хэрэглэгч удирдлага, жолоочийн бүрэн мэдээлэл харах, аялал цуцлах функцууд нэмж, дизайн сайжруулалт хийнэ. Аймгууд хэсэгт зураг нэмж, аялал хайх холбоосыг `to` параметр болгож өөрчилнө.

---

### 1. Admin Dashboard - Шинэ табууд нэмэх (`AdminDashboard.tsx`)

**Шинэ табууд:**
- **"Хэрэглэгчид"** tab: Бүх хэрэглэгчийн жагсаалт (Firestore `users` collection), role харуулах, устгах, admin болгох
- **"Бүх аялал"** tab: Бүх аялал (approved, pending, rejected) харах + цуцлах (status → "cancelled")
- **"Жолоочид"** tab (одоо байгааг өргөтгөх): Бүртгүүлсэн бүх жолоочийн мэдээлэл бүрэн харах (нэр, утас, машин, бичиг баримт, verificationStatus)

**Шинэ admin нэмэх:**
- Хэрэглэгчид tab-д "Admin болгох" товч → `users` doc-ын `role`-г `admin` болгож шинэчилнэ
- Хэрэглэгч устгах → Firestore `users` doc устгах

**Жолоочийн дэлгэрэнгүй:**
- "Бичиг баримт" товч дарахад modal-д бүх upload хийсэн зураг, мэдээлэл харагдана
- approve/reject-ийн хажууд бүрэн мэдээлэл харах боломж

**Аялал удирдлага:**
- Бүх аялалыг (pending + approved + rejected) жагсаалтаар харуулах
- Approved аялалыг "Цуцлах" боломж → `status: "cancelled"`

### 2. Navbar - Admin товчийг ногоон болгох (`Navbar.tsx`)

- Admin товчны өнгийг `text-success` / `bg-success/10` болгож ялгаруулах

### 3. Title & Logo өөрчлөлт

- `index.html` title → "Rural Transport"
- Logo-г машин/аялалын icon болгох (SVG-ээр шинэ лого үүсгэх)
- `favicon.png` шинэчлэх

### 4. Аймгууд хэсэгт зураг нэмэх (`aimag-data.ts` + `Explore.tsx`)

- `AimagInfo` interface-д `photoUrl: string` нэмэх — Unsplash/Wikimedia-ээс бодит зураг URL
- Аймаг бүрийн карт дээр зураг харуулах (emoji-н оронд)
- Дэлгэрэнгүй хуудсанд үзэх газруудыг зурагтай харуулах
- "Аялал хайх" товчны link-г `?to=` болгож өөрчилнө (одоо `?from=` байгааг)

### 5. Trips хуудас - URL params уншиж `to` автоматаар бөглөх (`Trips.tsx`)

- `useSearchParams` ашиглан `?to=Хөвсгөл` гэх мэт параметрийг `searchTo` state-д оноох
- Ингэснээр аймгийн хуудаснаас "аялал хайх" дарахад `to` нь шууд тухайн аймаг сонгогдсон байна

### 6. Ерөнхий дизайн сайжруулалт

- Login/Register хуудсуудын glassmorphism эффект сайжруулах
- Landing хуудасны "Хэрхэн ажилладаг" хэсгийг илүү тодорхой болгох
- Card hover animation нэмэх

---

### Technical Details

**Admin хэрэглэгч удирдлага:**
```text
users collection → getDocs() → бүх хэрэглэгч жагсаалт
  ├── updateDoc(role: "admin") → admin эрх өгөх
  ├── deleteDoc() → хэрэглэгч устгах  
  └── Харуулах: name, email, phone, role, createdAt
```

**Аялал цуцлах:**
```text
trips collection → getDocs() (бүх status)
  └── updateDoc(status: "cancelled") → цуцлах
```

**Explore → Trips холбоос:**
```text
/trips?to=Хөвсгөл  →  useSearchParams → setSearchTo("Хөвсгөл")
```

**Edited files:**
- `src/pages/AdminDashboard.tsx` — Шинэ табууд, хэрэглэгч удирдлага, аялал цуцлах
- `src/components/Navbar.tsx` — Admin товч ногоон
- `src/lib/aimag-data.ts` — Зургийн URL нэмэх
- `src/pages/Explore.tsx` — Зураг харуулах, link `?to=` болгох
- `src/pages/Trips.tsx` — URL params-аас `to` уншиж бөглөх
- `index.html` — Title "Rural Transport"
- `src/index.css` — Нэмэлт animation, дизайн class-ууд

