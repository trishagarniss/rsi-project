// 1. IMPORT IMAGE WAJIB DI ATAS
import Image from 'next/image';
import Link from 'next/link';

// Komponen reusable untuk Kotak Statistik di Hero
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col justify-center border-l-2 border-asgard-secondary/30 pl-6 relative z-10">
    <div className="text-asgard-secondary font-black text-3xl md:text-4xl leading-none tracking-tight">
      {value}
    </div>
    <div className="text-sm text-white/70 font-bold mt-2 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default function AsgardHomePage() {
  return (
    <div className="min-h-screen bg-asgard-pale font-sans antialiased text-slate-900 flex flex-col selection:bg-asgard-secondary selection:text-asgard-primary">
      
      {/* ================= HEADER ================= */}
      <header className="absolute top-0 w-full z-50 bg-asgard-primary/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto h-[90px] flex items-center px-8 xl:px-12">
          {/* Logo */}
          <div className="flex items-center gap-4 text-white font-semibold cursor-pointer group">
            <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center text-xl font-black text-asgard-primary group-hover:scale-105 transition-transform duration-300">
              A
            </div>
            <span className="tracking-widest text-lg font-bold">A.S.G.A.R.D</span>
          </div>

          {/* Navigasi */}
          <nav className="ml-auto hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-wider">
            <Link href="/" className="text-asgard-secondary transition-colors duration-200">
              Home
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors duration-200">
              About Us
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors duration-200">
              Contact
            </Link>
            <Link
              href="/login"
              className="ml-4 bg-asgard-secondary text-asgard-primary px-8 py-3 rounded-md hover:bg-asgard-accent transition-all duration-300 font-black shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

{/* ================= HERO SECTION (FOTO BACKGROUND + LAYERING) ================= */}
      <section className="relative w-full pt-[150px] pb-24 lg:pt-[200px] lg:pb-32 px-8 xl:px-12 flex items-center overflow-hidden">
        
        {/* --- LAYER 1: GAMBAR ASLI --- */}
        {/* Menggunakan z-0 agar tepat berada di dasar section ini */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/hero-bg.jpg" /* <-- PASTIKAN NAMANYA SUDAH SAMA DENGAN YANG KAMU RENAME */
            alt="Abstract artistic background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* --- LAYER 2: OVERLAY NAVY GELAP + BLUR --- */}
        {/* Menggunakan z-10 agar berada di atas gambar. Blur saya tingkatkan sedikit agar teks makin jelas */}
        <div className="absolute inset-0 bg-asgard-primary/80 backdrop-blur-[1px] z-10 pointer-events-none" />

        {/* Dekorasi Gradient Tambahan */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-asgard-secondary/20 rounded-full blur-3xl pointer-events-none z-10" />

        {/* --- LAYER 3: KONTEN TEKS & DASHBOARD --- */}
        {/* Menggunakan z-20 agar teks dan dashboard berada paling depan */}
        <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 xl:gap-24 relative z-20">
          
          {/* Teks Kiri */}
          <div className="flex-1 space-y-8">
            {/* Teks putih akan sangat kontras berkat overlay navy gelap di layer 2 */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Deteksi Dini Risiko <br />
              <span className="text-asgard-secondary">Putus Sekolah.</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed font-medium">
              "Shaping Confident Learners For A Global Future" melalui analisis data yang komprehensif, memungkinkan intervensi dini yang efektif dan tepat sasaran.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button className="px-8 py-4 rounded-md bg-asgard-secondary text-asgard-primary text-lg font-black shadow-lg hover:bg-asgard-accent hover:-translate-y-1 transition-all duration-300">
                Discover More →
              </button>
            </div>

            {/* Statistik Bawah Teks */}
            <div className="flex items-center gap-10 pt-10 border-t border-white/10 mt-8 relative z-10">
              <StatCard label="Siswa Beresiko" value="1.908" />
              <StatCard label="Akurasi Prediksi" value="99.9%" />
            </div>
          </div>

          {/* Kanan - Dashboard Preview (Pertahankan dari sebelumnya) */}
          {/* perspective-1000 untuk efek 3D hover yang lebih terasa */}
          <div className="w-full lg:w-[600px] flex-shrink-0 group perspective-1000">
            {/* Perbaikan rotate-x-2 menjadi -rotate-x-2 agar sesuai dengan efek 'angkat' hover */}
            <div className="aspect-[4/3] w-full rounded-xl bg-white border-4 border-white/10 shadow-2xl overflow-hidden transition-transform duration-700 hover:rotate-y-2 hover:-rotate-x-2 relative flex flex-col">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-black text-asgard-primary uppercase tracking-wider">Overview System</h3>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="flex-1 p-6 bg-slate-50 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="h-24 flex-1 bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                     <p className="text-xs text-slate-400 font-bold uppercase">Total Siswa</p>
                     <p className="text-3xl font-black text-asgard-primary mt-1">5,432</p>
                  </div>
                  <div className="h-24 flex-1 bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                     <p className="text-xs text-slate-400 font-bold uppercase">Beresiko Tinggi</p>
                     <p className="text-3xl font-black text-red-500 mt-1">128</p>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-100 p-4 overflow-hidden">
                  <h4 className="text-xs font-black text-slate-800 mb-3 uppercase">Peringatan Kritis</h4>
                  <div className="h-8 bg-slate-50 rounded mb-2 border border-slate-100 flex items-center px-3 justify-between">
                     <span className="text-xs font-bold text-slate-600">Kunto Hidayat</span>
                     <span className="text-xs font-bold text-red-500">98% Risk</span>
                  </div>
                  <div className="h-8 bg-slate-50 rounded border border-slate-100 flex items-center px-3 justify-between overflow-hidden">
                     <span className="text-xs font-bold text-slate-600 truncate">Putri Salsa Wahningyun Garnish</span>
                     <span className="text-xs font-bold text-red-500 flex-shrink-0 ml-2">94% Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: DISCOVER OUR SYSTEM ================= */}
      {/* Pertahankan section ini tetap putih untuk kontras yang baik setelah dark hero */}
      <section className="bg-white py-24 px-8 xl:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h4 className="text-asgard-secondary font-bold uppercase tracking-widest text-sm">Discover Our System</h4>
            <h2 className="text-4xl md:text-5xl font-black text-asgard-primary leading-tight">
              A Legacy of <br /> Educational Excellence
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              A.S.G.A.R.D is more than just a monitoring tool — it's a place where curiosity meets opportunity, and where every student's story matters. Here, we believe in holistic education that balances academic excellence with character development.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              We prepare our students not just for exams, but for life. Providing early intervention to ensure no student is left behind in their educational journey.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="border-l-4 border-asgard-secondary pl-4">
                <h5 className="font-black text-asgard-primary">Our Vision</h5>
                <p className="text-sm text-slate-500 mt-1">To impart high-quality monitoring for a better society.</p>
              </div>
              <div className="border-l-4 border-asgard-primary pl-4">
                <h5 className="font-black text-asgard-primary">Core Values</h5>
                <p className="text-sm text-slate-500 mt-1">Reverence, Resilience, and Preeminence in all endeavors.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
             <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden relative border border-slate-100">
               {/* Placeholder untuk foto ilustrasi */}
               <div className="absolute inset-0 bg-asgard-primary/5 flex items-center justify-center text-slate-400 font-bold text-xl">
                 [Image / Illustration Placeholder]
               </div>
             </div>
             {/* Floating Card */}
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs">
               <h5 className="font-black text-asgard-primary flex items-center gap-2">
                 ⭐ The Difference
               </h5>
               <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                 We focus on individualized learning, catering to unique styles and technological advancements.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: KEY FEATURES / PATHWAYS ================= */}
      <section className="bg-asgard-pale py-24 px-8 xl:px-12 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto text-center space-y-4 mb-16">
           <h4 className="text-asgard-secondary font-bold uppercase tracking-widest text-sm">Academic Programs</h4>
           <h2 className="text-4xl md:text-5xl font-black text-asgard-primary">Our Key Features</h2>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col text-center pb-8 group">
            <div className="h-56 bg-slate-200 w-full p-4 overflow-hidden">
              <div className="w-full h-full bg-slate-300 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:scale-105 transition-transform duration-500">Image 1</div>
            </div>
            <div className="px-8 pt-8 flex-1 flex flex-col">
              <h4 className="text-asgard-secondary font-bold uppercase tracking-wider text-sm mb-2">Early Warning</h4>
              <h3 className="text-2xl font-black text-asgard-primary mb-4">Deteksi Dini</h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Sistem berbasis algoritma cerdas yang memantau gejala awal risiko putus sekolah secara real-time.
              </p>
              <button className="mt-8 text-asgard-primary font-black uppercase text-sm tracking-wider hover:text-asgard-accent transition-colors">
                Explore Feature →
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col text-center pb-8 group">
            <div className="h-56 bg-slate-200 w-full p-4 overflow-hidden">
              <div className="w-full h-full bg-slate-300 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:scale-105 transition-transform duration-500">Image 2</div>
            </div>
            <div className="px-8 pt-8 flex-1 flex flex-col">
              <h4 className="text-asgard-secondary font-bold uppercase tracking-wider text-sm mb-2">Integration</h4>
              <h3 className="text-2xl font-black text-asgard-primary mb-4">Data Terpusat</h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Mengintegrasikan data akademik dan non-akademik siswa dalam satu dashboard yang mudah dipahami.
              </p>
              <button className="mt-8 text-asgard-primary font-black uppercase text-sm tracking-wider hover:text-asgard-accent transition-colors">
                Explore Feature →
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col text-center pb-8 group">
            <div className="h-56 bg-slate-200 w-full p-4 overflow-hidden">
              <div className="w-full h-full bg-slate-300 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:scale-105 transition-transform duration-500">Image 3</div>
            </div>
            <div className="px-8 pt-8 flex-1 flex flex-col">
              <h4 className="text-asgard-secondary font-bold uppercase tracking-wider text-sm mb-2">Intervention</h4>
              <h3 className="text-2xl font-black text-asgard-primary mb-4">Aksi Cepat</h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Memberikan rekomendasi intervensi otomatis kepada guru dan konselor untuk pencegahan dini.
              </p>
              <button className="mt-8 text-asgard-primary font-black uppercase text-sm tracking-wider hover:text-asgard-accent transition-colors">
                Explore Feature →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-asgard-primary pt-16 pb-8 border-t-4 border-asgard-secondary">
        <div className="max-w-[1400px] mx-auto px-8 xl:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
             <div className="h-8 w-8 rounded-sm bg-white text-asgard-primary flex items-center justify-center font-black text-sm">A</div>
             <span className="font-bold tracking-widest text-sm">A.S.G.A.R.D © 2026</span>
          </div>
          <div className="text-white/60 text-sm font-medium">
            Sistem Deteksi Dini Risiko Putus Sekolah
          </div>
        </div>
      </footer>

    </div>
  );
}