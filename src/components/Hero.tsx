import React from 'react';
import { useCMS } from '../contexts/CMSContext';
import { ArrowRight, Star, Award, Users } from 'lucide-react';

const Hero = () => {
  const { getSiteContent } = useCMS();

  const heroTitle = getSiteContent('hero', 'title') || 'Transform Your Body, Transform Your Life';
  const heroSubtitle = getSiteContent('hero', 'subtitle') || 'Professional personal training with proven results. I help busy professionals achieve their fitness goals through personalized workout plans, nutrition guidance, and unwavering support.';
  const heroImage = getSiteContent('hero', 'heroImage') || 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800';
  const heroVideo = getSiteContent('hero', 'heroVideo') || '';
  const heroMediaType = getSiteContent('hero', 'heroMediaType') || 'image';
  const ctaText = getSiteContent('hero', 'ctaText') || 'Start Your Journey';
  const secondaryCtaText = getSiteContent('hero', 'secondaryCtaText') || 'Learn More';

  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-slate-50 to-astros-orange/10 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-astros-navy leading-tight">
                {heroTitle.split(',').map((part, index) => (
                  <span key={index} className={index === 1 ? 'text-astros-orange block' : ''}>
                    {part}{index === 0 ? ',' : ''}
                  </span>
                ))}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                {heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#intake"
                className="bg-astros-orange hover:bg-astros-orange-dark text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {ctaText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#about"
                className="border-2 border-astros-orange text-astros-orange hover:bg-astros-orange hover:text-white px-8 py-4 rounded-lg font-semibold text-lg text-center transition-all duration-200"
              >
                {secondaryCtaText}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-astros-orange" />
                </div>
                <div className="text-2xl font-bold text-astros-navy">200+</div>
                <div className="text-sm text-slate-600">Clients Trained</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="w-8 h-8 text-astros-orange" />
                </div>
                <div className="text-2xl font-bold text-astros-navy">5+</div>
                <div className="text-sm text-slate-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="w-8 h-8 text-astros-orange" />
                </div>
                <div className="text-2xl font-bold text-astros-navy">4.9</div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {heroMediaType === 'video' && heroVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-[600px] object-cover"
                  poster={heroImage}
                >
                  <source src={heroVideo} type="video/mp4" />
                  <source src={heroVideo} type="video/webm" />
                  <img
                    src={heroImage}
                    alt="Professional trainer working with client"
                    className="w-full h-[600px] object-cover"
                  />
                </video>
              ) : (
                <img
                  src={heroImage}
                  alt="Professional trainer working with client"
                  className="w-full h-[600px] object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-astros-navy/20 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-astros-orange/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-astros-orange" />
                </div>
                <div>
                  <div className="font-semibold text-astros-navy">Certified Trainer</div>
                  <div className="text-sm text-slate-600">NASM & ACE Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;