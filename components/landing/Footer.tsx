export default function Footer() {
  return (
    <footer className="py-12 px-6 sm:px-8 lg:px-12 bg-slate-900/5 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <span className="text-slate-900 font-semibold">ChatWalrus</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          <div className="text-sm text-slate-500">
            © 2024 ChatWalrus. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

