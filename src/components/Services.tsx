import React from 'react';
import { User, Users, Video, Utensils, Clock, CheckCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: User,
      title: 'Personal Training',
      price: '$80/session',
      description: 'One-on-one personalized training sessions tailored to your specific goals and fitness level.',
      features: [
        'Customized workout plans',
        'Form correction & technique',
        'Progress tracking',
        'Flexible scheduling',
        'Nutritional guidance'
      ],
      popular: true
    },
    {
      icon: Users,
      title: 'Small Group Training',
      price: '$45/session',
      description: 'Train with 2-4 people in a motivating group environment while receiving personalized attention.',
      features: [
        'Groups of 2-4 people',
        'Cost-effective training',
        'Social motivation',
        'Varied workout styles',
        'Team building'
      ],
      popular: false
    },
    {
      icon: Video,
      title: 'Virtual Training',
      price: '$60/session',
      description: 'Get professional training from anywhere with live virtual sessions via video call.',
      features: [
        'Train from home',
        'Live video sessions',
        'Equipment adaptations',
        'Digital workout plans',
        'Progress monitoring'
      ],
      popular: false
    },
    {
      icon: Utensils,
      title: 'Nutrition Coaching',
      price: '$120/month',
      description: 'Comprehensive nutrition guidance to complement your training and accelerate results.',
      features: [
        'Personalized meal plans',
        'Macro tracking guidance',
        'Supplement recommendations',
        'Weekly check-ins',
        'Recipe suggestions'
      ],
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Training Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the perfect training option that fits your lifestyle, goals, and budget. All services include ongoing support and progress tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                service.popular ? 'ring-2 ring-emerald-500 transform scale-105' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${service.popular ? 'pt-12' : ''}`}>
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <service.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{service.title}</h3>
                  <div className="text-3xl font-bold text-emerald-600">{service.price}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#intake"
                  className={`w-full py-3 px-4 rounded-lg font-medium text-center block transition-colors duration-200 ${
                    service.popular
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <Clock className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Free Consultation Available
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Not sure which service is right for you? Book a free 30-minute consultation to discuss your goals and find the perfect training solution.
          </p>
          <a
            href="#contact"
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors duration-200 inline-block"
          >
            Schedule Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;