import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSection: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'Discover Campus Events',
      subtitle: 'Find and attend the best events happening around your campus',
      cta: 'Explore Events',
      link: '/events',
    },
    {
      id: 2,
      title: 'Create Your Own Events',
      subtitle: 'Organize events, sell tickets, and grow your club',
      cta: 'Start Now',
      link: '/login',
    },
    {
      id: 3,
      title: 'Connect With Your Community',
      subtitle: 'Network with students, faculty, and administrators',
      cta: 'Join Today',
      link: '/login',
    },
  ];

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.update();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative h-screen">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Video */}
   <div className="absolute inset-0 w-full h-full overflow-hidden">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  >
    <source
      src="https://res.cloudinary.com/dgmxpa36k/video/upload/f_auto,vc_auto,q_auto/video_mmmkgl.mp4"
      type="video/mp4"
    />
  </video>

  <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/70 to-primary-950/30"></div>
</div>



            {/* Centered Content */}
            <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-6 md:px-0 max-w-4xl mx-auto">
<h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
<p className="text-lg md:text-xl mb-8 text-neutral-200 max-w-xl">{slide.subtitle}</p>
              <Link
                to={slide.link}
                className="text-lg px-10 py-3 bg-[#d10000] hover:bg-[#b30000] text-white rounded-full font-semibold transition-colors shadow-lg"
              >
                {slide.cta}
              </Link>
            </div>
          </SwiperSlide>
        ))}



        {/* Custom Pagination & Navigation */}
        <div className="swiper-pagination absolute bottom-10 z-10"></div>
      </Swiper>

      {/* Search Bar */}
<div className="absolute top-[70%] left-0 right-0 z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-full shadow-lg flex overflow-hidden p-1 animate-slide-up">
            <input
              type="text"
              placeholder="Search for events, clubs, or venues..."
              className="flex-1 px-6 py-3 border-none focus:outline-none text-secondary-900"
            />
            <button className="bg-[#d10000] hover:bg-[#b30000] text-white px-6 py-3 rounded-full transition-colors flex items-center">
              <Search size={20} className="mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
