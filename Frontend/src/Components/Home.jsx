import React from 'react';
import bghome from "../images/bghome.png"; // Ensure this image is in the correct path
import { Link } from 'react-router-dom';
const Home = () => {
  // Palette Mapping
  // Deep Emerald: #135E4B
  // Vibrant Green: #4CB572
  // Soft Mint: #A1D8B5
  // Cloud Grey: #CCDCDB

  return (
    <div className="min-h-screen font-sans text-slate-800" style={{ backgroundColor: '#CCDCDB' }}>
      
      {/* Navigation */}
      <nav style={{ backgroundColor: '#135E4B' }} className="text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span style={{ color: '#135E4B' }} className="font-bold">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">AGRIGOV</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/programs" className="hover:opacity-80">Programs</Link>
            <Link to="/aboutus" className="hover:opacity-80">About Us</Link>

          </div>
          <button
            onClick={() => window.location.href = '/login'}
          style={{ backgroundColor: '#4CB572' }} className="px-4 py-2 rounded font-semibold text-sm hover:brightness-110 transition-all">
            Farmer Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto py-16 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight" style={{ color: '#135E4B' }}>
            Empowering Agriculture, <br />
            <span className="opacity-80">Nurturing Community.</span>
          </h1>
          <p className="text-lg opacity-90 max-w-md">
            Your official portal for professional, accessible agricultural resources, grants, and sustainable farming insights.
          </p>
          <button
          onClick={() => window.location.href = '/login'}
           style={{ backgroundColor: '#135E4B' }} className="text-white px-8 py-3 rounded-md font-bold shadow-md hover:opacity-90">
            Apply Now
          </button>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          {/* Abstract SVG or Placeholder representing the farm visual from the image */}
          <div className="w-full h-64 rounded-3xl opacity-40 blur-3xl absolute -z-10" style={{ backgroundColor: '#A1D8B5' }}></div>
          <img 
            src={bghome} 
            alt="Agriculture Illustration" 
            className="w-full h-auto max-w-md mx-auto"
          />
        </div>
      </header>

      {/* Service Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Apply for Rural Schemes', desc: 'Financial support for sustainable growth.', icon: '🌱' },
            { title: 'Audit and Reporting', desc: 'Real-time analytics for better yields.', icon: '📊' },
            { title: 'Program Management', desc: 'Discover the latest programs by Government.', icon: '🌍' }
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: '#A1D8B5' }} className="p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#135E4B' }}>{item.title}</h3>
              <p className="text-sm mb-6 opacity-80">{item.desc}</p>
              <button className="text-sm font-bold underline" style={{ color: '#135E4B' }}>Learn more</button>
            </div>
          ))}
        </div>
      </section>

      {/* Updates Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: '#135E4B' }}>Latest Agricultural Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((post) => (
              <div key={post} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <div style={{ backgroundColor: '#CCDCDB' }} className="h-32 p-4">
                  <span className="text-xs font-bold opacity-60">MARCH 11, 2026</span>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2">New Grant Opportunities Announced</h4>
                  <p className="text-sm text-slate-600 mb-4">The national agricultural fund has released the latest criteria for 2026...</p>
                  <Link to="/updates" style={{ color: '#4CB572' }} className="text-sm font-bold">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#135E4B' }} className="text-white py-12 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/10 pb-8">
          <div>
            <h4 className="font-bold text-xl mb-4">AGRIGOV</h4>
            <p className="text-sm opacity-60 leading-relaxed">
              Official portal for national agricultural growth and farmer support systems.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">Quick Links</h5>
            <ul className="text-sm space-y-2 opacity-60">
              <li>About Us</li>
              <li>Programs</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Support</h5>
            <ul className="text-sm space-y-2 opacity-60">
              <li>Phone : 9999999999</li>
              <li>Toll Free: 1800-123-4567</li>
              <li>Email: support@agrigov.gov</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Newsletter</h5>
            <div className="flex">
              <input type="text" placeholder="Email" className="p-2 rounded-l w-full text-slate-800" />
              <button style={{ backgroundColor: '#4CB572' }} className="p-2 rounded-r">Join</button>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 text-xs opacity-40">
          &copy; 2026 AgriGov. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;