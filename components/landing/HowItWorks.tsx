export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center mb-6 float-animation">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <div className="text-sm font-semibold text-cyan-600 mb-2 uppercase tracking-wide">Step 1</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Scrape Engagement</h3>
            <p className="text-slate-600 leading-relaxed">We scrape all profiles who liked and commented on your LinkedIn post.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-6 float-animation" style={{ animationDelay: '0.2s' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="text-sm font-semibold text-teal-600 mb-2 uppercase tracking-wide">Step 2</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Filter & Enrich</h3>
            <p className="text-slate-600 leading-relaxed">We filter for founders and decision-makers, then enrich their profiles with complete data.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-6 float-animation" style={{ animationDelay: '0.4s' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="text-sm font-semibold text-sky-600 mb-2 uppercase tracking-wide">Step 3</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Launch Campaign</h3>
            <p className="text-slate-600 leading-relaxed">AI generates personalized messages and we launch your campaign through HeyReach.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
