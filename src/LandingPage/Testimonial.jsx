import React from "react";
import avatar01 from '../assests/img/avatar01.jpeg';
import avatar02 from '../assests/img/avatar02.jpeg';
import avatar03 from '../assests/img/avatar03.jpeg';
import "../styles/testimonial.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
// import 'swiper/css'; // Core Swiper CSS
// import 'swiper/css/pagination'; // Pagination module CSS
// import 'swiper/css/effect-coverflow'; // Coverflow effect CSS



export default function Testimonial() {

return (

      <div className="sliders">
        <h2 className="section__title">Testimonials</h2>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >

            <SwiperSlide>
              <div className="slide__item">
                <div className="slide__img-01"> <img src= {avatar01} alt="" /></div>
                <h4> Kayla Itsines </h4>
                <p>Discover the power of transformation with Kayla Itsines, an esteemed personal trainer and co-creator of the Bikini Body Guides and Sweat app. 
                  At Fit Inc, we embrace Kayla's inspiring journey and philosophy, empowering our community to achieve their fitness goals with confidence. 
                  Join us to experience workouts and wellness tips influenced by Kayla's innovative approach to health and fitness. Together, let's embark on a journey towards a stronger, more vibrant you.</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide__item">
                  <div className="slide__img-02"> <img src= {avatar02} alt="" /></div>
                  <h4> Namrata Purohit </h4>
                  <p> Elevate your fitness journey with Namrata Purohit, a trailblazing Pilates instructor and the dynamic force behind The Pilates Studio Mumbai. 
                      As the world's youngest trained Stott Pilates instructor and a celebrated author of "The Lazy Girl’s Guide to Being Fit," 
                      Namrata brings a wealth of expertise and innovation to her 28 studios nationwide.Join us to experience the transformative power of mindful movement, guided by a visionary who's shaping the future of fitness.
                  </p>
                </div>
              </SwiperSlide>
            <SwiperSlide>
              <div className="slide__item">
                  <div className="slide__img-03"> <img src= {avatar03} alt="" /></div>
                  <h4> Chase Weber </h4>
                  <p> Meet Chase Weber, a beacon of fitness versatility and motivation. He has established himself as one of the most organized and influential fitness professionals in the US. 
                      As the CEO of Thr33 Active and President of ATD, he's not just sculpting bodies but also futures, with a dedication to youth sports and life skills development. 
                      Join us at Fit Inc, where we harness inspiration from Chase's journey, integrating his pioneering fitness philosophies and workouts to empower your transformation. 
                      Let Chase Weber lead your fitness journey, inspiring you to reach your peak potential.
                  </p>
                </div> 
              </SwiperSlide>
          </Swiper>
        </div>
  );
}
