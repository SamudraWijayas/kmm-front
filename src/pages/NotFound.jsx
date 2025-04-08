const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mt-4">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default NotFound;
