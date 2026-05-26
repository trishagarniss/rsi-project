export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-[#161D6F] h-[86px] flex items-center px-20">
        <div className="text-white text-2xl font-bold">RSI</div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-86px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#161D6F] mb-2">Login</h1>
            <p className="text-gray-600 mb-6">Masuk ke akun Anda</p>

            <form className="space-y-4">
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161D6F]"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-700">Ingat saya</span>
                </label>
                <a href="#" className="text-[#161D6F] hover:underline">
                  Lupa password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#98DED9] text-[#161D6F] py-2 rounded-lg font-semibold hover:bg-[#7ad3ce] transition"
              >
                Masuk
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-600 mt-6">
              Belum punya akun?{' '}
              <a href="/register" className="text-[#161D6F] font-semibold hover:underline">
                Daftar di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
