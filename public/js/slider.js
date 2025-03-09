document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".card-wrapper", {
    loop: true,
    spaceBetween: 30,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    navigation: {
      nextEl: ".swiper-button-prev",
      prevEl: ".swiper-button-next",
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
});
