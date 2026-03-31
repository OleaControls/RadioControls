import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Store, Coffee, ShoppingCart, Activity } from 'lucide-react';

const companies = [
  { id: 1, name: 'H&M', type: 'Retail', vibe: 'Energetic & Pop', icon: <ShoppingCart />, color: 'bg-red-500' },
  { id: 2, name: 'Starbucks', type: 'Cafe', vibe: 'Acoustic & Jazz', icon: <Coffee />, color: 'bg-green-600' },
  { id: 3, name: 'Zara', type: 'Fashion', vibe: 'Deep House & Chic', icon: <Store />, color: 'bg-gray-800' },
  { id: 4, name: 'Nike', type: 'Sport', vibe: 'Upbeat & Electronic', icon: <Activity />, color: 'bg-orange-500' },
  { id: 5, name: 'Sephora', type: 'Beauty', vibe: 'Chill Pop & RnB', icon: <Store />, color: 'bg-purple-500' },
  { id: 6, name: 'Lululemon', type: 'Wellness', vibe: 'Yoga & Meditation', icon: <Activity />, color: 'bg-pink-400' },
];

const Companies = () => {
  const [activeCompany, setActiveCompany] = useState(null);

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
          Corporate Clients
        </h1>
        <p className="text-xl text-gray-400">Select a brand to preview their custom soundscape.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((company) => (
          <motion.div
            key={company.id}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 group cursor-pointer transition-all ${activeCompany === company.id ? 'ring-2 ring-cyan-500' : ''}`}
            onClick={() => setActiveCompany(company.id)}
          >
            <div className={`absolute top-0 left-0 w-full h-2 ${company.color}`} />
            
            <div className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-lg bg-gray-800 text-white`}>
                  {company.icon}
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded-full text-xs font-mono text-gray-400 uppercase">
                  {company.type}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {company.name}
              </h3>
              <p className="text-gray-400 mb-6">{company.vibe}</p>

              <button className="w-full py-3 bg-gray-800 hover:bg-cyan-500 hover:text-black rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-gray-700">
                <Play className="w-4 h-4 fill-current" />
                Play Mix
              </button>
            </div>

            {/* Background Glow Effect */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full filter blur-3xl opacity-20 ${company.color}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
