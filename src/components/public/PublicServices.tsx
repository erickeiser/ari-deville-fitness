import React from 'react';
import { User, Users, Video, Utensils, Clock, CheckCircle } from 'lucide-react';
import servicesData from '../data/services.json';

const iconMap = {
  User,
  Users,
  Video,
  Utensils,
  Clock
};

const PublicServices = () => {
  const services = servicesData.filter(service => service.active);

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-astros-navy">
            Training Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the perfect training option that fits your lifestyle, goals, and budget. All services include ongoing support and progress tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || User;
            
            return (
              <div
                key={service.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  service.popular ? 'ring-2 ring-astros-orange transform scale-105' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-astros-orange text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${service.popular ? 'pt-12' : ''}`}>
                  <div className="text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-astros-orange/10 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-8 h-8 text-astros-orange" />
                    </div>
                    <h3 className="text-xl font-bold text-astros-navy">{service.title}</h3>
                    <div className="text-3xl font-bold text-astros-orange">{service.price}</div>
                    <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-astros-orange mr-3 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#intake"
                    className={`w-full py-3 px-4 rounded-lg font-medium text-center block transition-colors duration-200 ${
                      service.popular
                        ? 'bg-astros-orange hover:bg-astros-orange-dark text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-astros-navy'
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-astros-orange to-astros-orange-dark rounded-2xl p-8 md:p-12 text-center text-white">
          <Clock className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Free Consultation Available
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Not sure which service is right for you? Book a free 30-minute consultation to discuss your goals and find the perfect training solution.
          </p>
          <a
            href="#contact"
            className="bg-white text-astros-orange px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors duration-200 inline-block"
          >
            Schedule Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
};

export default PublicServices;