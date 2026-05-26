export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-[#161D6F] h-[86px] flex items-center px-20">
        <div className="text-white text-2xl font-bold">RSI</div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-86px)] py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#161D6F] mb-2">Pendaftaran Akun</h1>
            <p className="text-gray-600 mb-6">Buat akun baru Anda</p>

            <form className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161D6F]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161D6F]"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peran
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161D6F]">
                  <option>Pilih peran Anda</option>
                  <option>Guru</option>
                  <option>Konselor</option>
                  <option>Admin</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Buat password yang kuat"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161D6F]"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  placeholder="Konfirmasi password Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161D6F]"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start">
                <input type="checkbox" className="mr-2 mt-1" />
                <span className="text-sm text-gray-700">
                  Saya setuju dengan{' '}
                  <a href="#" className="text-[#161D6F] hover:underline">
                    syarat dan ketentuan
                  </a>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#98DED9] text-[#161D6F] py-2 rounded-lg font-semibold hover:bg-[#7ad3ce] transition"
              >
                Daftar
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6">
              Sudah punya akun?{' '}
              <a href="/login" className="text-[#161D6F] font-semibold hover:underline">
                Masuk di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
