import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './styles/carousel.module.css';
import Card from './Card';
import { Mousewheel, EffectCoverflow, Navigation } from 'swiper/modules';



interface CarouselProps {
  data: any; // Replace 'any' with the actual type of 'data'
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {

  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);


  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance) {
      const slideChangeHandler = () => {
        setActiveIndex(swiperInstance.activeIndex);
      };
      swiperInstance.on('slideChange', slideChangeHandler);
      return () => {
        swiperInstance.off('slideChange', slideChangeHandler);
      };
    }
  }, []);




  return (
    <>
      <Swiper

        ref={swiperRef}
        effect={'coverflow'}
        mousewheel={true}
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
        modules={[EffectCoverflow, Navigation, Mousewheel]}
        className={styles.mySwiper}
      >
        {data &&
          data.tracks.items
            .filter((item: any) => item.track.preview_url) // Filter out items without preview_url
            .map((item: any, index: number) => (
              <SwiperSlide key={item.track.id} className={styles.swiperslide}>
                <Card
                  key={item.track.id}
                  imageUrl={item.track.album.images[0].url}
                  audioUrl={item.track.preview_url}
                  albumName={item.track.album.name}
                  name={item.track.name}
                  isActive={activeIndex === index}
                />
              </SwiperSlide>
            ))
        }
      </Swiper>
    </>
  );
};

export default Carousel;