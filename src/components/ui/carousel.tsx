import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './styles/carousel.module.css';


// import required modules
import { EffectCoverflow, Pagination ,Navigation } from 'swiper/modules';

export default function Carousel() {
  return (
    <>
      <Swiper
        effect={'coverflow'}
        navigation={true}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Navigation, Pagination]}
        className={styles.mySwiper}
      >
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide   >
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperslide}>
          <img className={styles.reflect} src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
