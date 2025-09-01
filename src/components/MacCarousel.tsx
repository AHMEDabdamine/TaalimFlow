import React, { useState, useEffect } from "react";
import { Carousel } from "rs-3d-react-carousal";
import { useTranslation } from "react-i18next";

const iMacCarousel = () => {
  const { t } = useTranslation();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const slideData = [
    {
      image: "/assets/images/about_school.webp",
      alt: "About School",
      descriptionKey: "carousel.aboutSchool",
    },
    {
      image: "/assets/images/block_and_report.webp",
      alt: "Block and Report",
      descriptionKey: "carousel.blockAndReport",
    },
    {
      image: "/assets/images/blog.webp",
      alt: "Blog",
      descriptionKey: "carousel.blog",
    },
    {
      image: "/assets/images/content_management.webp",
      alt: "Content Management",
      descriptionKey: "carousel.contentManagement",
    },
    {
      image: "/assets/images/course_reg-3.webp",
      alt: "Course Registrations",
      descriptionKey: "carousel.courseRegistrations",
    },
    {
      image: "/assets/images/course_reg-2.webp",
      alt: "Course Registration Dashboard",
      descriptionKey: "carousel.courseRegistrationDashboard",
    },
    {
      image: "/assets/images/groups_2.webp",
      alt: "Group Management",
      descriptionKey: "carousel.groupManagement",
    },
    {
      image: "/assets/images/groups.webp",
      alt: "Groups Overview",
      descriptionKey: "carousel.groupsOverview",
    },
    {
      image: "/assets/images/main.webp",
      alt: "Main Dashboard",
      descriptionKey: "carousel.mainDashboard",
    },
    {
      image: "/assets/images/messages.webp",
      alt: "Messages",
      descriptionKey: "carousel.messages",
    },
    {
      image: "/assets/images/parent_profile.webp",
      alt: "Parent Profile",
      descriptionKey: "carousel.parentProfile",
    },
    {
      image: "/assets/images/table.webp",
      alt: "Data Tables",
      descriptionKey: "carousel.dataTables",
    },
    {
      image: "/assets/images/teachers.webp",
      alt: "Teachers Management",
      descriptionKey: "carousel.teachersManagement",
    },
    {
      image: "/assets/images/users_management.webp",
      alt: "Users Management",
      descriptionKey: "carousel.usersManagement",
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

  const slides = slideData.map((slide, index) => (
    <div
      key={index}
      className="carousel-slide-wrapper"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <img
          src={slide.image}
          alt={slide.alt}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            background: "transparent",
            display: "block",
          }}
        />
      </div>
      <div className="slide-description text-center">
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          {t(slide.descriptionKey)}
        </p>
      </div>
    </div>
  ));

  return (
    <div
      className="w-full py-0 md:py-2 lg:py-4 bg-transparent dark:bg-transparent"
      style={{ position: "relative", zIndex: 0 }}
    >
      <div className="max-w-7xl mx-auto px-1 md:px-6">
        {/* Carousel Title */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("carousel.title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("carousel.subtitle")}
          </p>
        </div>
        {/* Maximum size carousel - Huge on mobile screens */}
        <div
          className="h-[95vh] max-h-[1500px] min-h-[90vh]
                        xs:h-[95vh] xs:max-h-[1400px] xs:min-h-[85vh]
                        sm:h-[90vh] sm:max-h-[1200px] sm:min-h-[80vh]
                        md:h-[85vh] md:max-h-[1050px] md:min-h-[750px]
                        lg:h-[90vh] lg:max-h-[1100px] lg:min-h-[800px]
                        xl:h-[85vh] xl:max-h-[1150px] xl:min-h-[850px]
                        2xl:h-[90vh] 2xl:max-h-[1200px] 2xl:min-h-[900px]"
        >
          {!imagesLoaded ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">{t("loading")} TaalimFlow...</p>
              </div>
            </div>
          ) : (
            <Carousel
              slides={slides}
              autoplay={true}
              interval={5000}
              arrows={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default iMacCarousel;
