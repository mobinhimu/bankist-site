'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const operationContainer = document.querySelector('.operations__tab-container');
const operations = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn =>
  btn.addEventListener('click', eve => {
    eve.preventDefault();
    openModal();
  })
);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

window.addEventListener('keydown', eve => {
  eve.key === 'Escape' && closeModal();
});

///////////////////////////////////////
// LEARN MORE

btnScrollTo.addEventListener('click', eve => {
  // const s1coord = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

///////////////////////////////////////
// PAGE NAVIGATION

document.querySelector('.nav__links').addEventListener('click', eve => {
  eve.preventDefault();
  if (eve.target.classList.contains('nav__link')) {
    const id = eve.target.getAttribute('href');

    if (id === '#') return;

    const pages = document.querySelector(id);

    pages.scrollIntoView({ behavior: 'smooth' });
  }
});

// Operations

operationContainer.addEventListener('click', eve => {
  const getButton = eve.target.closest('.operations__tab');

  if (!getButton) return;

  // Remove Active Class From Both
  tabs.forEach(tab => {
    if (tab.classList.contains('operations__tab--active'))
      tab.classList.remove('operations__tab--active');
  });

  operations.forEach(operation => {
    if (operation.classList.contains('operations__content--active'))
      operation.classList.remove('operations__content--active');
  });

  getButton.classList.add('operations__tab--active');

  document
    .querySelector(
      `.operations__content--${getButton.getAttribute('data-tab')}`
    )
    .classList.add('operations__content--active');
});

// Nav link
const navLink = function (eve) {
  const link = eve.target;
  const sibling = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');

  sibling.forEach(el => {
    if (el !== link) {
      el.style.opacity = this;
    }
  });
  logo.style.opacity = this;
};

// Mouse over event
nav.addEventListener('mouseover', navLink.bind(0.5));
nav.addEventListener('mouseout', navLink.bind(1));

// Creating sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const navSticky = function (entries) {
  if (entries[0].isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};
const navObserver = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
navObserver.observe(header);

// Section hidden
const section = document.querySelectorAll('.section');

const sectionHidden = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionHidden, {
  root: null,
  threshold: 0.15,
});

section.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

// Image target
const imgTarget = document.querySelectorAll('img[data-src]');
const imgCallback = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.getAttribute('data-src');

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observe.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  // rootMargin: '200px',
});

imgTarget.forEach(el => imgObserver.observe(el));

// Slider Adding
function slider() {
  const sliders = document.querySelectorAll('.slide');
  const leftSlide = document.querySelector('.slider__btn--left');
  const rightSlide = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  let slideEnd = sliders.length - 1;

  const creatingDot = function () {
    sliders.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    sliders.forEach(
      (slider, i) =>
        (slider.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  // previous slide
  const nextSlide = function () {
    if (currentSlide === slideEnd) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activeDots(currentSlide);
  };

  goToSlide(0);
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = slideEnd;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activeDots(currentSlide);
  };

  const init = function () {
    creatingDot();
    activeDots(0);
  };
  init();
  // Event Handlers
  rightSlide.addEventListener('click', nextSlide);
  leftSlide.addEventListener('click', prevSlide);

  // keypress listener
  document.addEventListener('keydown', eve => {
    if (eve.key === 'ArrowRight') {
      nextSlide();
    } else if (eve.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  dotContainer.addEventListener('click', eve => {
    if (eve.target.classList.contains('dots__dot')) {
      const { slide } = eve.target.dataset;
      goToSlide(slide);
      activeDots(slide);
    }
  });
}
slider();
