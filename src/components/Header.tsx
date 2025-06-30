import React, { useState } from 'react';
import { Menu, X, User, MessageCircle, Play, FileText, Home } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Services', href: '#services', icon: FileText },
    { name: 'Success Stories', href: '#videos', icon: Play },
    { name: 'Contact', href: '#contact', icon: MessageCircle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-astros-orange rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-astros-navy">Ari Deville Fitness</span>
            </div>
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-astros-orange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          <div className="hidden md:block">
            <a
              href="#intake"
              className="bg-astros-orange hover:bg-astros-orange-dark text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Get Started
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-astros-orange hover:bg-slate-100 focus:outline-none transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-astros-orange block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </a>
            ))}
            <a
              href="#intake"
              className="bg-astros-orange hover:bg-astros-orange-dark text-white block px-3 py-2 rounded-md text-base font-medium mt-4 text-center transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;