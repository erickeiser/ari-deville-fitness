import React from 'react';
import { User, Mail, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-astros-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-astros-orange rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">Ari Deville Fitness</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Helping busy professionals transform their lives through personalized fitness training and nutrition coaching.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-astros-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-astros-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-astros-orange transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-slate-300 hover:text-astros-orange transition-colors">Home</a>
              <a href="#about" className="block text-slate-300 hover:text-astros-orange transition-colors">About</a>
              <a href="#services" className="block text-slate-300 hover:text-astros-orange transition-colors">Services</a>
              <a href="#videos" className="block text-slate-300 hover:text-astros-orange transition-colors">Success Stories</a>
              <a href="#intake" className="block text-slate-300 hover:text-astros-orange transition-colors">Get Started</a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <div className="text-slate-300">Personal Training</div>
              <div className="text-slate-300">Small Group Training</div>
              <div className="text-slate-300">Virtual Training</div>
              <div className="text-slate-300">Nutrition Coaching</div>
              <div className="text-slate-300">Free Consultation</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-astros-orange mr-3 flex-shrink-0" />
                <span className="text-slate-300">ari@aridevillefitness.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-astros-orange mr-3 flex-shrink-0" />
                <span className="text-slate-300">(555) 123-4567</span>
              </div>
              <div className="text-slate-300 text-sm">
                <div className="font-medium text-white mb-2">Hours:</div>
                <div>Mon-Fri: 6:00 AM - 8:00 PM</div>
                <div>Sat: 7:00 AM - 6:00 PM</div>
                <div>Sun: 8:00 AM - 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-300 text-sm">
              © 2025 Ari Deville Fitness. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-300 hover:text-astros-orange text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-300 hover:text-astros-orange text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-300 hover:text-astros-orange text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;