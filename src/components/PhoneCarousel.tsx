import React, { useState, useEffect } from "react";
import { Carousel } from "rs-3d-react-carousal";
import DeviceFrameset from "react-device-frameset";
import { useTranslation } from "react-i18next";

const PhoneCarousel = () => {
  const { t } = useTranslation();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const slideData = [
    {
      image: "/assets/phone/main_screen.webp",
      alt: "Main Screen",
      descriptionKey: "phoneCarousel.mainScreen",
    },
    {
      image: "/assets/phone/profile.webp", 
      alt: "Profile",
      descriptionKey: "phoneCarousel.profile",
    },
    {
      image: "/assets/phone/children.webp",
      alt: "Children Management", 
      descriptionKey: "phoneCarousel.children",
    },
    {
      image: "/assets/phone/teacher.webp",
      alt: "Teacher Portal",
      descriptionKey: "phoneCarousel.teacher",
    },
    {
      image: "/assets/phone/groups.webp",
      alt: "Groups",
      descriptionKey: "phoneCarousel.groups",
    },
    {
      image: "/assets/phone/courses.webp",
      alt: "Courses", 
      descriptionKey: "phoneCarousel.courses",
    },
    {
      image: "/assets/phone/messages.webp",
      alt: "Messages",
      descriptionKey: "phoneCarousel.messages",
    },
    {
      image: "/assets/phone/time_table.webp",
      alt: "Time Table",
      descriptionKey: "phoneCarousel.timeTable",
    },
    {
      image: "/assets/phone/announcements.webp",
      alt: "Announcements",
      descriptionKey: "phoneCarousel.announcements",
    },
    {
      image: "/assets/phone/blog.webp",
      alt: "Blog",
      descriptionKey: "phoneCarousel.blog",
    },
    {
      image: "/assets/phone/administration.webp",
      alt: "Administration",
      descriptionKey: "phoneCarousel.administration",
    },
    {
      image: "/assets/phone/create_acc_page.webp",
      alt: "Create Account Page",
      descriptionKey: "phoneCarousel.createAccPage",
    },
  ];

  // Preload images to prevent loading delay
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slideData.map((slide) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = slide.image;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true); // Show carousel even if some images fail
      }
    };

    preloadImages();
  }, []);

  const IPhoneFrame = ({ children, hasNotification = false }) => {
    return (
      <div className="iphone-mockup">
        {/* Screen fills everything */}
        <div className="iphone-screen">
          {children}
          {/* Dynamic island floats above image */}
          <div className="iphone-top-bar">
            <div className="dynamic-island">
              {hasNotification && <div className="notification-dot" />}
            </div>
          </div>
          {/* Home indicator */}
          <div className="home-indicator"></div>
        </div>
      </div>
    );
  };

  const slides = slideData.map((slide, index) => (
    <div key={index} className="carousel-slide-wrapper">
      <IPhoneFrame hasNotification={false}>
        <img
          src={slide.image}
          alt={slide.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            background: "transparent",
          }}
        />
      </IPhoneFrame>
      <div className="slide-description">
        <p className="text-gray-900 dark:text-gray-100">{t(slide.descriptionKey)}</p>
      </div>
    </div>
  ));

  return (
    <div className="bg-transparent dark:bg-transparent">
      {!imagesLoaded ? (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">{t("loading")} TaalimFlow...</p>
          </div>
        </div>
      ) : (
        <Carousel slides={slides} autoplay={true} interval={5000} arrows={false} />
      )}
    </div>
  );
};

export default PhoneCarousel;
