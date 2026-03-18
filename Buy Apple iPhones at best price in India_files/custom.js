/*########################################################################*/
/*####################------FIXED SCROLLING HEADER-------#################*/
/*########################################################################*/
class SmartHeader {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.lastScrollTop = 0;
        this.delta = 10;
        this.headerHeight = 0;
        this.scrolling = false;
        this.resizeTimeout = null;

        this.init();
    }

    init() {
        if (!this.header) return;


        this.calculateHeaderHeight();
        this.applyBodyPadding();


        this.setupEventListeners();


        this.header.style.transition = 'transform 0.3s ease';
        this.header.style.willChange = 'transform';
    }

    calculateHeaderHeight() {
        this.headerHeight = this.header.offsetHeight;
    }

    applyBodyPadding() {
        document.body.style.paddingTop = this.headerHeight + 'px';
    }

    setupEventListeners() {

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });


        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.calculateHeaderHeight();
                this.applyBodyPadding();
            }, 100);
        });


        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                this.calculateHeaderHeight();
                this.applyBodyPadding();
            });
            resizeObserver.observe(this.header);
        }


        if (document.fonts) {
            document.fonts.ready.then(() => {
                this.calculateHeaderHeight();
                this.applyBodyPadding();
            });
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;


        if (Math.abs(scrollTop - this.lastScrollTop) <= this.delta) return;

        if (scrollTop > this.lastScrollTop && scrollTop > this.headerHeight) {

            this.hideHeader();
        } else {

            if (scrollTop + window.innerHeight < document.documentElement.scrollHeight) {
                this.showHeader();
            }
        }


        if (scrollTop === 0) {
            this.showHeader();
        }

        this.lastScrollTop = scrollTop;
    }

    hideHeader() {
        if (this.header.style.transform !== 'translateY(-100%)') {
            this.header.style.transform = 'translateY(-100%)';
            this.header.classList.add('header-hidden');
            this.header.classList.remove('header-visible');
        }
    }

    showHeader() {
        if (this.header.style.transform !== 'translateY(0)') {
            this.header.style.transform = 'translateY(0)';
            this.header.classList.add('header-visible');
            this.header.classList.remove('header-hidden');
        }
    }


    update() {
        this.calculateHeaderHeight();
        this.applyBodyPadding();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    new SmartHeader();
});


window.SmartHeader = SmartHeader;





/*########################################################################*/
/*####################------OFF-CANVAS NAVBAR MENU-------#################*/
/*########################################################################*/
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const mainNavbar = document.querySelector('#mainNavbar');
    const body = document.body;
    
    if (!navbarToggler || !mainNavbar) {
        console.warn('Navbar elements not found');
        return;
    }
    
    navbarToggler.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle classes
        navbarToggler.classList.toggle('collapsed');
        body.classList.toggle('navMenuOpen');
        mainNavbar.classList.toggle('show');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = mainNavbar.classList.contains('show');
        navbarToggler.setAttribute('aria-expanded', isExpanded);
    });
});

/*########################################################################*/
/*########---------MEGAMENU PRODUCTS OPEN CLOSE ON MOBILE---------########*/
/*########################################################################*/
document.addEventListener('DOMContentLoaded', function() {
    // Function to check mobile view
    function isMobileView() {
        return window.innerWidth < 991.98;
    }

    const navItems = document.querySelectorAll('.nav-item:has(.dropdown-megamenu)');
    let currentOpenMenu = null;

    // Slide toggle function with smooth animation
    function slideToggle(element, duration = 300) {
        if (window.getComputedStyle(element).display === 'none') {
            return slideDown(element, duration);
        } else {
            return slideUp(element, duration);
        }
    }

    function slideUp(element, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `height ${duration}ms ease, opacity ${duration}ms ease`;
            element.style.overflow = 'hidden';
            element.style.height = `${element.offsetHeight}px`;
            element.style.opacity = '1';
            
            // Trigger reflow
            element.offsetHeight;
            
            element.style.height = '0';
            element.style.opacity = '0';
            element.style.paddingTop = '0';
            element.style.paddingBottom = '0';
            element.style.marginTop = '0';
            element.style.marginBottom = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition');
                element.style.removeProperty('opacity');
                resolve();
            }, duration);
        });
    }

    function slideDown(element, duration = 300) {
        return new Promise(resolve => {
            element.style.display = 'block';
            element.style.overflow = 'hidden';
            element.style.height = '0';
            element.style.opacity = '0';
            element.style.paddingTop = '0';
            element.style.paddingBottom = '0';
            element.style.marginTop = '0';
            element.style.marginBottom = '0';
            
            // Trigger reflow
            element.offsetHeight;
            
            const height = element.scrollHeight;
            element.style.transition = `height ${duration}ms ease, opacity ${duration}ms ease`;
            element.style.height = `${height}px`;
            element.style.opacity = '1';
            
            // Get computed styles for padding and margin
            const computedStyle = window.getComputedStyle(element);
            element.style.paddingTop = computedStyle.paddingTop;
            element.style.paddingBottom = computedStyle.paddingBottom;
            element.style.marginTop = computedStyle.marginTop;
            element.style.marginBottom = computedStyle.marginBottom;
            
            setTimeout(() => {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition');
                element.style.removeProperty('opacity');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                resolve();
            }, duration);
        });
    }

    async function closeMenu(menuItem) {
        if (menuItem) {
            const dropdown = menuItem.querySelector('.dropdown-megamenu');
            if (dropdown) {
                await slideUp(dropdown, 300);
            }
            menuItem.classList.remove('menuIsOpen');
            currentOpenMenu = null;
        }
    }

    async function openMenu(menuItem) {
        closeAllMenus();
        const dropdown = menuItem.querySelector('.dropdown-megamenu');
        if (dropdown) {
            await slideDown(dropdown, 300);
        }
        menuItem.classList.add('menuIsOpen');
        currentOpenMenu = menuItem;
        
        // Scroll to make the menu visible if needed
        setTimeout(() => {
            menuItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 350);
    }

    async function closeAllMenus() {
        for (const item of navItems) {
            if (item.classList.contains('menuIsOpen')) {
                await closeMenu(item);
            }
        }
    }

    async function handleNavLinkClick(e) {
        if (!isMobileView()) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const navItem = this.closest('.nav-item');
        const isOpen = navItem.classList.contains('menuIsOpen');
        
        if (isOpen) {
            await closeMenu(navItem);
        } else {
            await openMenu(navItem);
        }
    }

    // Initialize - hide all dropdowns on mobile initially
    function initializeDropdowns() {
        if (isMobileView()) {
            navItems.forEach(navItem => {
                const dropdown = navItem.querySelector('.dropdown-megamenu');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        } else {
            // Reset for desktop view
            navItems.forEach(navItem => {
                const dropdown = navItem.querySelector('.dropdown-megamenu');
                if (dropdown) {
                    dropdown.style.display = '';
                    dropdown.style.height = '';
                    dropdown.style.opacity = '';
                }
                navItem.classList.remove('menuIsOpen');
            });
        }
    }

    // Initial setup
    initializeDropdowns();

    // Add event listeners
    navItems.forEach(navItem => {
        const navLink = navItem.querySelector('.nav-link');
        if (navLink) {
            navLink.addEventListener('click', handleNavLinkClick);
            
            // Prevent default Bootstrap behavior on mobile
            navLink.addEventListener('touchend', function(e) {
                if (isMobileView()) {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });

    // Close on outside click
    document.addEventListener('click', async function(e) {
        if (!isMobileView() || !currentOpenMenu) return;
        
        if (!e.target.closest('.nav-item.menuIsOpen')) {
            await closeAllMenus();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', async function(e) {
        if (e.key === 'Escape' && isMobileView() && currentOpenMenu) {
            await closeAllMenus();
        }
    });

    // Handle resize
    window.addEventListener('resize', function() {
        initializeDropdowns();
        if (!isMobileView()) {
            closeAllMenus();
        }
    });

    // Close when scrolling
    window.addEventListener('scroll', function() {
        if (isMobileView() && currentOpenMenu) {
            closeAllMenus();
        }
    });
});



/*########################################################################*/
/*####################------HOMEPAGE BANNER SLIDER-------#################*/
/*########################################################################*/
$(".search-btn").click(function() {
    $("body").toggleClass("isOpened")
}),
$(".search-close").click(function() {
    $("body").removeClass("isOpened")
});

/*########################################################################*/
/*####################------HOMEPAGE BANNER SLIDER-------#################*/
/*########################################################################*/
document.querySelectorAll(".hero-section").forEach((el) => {
    new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 2200,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false
        },
        pagination: {
            el: el.querySelector(".swiper-pagination"),
            dynamicBullets: true,
            clickable: true
        },
    });
});


/*########################################################################*/
/*###################---------CATEGORY SLIDER----------###################*/
/*########################################################################*/
document.querySelectorAll(".category-swiper").forEach((el) => {
    new Swiper(el, {
        loop: false,
        spaceBetween: 0,
        slidesPerView: 3,
        autoplay: false,
        speed: 900,
        pagination: false,
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: false,
        },
        navigation: {
            nextEl: el.querySelector(".swiper-button-next"),
            prevEl: el.querySelector(".swiper-button-prev"),
        },
        breakpoints: {
            0: {slidesPerView: 3},
            480: {slidesPerView: 3},
            576: {slidesPerView: 4,},
            640: {slidesPerView: 4},
            768: {slidesPerView: 5},
            1024: {slidesPerView: 5},
            1280: {slidesPerView: 6},
        },
    });
});


/*########################################################################*/
/*####################--------PRODUCT SLIDER---------#####################*/
/*########################################################################*/
document.querySelectorAll(".product-slider-wrapper").forEach((wrap) => {
    const sliderEl = wrap.querySelector(".product-slider");

    new Swiper(sliderEl, {
        loop: true,
        slidesPerView: 5,
        spaceBetween: 0,
        speed: 800,
        autoplay: false,
        pagination: {
            el: wrap.querySelector(".swiper-pagination"),
            dynamicBullets: true,
            clickable: true,
        },
        navigation: {
            nextEl: wrap.querySelector(".swiper-button-next"),
            prevEl: wrap.querySelector(".swiper-button-prev"),
        },
        breakpoints: {
            0: { slidesPerView: 2 },
            480: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
        },
    });
});


/*########################################################################*/
/*#############-----------PRODUCT CARD EQUAL HEIGHT-----------############*/
/*########################################################################*/
function setEqualProductBlockHeights(swiperEl) {
  const productBlocks = swiperEl.querySelectorAll('.swiper-slide .product-block');
  if (!productBlocks.length) return; // skip if no .product-block

  let maxHeight = 0;

  // Reset first
  productBlocks.forEach(block => {
    block.style.height = 'auto';
  });

  // Find tallest
  productBlocks.forEach(block => {
    if (block.offsetHeight > maxHeight) {
      maxHeight = block.offsetHeight;
    }
  });

  // Apply tallest
  productBlocks.forEach(block => {
    block.style.height = maxHeight + 'px';
  });
}

// Apply to every swiper that has .product-block inside
document.querySelectorAll('.swiper').forEach(swiperEl => {
  if (swiperEl.querySelector('.product-block')) {
    // Equalize on page load
    window.addEventListener('load', () => setEqualProductBlockHeights(swiperEl));

    // Equalize on resize
    window.addEventListener('resize', () => setEqualProductBlockHeights(swiperEl));

    // Equalize on swiper events
    const swiperInstance = swiperEl.swiper; // if already initialized
    if (swiperInstance) {
      swiperInstance.on('init', () => setEqualProductBlockHeights(swiperEl));
      swiperInstance.on('resize', () => setEqualProductBlockHeights(swiperEl));
      swiperInstance.on('slideChangeTransitionEnd', () => setEqualProductBlockHeights(swiperEl));
    }
  }
});





/*########################################################################*/
/*####################-----------ADS SLIDER------------###################*/
/*########################################################################*/
document.querySelectorAll(".ad-section").forEach((el) => {
    new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 2200,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false
        },
        pagination: {
            el: el.querySelector(".swiper-pagination"),
            dynamicBullets: true,
            clickable: true
        }
    });
});


/*############################################################################*/
/*###################---------TESTIMONIAL SLIDER----------####################*/
/*############################################################################*/

document.querySelectorAll(".review-slider-wrapper").forEach((wrap) => {
    const sliderEl = wrap.querySelector(".review-slider");

    new Swiper(sliderEl, {
        loop: true,
        slidesPerView: 5,
        spaceBetween: 0,
        speed: 800,
        autoplay: false,
        pagination: {
            el: wrap.querySelector(".swiper-pagination"),
            dynamicBullets: true,
            clickable: true,
        },
        navigation: {
            nextEl: wrap.querySelector(".swiper-button-next"),
            prevEl: wrap.querySelector(".swiper-button-prev"),
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            480: { slidesPerView: 1 },
            576: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
        },
    });
});


/*############################################################################*/
/*###################---------TESTIMONIAL SLIDER----------####################*/
/*############################################################################*/
$(".footer-block__title").click(function(){
    $(this).parent(".footer-block").toggleClass("isOpen");
    $(this).siblings(".footer-block__content").slideToggle("slow");
}); 































