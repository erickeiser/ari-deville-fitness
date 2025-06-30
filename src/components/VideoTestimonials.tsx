import React from 'react';
import { Play, Quote, Star } from 'lucide-react';

const VideoTestimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      title: 'Marketing Manager',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoThumb: 'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'Lost 30 pounds in 4 months while building the strongest I\'ve ever been. Alex\'s approach is sustainable and actually enjoyable!',
      rating: 5,
      results: 'Lost 30 lbs | Gained Confidence'
    },
    {
      name: 'Michael Rodriguez',
      title: 'Software Engineer',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoThumb: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'As a busy dad, I thought I\'d never find time for fitness. Alex helped me create a routine that works with my schedule.',
      rating: 5,
      results: 'Built Muscle | Better Energy'
    },
    {
      name: 'Jessica Thompson',
      title: 'Teacher',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoThumb: 'https://images.pexels.com/photos/4058316/pexels-photo-4058316.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'After my injury, I was afraid to exercise. Alex guided me back to full strength safely and confidently.',
      rating: 5,
      results: 'Injury Recovery | Strength Gained'
    }
  ];

  return (
    <section id="videos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Client Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See real transformations from real people. These are just a few of the amazing journeys I've had the privilege to be part of.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative group cursor-pointer">
                <img
                  src={testimonial.videoThumb}
                  alt={`${testimonial.name} transformation video`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 text-emerald-600 ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                    <div className="font-semibold text-slate-800">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.title}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-emerald-200 absolute -top-2 -left-2" />
                  <p className="text-slate-600 italic pl-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                Ready to Write Your Success Story?
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Join hundreds of clients who have transformed their lives through personalized training. Your journey to better health and confidence starts with a single step.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                  <span className="text-slate-700">Personalized approach for every fitness level</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                  <span className="text-slate-700">Proven methods with measurable results</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
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

export default VideoTestimonials;