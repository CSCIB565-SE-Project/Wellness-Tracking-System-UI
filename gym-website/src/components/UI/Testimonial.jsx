import React from "react";
import "swiper/swiper.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/effect-coverflow/effect-coverflow.scss";

// import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper core and required modules. In this example, 
// we will use Pagination and Coverflow
import SwiperCore, { Pagination, EffectCoverflow } from "swiper";

// configure Swiper to use modules
SwiperCore.use([Pagination, EffectCoverflow]);

// import required modules
import avatar01 from '../../assests/img/avatar01.jpeg';
import avatar02 from '../../assests/img/avatar02.jpeg';
import avatar03 from '../../assests/img/avatar03.jpeg';


export default function Testimonial() {

return (
    <>
      <Swiper effect={'cards'} grabCursor={true} className="mySwiper">

      
        <SwiperSlide>
          <div className="slide__item">
            <div className="slide__img"> <img src= {avatar01} alt="" /></div>
            <h4> Kayla Itsines </h4>
            <p>Discover the power of transformation with Kayla Itsines, an esteemed personal trainer and co-creator of the Bikini Body Guides and Sweat app. 
              At Fit Inc, we embrace Kayla's inspiring journey and philosophy, empowering our community to achieve their fitness goals with confidence. 
              Join us to experience workouts and wellness tips influenced by Kayla's innovative approach to health and fitness. Together, let's embark on a journey towards a stronger, more vibrant you.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide__item">
              <div className="slide__img"> <img src= {avatar02} alt="" /></div>
              <h4> Namrata Purohit </h4>
              <p> Elevate your fitness journey with Namrata Purohit, a trailblazing Pilates instructor and the dynamic force behind The Pilates Studio Mumbai. 
                  As the world's youngest trained Stott Pilates instructor and a celebrated author of "The Lazy Girl’s Guide to Being Fit," 
                  Namrata brings a wealth of expertise and innovation to her 28 studios nationwide.Join us to experience the transformative power of mindful movement, guided by a visionary who's shaping the future of fitness.
              </p>
            </div>
          </SwiperSlide>
        <SwiperSlide>
          <div className="slide__item">
              <div className="slide__img"> <img src= {avatar03} alt="" /></div>
              <h4> Chase Weber </h4>
              <p> Meet Chase Weber, a beacon of fitness versatility and motivation. He has established himself as one of the most organized and influential fitness professionals in the US. 
                  As the CEO of Thr33 Active and President of ATD, he's not just sculpting bodies but also futures, with a dedication to youth sports and life skills development. 
                  Join us at Fit Inc, where we harness inspiration from Chase's journey, integrating his pioneering fitness philosophies and workouts to empower your transformation. 
                  Let Chase Weber lead your fitness journey, inspiring you to reach your peak potential.
              </p>
            </div> 
          </SwiperSlide>

      </Swiper>
    </>
  );

    
}

