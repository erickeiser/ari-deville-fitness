import React from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Play, Quote, Star } from 'lucide-react';

const PublicTestimonials = () => {
  const { testimonials } = useCMS();
  const activeTestimonials = testimonials.filter(testimonial => testimonial.active);

  return (
    <section id="videos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-astros-navy">
            Client Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See real transformations from real people. These are just a few of the amazing journeys I've had the privilege to be part of.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {activeTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative group cursor-pointer">
                <img
                  src={testimonial.videoThumb}
                  alt={`${testimonial.name} transformation video`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 text-astros-orange ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-astros-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                  {testimonial.results}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-astros-navy">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.title}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-astros-orange fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-astros-orange/20 absolute -top-2 -left-2" />
                  <p className="text-slate-600 italic pl-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-astros-orange/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-astros-navy">
                Ready to Write Your Success Story?
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Join hundreds of clients who have transformed their lives through personalized training. Your journey to better health and confidence starts with a single step.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-astros-orange rounded-full mr-4"></div>
                  <span className="text-slate-700">Personalized approach for every fitness level</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-astros-orange rounded-full mr-4"></div>
                  <span className="text-slate-700">Proven methods with measurable results</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-astros-orange rounded-full mr-4"></div>
                  <span className="text-slate-700">Ongoing support throughout your journey</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Success transformation"
                className="w-full rounded-xl shadow-lg mb-6"
              />
              <a
                href="#intake"
                className="bg-astros-orange hover:bg-astros-orange-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
              >
                Start Your Transformation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicTestimonials;