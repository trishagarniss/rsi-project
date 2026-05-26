import Link from 'next/link';

// --- DATA TIM ---
// Kamu bisa mengganti URL foto dengan foto asli teman-temanmu nanti (taruh foto di folder public)
const teamMembers = [
  {
    name: 'Trisha Garnish W.',
    role: 'Backend Developer',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 
  },
  {
    name: 'Kunto Rossindu H.',
    role: 'Frontend Developer',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Zaki Elias A.Q',
    role: 'Data Scientist',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Fathul Fajar Nur I.',
    role: 'UI/UX Designer',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Alvian Damar Budi',
    role: 'System Analyst',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-asgard-pale font-sans antialiased text-slate-900 flex flex-col selection:bg-asgard-secondary selection:text-asgard-primary">
      
      {/* ================= HEADER (Sinkron dengan Home) ================= */}
      <header className="sticky top-0 w-full z-50 bg-asgard-primary/95 backdrop-blur-md border-b border-white/10 transition-all duration-300">
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
            <Link href="/" className="text-white/80 hover:text-white transition-colors duration-200">
              Home
            </Link>
            {/* Active State Emas untuk halaman About */}
            <Link href="/about" className="text-asgard-secondary transition-colors duration-200">
              About Us
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors duration-200">
              Contact
            </Link>
            <Link
              href="/login"
              className="ml-4 bg-asgard-secondary text-asgard-primary px-8 py-3 rounded-md hover:bg-asgard-accent transition-all duration-300 font-black shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-8 xl:px-12 py-16 lg:py-24">
        
        {/* Title Section */}
        <div className="text-center mb-16 space-y-4">
          <h4 className="text-asgard-secondary font-bold uppercase tracking-widest text-sm">Behind The System</h4>
          <h1 className="text-4xl md:text-5xl font-black text-asgard-primary">
            Meet Our Contributors
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Sistem analisis prediktif ini dibangun oleh tim berdedikasi yang menggabungkan keahlian teknologi, sains data, dan desain antarmuka.
          </p>
        </div>

        {/* Team Cards Container (Dark Navy Box) */}
        <div className="bg-asgard-primary rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Background Glows */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-asgard-secondary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-asgard-secondary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Grid Layout for Team Members */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 justify-items-center mt-8">
            
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer w-full max-w-[260px]">
                
                {/* Photo Card Container */}
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white/10 relative shadow-xl group-hover:-translate-y-4 group-hover:border-asgard-secondary group-hover:shadow-[0_20px_40px_rgba(255,193,7,0.2)] transition-all duration-500">
                  
                  {/* Foto Asli (Efek Grayscale yang berubah warna saat di-hover) */}
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  />
                  
                  {/* Overlay Navy Transparan (Menghilang saat di-hover) */}
                  <div className="absolute inset-0 bg-asgard-primary/50 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500" />
                  
                  {/* Name Badge (Mengambang di bawah bingkai foto) */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-asgard-secondary text-asgard-primary px-4 py-2 rounded-t-xl text-sm font-black w-4/5 text-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    {member.name}
                  </div>
                </div>

                {/* Role/Position Badge (Kapsul Kaca di bawah kartu) */}
                <div className="mt-6 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-xs font-bold uppercase tracking-widest group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  {member.role}
                </div>

              </div>
            ))}
            
          </div>
        </div>

      </main>

      {/* ================= FOOTER (Sinkron dengan Home) ================= */}
      <footer className="w-full bg-asgard-primary pt-16 pb-8 border-t-4 border-asgard-secondary mt-auto">
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