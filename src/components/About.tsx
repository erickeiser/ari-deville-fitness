import React from 'react';
import { useCMS } from '../contexts/CMSContext';
import { Heart, Target, Zap, Shield } from 'lucide-react';

const About = () => {
  const { getSiteContent } = useCMS();

  const aboutTitle = getSiteContent('about', 'title') || 'Meet Your Dedicated Fitness Partner';
  const aboutDescription = getSiteContent('about', 'description') || 'Hi, I\'m Alex Johnson, a certified personal trainer with over 5 years of experience helping people transform their lives through fitness. My journey began when I overcame my own health challenges, and now I\'m passionate about guiding others on their path to wellness.';
  const trainerImage = getSiteContent('about', 'trainerImage') || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800';
  const trainerName = getSiteContent('about', 'trainerName') || 'Alex Johnson';
  const experience = getSiteContent('about', 'experience') || '5+';

  const values = [
    {
      icon: Heart,
      title: 'Passion for Fitness',
      description: 'Dedicated to helping you fall in love with fitness and make it a sustainable part of your lifestyle.'
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Every workout is strategically designed to get you closer to your specific fitness objectives.'
    },
    {
      icon: Zap,
      title: 'Proven Results',
      description: 'Track record of helping clients achieve remarkable transformations through science-based methods.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Prioritizing proper form and injury prevention while maximizing your workout effectiveness.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-astros-navy">
                {aboutTitle.split('Fitness Partner').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index === 0 && <span className="text-astros-orange block">Fitness Partner</span>}
                  </span>
                ))}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {aboutDescription}
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                I believe fitness isn't just about looking good – it's about feeling confident, energized, and living your best life. Whether you're a complete beginner or looking to break through plateaus, I'll meet you where you are and help you reach where you want to be.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-astros-navy">Certifications & Credentials</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium text-astros-navy">NASM-CPT</div>
                  <div className="text-sm text-slate-600">Certified Personal Trainer</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium text-astros-navy">ACE</div>
                  <div className="text-sm text-slate-600">Group Fitness Instructor</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium text-astros-navy">Precision Nutrition</div>
                  <div className="text-sm text-slate-600">Level 1 Coach</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium text-astros-navy">CPR/AED</div>
                  <div className="text-sm text-slate-600">First Aid Certified</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <img
                src={trainerImage}
                alt={`${trainerName} - Personal Trainer`}
                className="w-full rounded-2xl shadow-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-gradient-to-br from-astros-orange/5 to-white p-6 rounded-xl border border-astros-orange/20 hover:shadow-lg transition-shadow duration-200">
                  <div className="w-12 h-12 bg-astros-orange rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-astros-navy mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;