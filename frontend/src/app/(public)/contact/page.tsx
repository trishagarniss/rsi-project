import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-asgard-pale font-sans antialiased text-slate-900 flex flex-col selection:bg-asgard-secondary selection:text-asgard-primary">
      
      {/* ================= HEADER (Sinkron dengan Home & About) ================= */}
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
            <Link href="/about" className="text-white/80 hover:text-white transition-colors duration-200">
              About Us
            </Link>
            {/* Active State Emas untuk halaman Contact */}
            <Link href="/contact" className="text-asgard-secondary transition-colors duration-200">
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
      <main className="flex-grow w-full relative">
        
        {/* Dark Banner Background (Memberikan efek elegan di belakang) */}
        <div className="absolute top-0 left-0 w-full h-[450px] bg-asgard-primary -z-10 rounded-b-[3rem] shadow-xl overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-asgard-secondary/5 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute bottom-0 left-10 w-64 h-64 bg-asgard-secondary/10 rounded-full blur-[80px] pointer-events-none" />
        </div>

        <div className="max-w-[1400px] mx-auto px-8 xl:px-12 pt-20 pb-24">
          
          {/* Page Title */}
          <div className="text-center mb-16 space-y-4">
            <h4 className="text-asgard-secondary font-bold uppercase tracking-widest text-sm">Get In Touch</h4>
            <h1 className="text-4xl md:text-5xl font-black text-asgard-primary">
              Hubungi Tim Kami
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Punya pertanyaan mengenai sistem kami? Silakan kirimkan pesan, dan tim ahli kami akan segera menghubungi Anda kembali.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* --- KIRI: Informasi Kontak (Mini Cards) --- */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              
              {/* Card 1: Alamat */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex gap-5 items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="h-12 w-12 rounded-full bg-asgard-pale flex items-center justify-center flex-shrink-0 group-hover:bg-asgard-secondary/20 transition-colors">
                  <svg className="w-6 h-6 text-asgard-primary group-hover:text-asgard-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h3 className="font-black text-asgard-primary mb-1">Kantor Pusat</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Jl. Ir. Sutami No. 36A<br />
                    Kentingan, Jebres, Surakarta<br />
                    Jawa Tengah 57126
                  </p>
                </div>
              </div>

              {/* Card 2: Kontak */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex gap-5 items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="h-12 w-12 rounded-full bg-asgard-pale flex items-center justify-center flex-shrink-0 group-hover:bg-asgard-secondary/20 transition-colors">
                  <svg className="w-6 h-6 text-asgard-primary group-hover:text-asgard-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h3 className="font-black text-asgard-primary mb-1">Telepon & Email</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    +62 823-2248-4753<br />
                    support@asgard.id
                  </p>
                </div>
              </div>

              {/* Card 3: Jam Operasional */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex gap-5 items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="h-12 w-12 rounded-full bg-asgard-pale flex items-center justify-center flex-shrink-0 group-hover:bg-asgard-secondary/20 transition-colors">
                  <svg className="w-6 h-6 text-asgard-primary group-hover:text-asgard-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 className="font-black text-asgard-primary mb-1">Jam Operasional</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Senin - Jumat: 08:00 - 17:00<br />
                    Sabtu: 09:00 - 13:00<br />
                    Minggu & Libur Nasional: Tutup
                  </p>
                </div>
              </div>

            </div>

            {/* --- KANAN: Formulir Kontak (Floating Card) --- */}
            <div className="w-full lg:w-2/3 bg-white p-10 lg:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
              <h2 className="text-3xl font-black text-asgard-primary mb-2">Kirim Pesan Langsung</h2>
              <p className="text-slate-500 font-medium mb-10">Isi form di bawah ini dan kami akan membalas via Email.</p>
              
              <form className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Contoh: Kunto Hidayat"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-asgard-secondary focus:border-asgard-secondary transition-all"
                    />
                  </div>
                  
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Alamat Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      placeholder="contoh@email.com"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-asgard-secondary focus:border-asgard-secondary transition-all"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Subjek <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Apa yang ingin Anda tanyakan?"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-asgard-secondary focus:border-asgard-secondary transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Pesan Anda <span className="text-red-500">*</span></label>
                  <textarea
                    rows={5}
                    placeholder="Tuliskan detail pertanyaan atau masalah Anda di sini..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-asgard-secondary focus:border-asgard-secondary resize-none transition-all"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="button" /* Diubah jadi button sementara agar tidak nge-refresh web saat di-klik */
                  className="w-full md:w-auto px-10 py-4 bg-asgard-secondary text-asgard-primary rounded-xl font-black text-lg hover:bg-asgard-accent hover:shadow-[0_10px_20px_rgba(255,193,7,0.3)] hover:-translate-y-1 transition-all duration-300"
                >
                  Kirim Pesan Sekarang
                </button>

              </form>
            </div>

          </div>
        </div>
      </main>

      {/* ================= FOOTER (Sinkron dengan Home & About) ================= */}
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