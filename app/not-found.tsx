"use client";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-[88vh] bg-linear-to-br from-pink-200 via-purple-100 to-indigo-200 p-6 font-sans">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/40">
        

        <h1 className="text-5xl font-extrabold text-indigo-600 tracking-wider drop-shadow-sm">
          404
        </h1>

        <p className="mt-3 text-gray-600 text-lg">
          Oops! The page you’re looking for is lost in space.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href="/"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl shadow-lg transition-all text-lg font-semibold"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
