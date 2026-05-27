import React from 'react';

const AboutUs = () => {
  // Palette Mapping
  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Hero Header */}
      <div className="py-20 text-white relative overflow-hidden" style={{ backgroundColor: colors.deepEmerald }}>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-extrabold mb-4">Our Commitment to Growth</h1>
          <p className="text-xl opacity-80 max-w-2xl">
            Cultivating a digital ecosystem where technology meets tradition to empower every farmer in the nation.
          </p>
        </div>
        {/* Subtle Background Pattern Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 transform translate-x-10 -translate-y-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.1,-69.2,69.2,-57.1,76.4,-43.3C83.6,-29.5,86.9,-14.8,85.5,-0.8C84.1,13.2,78.1,26.4,70.1,38.7C62.1,51,52.1,62.4,39.7,70.5C27.3,78.6,12.6,83.4,-1.8,86.5C-16.1,89.5,-32.2,90.8,-46.1,84.1C-60,77.4,-71.7,62.8,-79.3,47.1C-86.9,31.4,-90.4,14.7,-88.7,-1.5C-87,-17.7,-80.1,-33.4,-69.9,-45.8C-59.7,-58.2,-46.2,-67.3,-32.2,-74.1C-18.2,-80.9,-3.7,-85.4,10.5,-83.4C24.7,-81.4,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Mission Text Field Area */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2" style={{ backgroundColor: colors.softMint, color: colors.deepEmerald }}>
                The AgriGov Mission
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.deepEmerald }}>
                Bridging the Gap Between <br />Policy and the Soil
              </h2>
              <div className="text-lg leading-relaxed text-slate-600 space-y-4">
                <p>
                  AgriGov was established to serve as the definitive digital bridge for the agricultural community. Our platform simplifies complex governmental processes, providing a transparent and efficient way for farmers to access critical resources.
                </p>
                <p>
                  By leveraging real-time data analytics and modern web architecture, we ensure that information regarding crop subsidies, weather patterns, and sustainable practices is not just available, but accessible to everyone, from small-scale family farms to large agricultural cooperatives.
                </p>
              </div>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Transparency', desc: 'Real-time tracking of project funds and government initiatives.' },
                { title: 'Sustainability', desc: 'Promoting methods that protect our soil for future generations.' },
                { title: 'Innovation', desc: 'Integrating modern AI and data tools into traditional farming.' },
                { title: 'Inclusivity', desc: 'Designed for accessibility across all regions and devices.' }
              ].map((value, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors bg-slate-50/50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: colors.vibrantGreen }}>
                    <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
                  </div>
                  <h4 className="font-bold mb-2 text-slate-800">{value.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Farmers Reached', val: '2M+' },
            { label: 'Active Projects', val: '450' },
            { label: 'Grants Awarded', val: '$1.2B' },
            { label: 'Regions Covered', val: '100%' }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-black mb-1" style={{ color: colors.deepEmerald }}>{stat.val}</p>
              <p className="text-sm font-bold opacity-50 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer-like CTA */}
      <div className="container mx-auto px-6 pb-20">
        <div style={{ backgroundColor: colors.cloudGrey }} className="rounded-3xl p-12 text-center border border-white/40">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.deepEmerald }}>Ready to grow with us?</h3>
          <p className="mb-8 text-slate-600">Join thousands of farmers receiving weekly updates on new grants and technology.</p>
          <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 rounded-full text-white font-bold shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: colors.vibrantGreen }}>
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;