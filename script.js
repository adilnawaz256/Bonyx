document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navLinks?.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Handle navigation and active states
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;

        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            link.classList.remove('active');

            // Check if it's a hash link on the current page
            if (currentPage === 'index.html' && linkHref.includes('#')) {
                // If we're on index.html and there's a hash in the URL
                if (currentHash && linkHref.endsWith(currentHash)) {
                    link.classList.add('active');
                }
                // If we're on index.html but no hash (top of page)
                else if (!currentHash && linkHref === 'index.html') {
                    link.classList.add('active');
                }
            }
            // Check for exact page match
            else if (linkHref === currentPage ||
                (currentPage === 'index.html' && linkHref === '/')) {
                link.classList.add('active');
            }
        });
    }

    // Update active state on page load
    updateActiveNavLink();

    // Update active state when hash changes
    window.addEventListener('hashchange', updateActiveNavLink);

    // Handle link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            // Close mobile menu
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');

            // Handle hash links
            if (this.getAttribute('href').includes('#')) {
                const targetId = this.getAttribute('href').split('#')[1];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });

                    // Update URL without page reload
                    history.pushState(null, null, `#${targetId}`);

                    // Update active state
                    updateActiveNavLink();
                }
            }
        });
    });

    const header = document.querySelector('.main-header');
    const pageTypes = ['home-page', 'about-page', 'projects-page', 'contact-page', 'residential-page', 'privacy-page'];
    const hasPageClass = pageTypes.some(type => document.body.classList.contains(type));

    if (hasPageClass && header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    const slides = document.querySelectorAll('.slide');
    const buttons = document.querySelectorAll('.slide-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        if (!slides?.length || !buttons?.length) return;

        if (!document.querySelector('.slide.active')) {
            slides[0].classList.add('active');
            buttons[0].classList.add('active');
        }

        n = ((n % slides.length) + slides.length) % slides.length;

        slides.forEach(slide => slide.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));

        slides[n].classList.add('active');
        buttons[n].classList.add('active');

        currentSlide = n;
    }

    if (slides.length && buttons.length) {
        showSlide(0);

        const startSlideshow = () => {
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        };

        startSlideshow();

        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                startSlideshow();
            });
        });
    }

    const logoContainer = document.querySelector('.client-logos');
    if (logoContainer) {
        const handleMouseInteraction = (isPaused) => {
            logoContainer.style.animationPlayState = isPaused ? 'paused' : 'running';
        };

        logoContainer.addEventListener('mouseenter', () => handleMouseInteraction(true));
        logoContainer.addEventListener('mouseleave', () => handleMouseInteraction(false));

        let touchStartX = 0;
        let touchEndX = 0;

        const handleSwipe = () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) {
                const direction = difference > 0 ? -20 : 20;
                logoContainer.style.transform = `translateX(${direction}px)`;
                setTimeout(() => {
                    logoContainer.style.transform = '';
                }, 300);
            }
        };

        logoContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        logoContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const validateField = (field, regex, minLength = 0) => {
            if (!field) return true;
            const value = field.value.trim();
            const isValid = regex ? regex.test(value) : value.length >= minLength;
            field.classList.toggle('error', !isValid);
            return isValid;
        };

        const handleFormSubmit = function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');

            let confirmationMsg = document.querySelector('.form-confirmation');
            if (!confirmationMsg) {
                confirmationMsg = document.createElement('div');
                confirmationMsg.className = 'form-confirmation';
                contactForm.appendChild(confirmationMsg);
            }

            const fields = {
                email: {
                    element: document.getElementById('email'),
                    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                },
                phone: {
                    element: document.getElementById('phone'),
                    regex: /^[0-9\s+()-]{8,}$/
                },
                message: {
                    element: document.getElementById('message'),
                    minLength: 10
                }
            };

            const isValid = Object.values(fields).every(field =>
                validateField(field.element, field.regex, field.minLength)
            );

            if (isValid && submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    confirmationMsg.textContent = 'Thank you for your message. We will get back to you soon!';
                    confirmationMsg.classList.add('success');
                    submitBtn.style.display = 'none';

                    contactForm.reset();

                    setTimeout(() => {
                        confirmationMsg.textContent = '';
                        confirmationMsg.classList.remove('success');
                        submitBtn.style.display = 'block';
                        submitBtn.textContent = 'Send Message →';
                        submitBtn.disabled = false;
                    }, 5000);
                }, 1500);
            }
        };

        contactForm.addEventListener('submit', handleFormSubmit);
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length && tabContents.length) {
        // Check URL hash for initial tab
        const hash = window.location.hash.slice(1);
        if (hash) {
            const targetButton = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
            if (targetButton) {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                targetButton.classList.add('active');
                document.getElementById(hash)?.classList.add('active');
            }
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const tabId = button.dataset.tab;
                document.getElementById(tabId)?.classList.add('active');
            });
        });
    }

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Projects Grid Navigation
    const projectsGrid = document.querySelector('.projects-grid');
    const nextButton = document.querySelector('.slider-nav .next');
    const prevButton = document.querySelector('.slider-nav .prev');

    if (projectsGrid && nextButton && prevButton) {
        const cards = projectsGrid.querySelectorAll('.project-card');
        const cardsPerPage = 3;
        let currentIndex = 0;

        // Initially hide cards beyond the first three
        updateVisibleCards();

        function updateVisibleCards() {
            cards.forEach((card, index) => {
                if (index >= currentIndex && index < currentIndex + cardsPerPage) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0)';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(20px)';
                }
            });

            // Update button states
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex + cardsPerPage >= cards.length;
        }

        nextButton.addEventListener('click', () => {
            if (currentIndex + cardsPerPage < cards.length) {
                currentIndex++;
                updateVisibleCards();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateVisibleCards();
            }
        });
    }

    // Project Modal Functionality
    const projectData = {
        'abu-omer-villa-sharjah': {
            title: 'Sharjah Villa',
            type: 'Residential',
            description: 'Elegant villa design with luxurious finishes and bespoke lighting solutions.',
            button: ['Entrance -R1', 'Guest bathroom R1', 'Master bathroom R1', 'Master bedroom R4'],
            EntranceR1images: [
                'assets/projects/Residential/Abu Omer Villa Sharjah/Entrance-R1/Al Barashi villa Entrance (R1) 1.webp',
                'assets/projects/Residential/Abu Omer Villa Sharjah/Entrance-R1/Al Barashi villa Entrance (R1) 3.webp',
                'assets/projects/Residential/Abu Omer Villa Sharjah/Entrance-R1/Al Barashi villa Entrance (R1) 6.webp',
            ],
            GuestbathroomR1images: [
                'https://i.ibb.co/hwgXWxb/Al-Barashi-villa-R1-1.webp',
                'https://i.ibb.co/ycWLjjKt/Al-Barashi-villa-R1-2.webp',
                'https://i.ibb.co/Zz5swHNh/Al-Barashi-villa-R1-3.webp',
                'https://i.ibb.co/xKf6NYxL/Al-Barashi-villa-R1-4.webp',
                'https://i.ibb.co/qFxF517P/Al-Barashi-villa-R1-5.webp',
            ],
            MasterbathroomR1images: [
                'https://i.ibb.co/zTHZw9zr/Al-Barashi-villa-R2-1.webp',
                'https://i.ibb.co/CpMN3z2h/Al-Barashi-villa-R2-2.webp',
                'https://i.ibb.co/gZvdtJ80/Al-Barashi-villa-R2-3.webp',
                'https://i.ibb.co/hJv3JLHP/Al-Barashi-villa-R2-4.webp',
                'https://i.ibb.co/rG229xPV/Al-Barashi-villa-R2-5.webp'
            ],
            MasterbedroomR4images: [
                'assets/projects/Residential/Abu Omer Villa Sharjah/Master Bedroom-R4/Al Barashi villa (R4) 1.webp',
                'assets/projects/Residential/Abu Omer Villa Sharjah/Master Bedroom-R4/Al Barashi villa (R4) 2.webp',
                'assets/projects/Residential/Abu Omer Villa Sharjah/Master Bedroom-R4/Al Barashi villa (R4) 3.webp',
                'assets/projects/Residential/Abu Omer Villa Sharjah/Master Bedroom-R4/Al Barashi villa (R4) 4.webp',
                'assets/projects/Residential/Abu Omer Villa Sharjah/Master Bedroom-R4/Al Barashi villa (R4) 5.webp',
            ],
        },
        'Azura flat (Abu Dhabi': {
            title: 'Azura flat (Abu Dhabi)',
            type: 'Residential',
            description: 'Modern apartment interior with sleek design elements and ambient lighting solutions.',
            button: ['Bathroom 1', 'Bathroom 2', 'Entrance', 'Guest toilet', 'Master Bathroom'],
            Bathroom1images: [
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 1/bathroom 0.1.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 1/bathroom 0.2.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 1/bathroom 0.3.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 1/bathroom 0.4.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 1/bathroom 0.6.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 1/bathroom 0.7.webp',
            ],
            Bathroom2images: [
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 2/bathroom 1.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 2/bathroom 2.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 2/bathroom 3.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 2/bathroom 4.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Bathroom 2/bathroom 5.webp',
            ],
            Entranceimages: [
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Entrance/e 1.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Entrance/e 2.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Entrance/e 3.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Entrance/e 4.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Entrance/e 5.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Entrance/e 6.webp',
            ],
            Guesttoiletimages: [
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Guet Toilet/guest toilet-01.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Guet Toilet/guest toilet-02.webp',

            ],
            MasterBathroomimages: [
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Master Bathroom/master bathroom-01.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Master Bathroom/master bathroom-03.webp',
                'assets/projects/Residential/Azura flat (Abu Dhabi)/Master Bathroom/master bathroom-04.webp',

            ],
        },
        'Damac-Villa': {
            title: 'Damac Villa',
            type: 'Residential',
            description: 'Sophisticated villa design with high-end materials and custom lighting features.',
            button: ['Childs room', 'Kitchen', 'Main Entrance', 'Main Salon', 'Master bedroom', 'Walk in closet'],
            Childsroomimages: [
                'assets/projects/Residential/Damac villa/Childs room/DAMAC Hills Villa Mrs. Sebnem (R0) 2.webp',
                'assets/projects/Residential/Damac villa/Childs room/DAMAC Hills Villa Mrs. Sebnem (R0) 5.webp',
                'assets/projects/Residential/Damac villa/Childs room/DAMAC Hills Villa Mrs. Sebnem (R0) 7.webp',
                'assets/projects/Residential/Damac villa/Childs room/DAMAC Hills Villa Mrs. Sebnem (R0) 9.webp',
            ],
            Kitchenimages: [
                'assets/projects/Residential/Damac villa/Kitchen/DAMAC Hills Villa Mrs. Sebnem Living room + Kitchen +staircase (R1) 1.webp',
                'assets/projects/Residential/Damac villa/Kitchen/DAMAC Hills Villa Mrs. Sebnem Living room + Kitchen +staircase (R1) 2.webp',
            ],
            MainEntranceimages: [
                'assets/projects/Residential/Damac villa/Main Entrance/DAMAC Hills Villa Mrs. Sebnem Main entrance 1.webp',
                'assets/projects/Residential/Damac villa/Main Entrance/DAMAC Hills Villa Mrs. Sebnem Main entrance 3 - Copy.webp',
                'assets/projects/Residential/Damac villa/Main Entrance/DAMAC Hills Villa Mrs. Sebnem Main entrance 4 - Copy.webp',
                'assets/projects/Residential/Damac villa/Main Entrance/DAMAC Hills Villa Mrs. Sebnem Main entrance 5 - Copy.webp',
                'assets/projects/Residential/Damac villa/Main Entrance/DAMAC Hills Villa Mrs. Sebnem Main entrance 6.webp'
            ],
            MainSalonimages: [
                'assets/projects/Residential/Damac villa/Main Salon/DAMAC Hills Villa Mrs. Sebnem Salon (R0) - 1.webp',

                'assets/projects/Residential/Damac villa/Main Salon/DAMAC Hills Villa Mrs. Sebnem Salon (R0) - 3.webp',

                'assets/projects/Residential/Damac villa/Main Salon/DAMAC Hills Villa Mrs. Sebnem Salon (R0) - 5.webp',
                'assets/projects/Residential/Damac villa/Main Salon/DAMAC Hills Villa Mrs. Sebnem Salon (R0) - 6.webp',
                'assets/projects/Residential/Damac villa/Main Salon/DAMAC Hills Villa Mrs. Sebnem Salon (R0) - 8.webp'





            ],
            Masterbedroomimages: [
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 2.jpg',
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 3.jpg',
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 4.jpg',
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 5.jpg',
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 7.jpg',
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 9.jpg',
                'assets/projects/Residential/Damac villa/Master bedroom/DAMAC Hills Villa Mrs. Sebnem Master Bedroom (R1) - 10.jpg'


            ],
            Walkinclosetimages: [
                'assets/projects/Residential/Damac villa/Walk in closet/DAMAC Hills Villa Mrs. Sebnem 1.webp',
                'assets/projects/Residential/Damac villa/Walk in closet/DAMAC Hills Villa Mrs. Sebnem 3.webp',
                'assets/projects/Residential/Damac villa/Walk in closet/DAMAC Hills Villa Mrs. Sebnem 4.webp',
                'assets/projects/Residential/Damac villa/Walk in closet/DAMAC Hills Villa Mrs. Sebnem 8.webp',
                'assets/projects/Residential/Damac villa/Walk in closet/DAMAC Hills Villa Mrs. Sebnem 10.webp'
            ],
        },
        'abu-dhabi-villa': {
            title: 'Abu Dhabi Private Villa',
            type: 'Residential',
            description: 'Luxurious residential villa featuring modern interior design with elegant furnishings and sophisticated lighting.',
            images: [
                'assets/projects/Abu Dhabi Villa/Main Pic.jpg',
                'assets/projects/Abu Dhabi Villa/T-2 villa Mr.Mahfouz 12.jpg',
                'assets/projects/Abu Dhabi Villa/T-2 villa Mr.Mahfouz 13.jpg',
                'assets/projects/Abu Dhabi Villa/T-2 villa Mr.Mahfouz 14.jpg',
                'assets/projects/Abu Dhabi Villa/T-2 villa Mr.Mahfouz 33.jpg'
            ]
        },
        'sharjah-bedroom': {
            title: 'Sharjah Private Bedroom',
            type: 'Residential',
            description: 'Contemporary bedroom design with custom lighting fixtures and premium finishes.',
            images: [
                'assets/projects/Sharjah Bedroom/sharjahvilla2.jpg',
                'assets/projects/Sharjah Bedroom/Main Picb.jpg',
                'assets/projects/Sharjah Bedroom/sharjahvilla1.jpg',
                'assets/projects/Sharjah Bedroom/sharjahvilla3.jpg',
                'assets/projects/Sharjah Bedroom/sharjahvilla4.jpg',
                'assets/projects/Sharjah Bedroom/sharjahvilla5.jpg'
            ]
        },
        'galadari-office': {
            title: 'Galadari Motor Driving Center',
            type: 'Commercial',
            description: 'Modern training facility with state-of-the-art amenities and professional environment.',
            images: [
                'assets/projects/Gladari Office/GLADARI VIP OFFICE 2.jpg',
                'assets/projects/Gladari Office/galadari1.jpg',
                'assets/projects/Gladari Office/galadari2.jpg',
                'assets/projects/Gladari Office/galadari3.jpg'
            ]
        },
        'coral-cafe': {
            title: 'Coral Cafe',
            type: 'Commercial',
            description: 'Charming cafe interior with rustic elements and contemporary design features.',
            images: [
                'assets/projects/Coral Cafe/Main Pica.jpg',
                'assets/projects/Coral Cafe/coralcafe1.jpg',
                'assets/projects/Coral Cafe/coralcafe2.jpg',
                'assets/projects/Coral Cafe/coralcafe3.jpg'
            ]
        },
        'Amongost-few-cafe': {
            title: 'Amongost few cafe',
            type: 'Commercial',
            description: 'Charming cafe interior with rustic elements and contemporary design features.',
            button: ["cafe", "studio", "shop"],
            Cafeimages: [
                'assets/projects/Amongost few cafe/Cafe/amongost 2 2.webp',
                'assets/projects/Amongost few cafe/Cafe/amongost 4 4.webp',
                'assets/projects/Amongost few cafe/Cafe/amongost 5 5.webp',
                'assets/projects/Amongost few cafe/Cafe/amongost 6 6.webp',
                'assets/projects/Amongost few cafe/Cafe/amongost 7  7.webp',
                'assets/projects/Amongost few cafe/Cafe/AMONGOST NEW 3 3.webp',
                'assets/projects/Amongost few cafe/Cafe/amongost pic 1 1.webp',
            ],
            Studioimages: [
                'assets/projects/Amongost few cafe/Studio/studio 1 1.webp',
                'assets/projects/Amongost few cafe/Studio/studio 2  2.webp',
                'assets/projects/Amongost few cafe/Studio/studio final 2 2.webp',
                'assets/projects/Amongost few cafe/Studio/studio final 3  3.webp'
            ],
            Shopimages: [
                'assets/projects/Amongost few cafe/Shop/amongost store 3 3.webp',
                'assets/projects/Amongost few cafe/Shop/amongost store 4 4.webp',
                'assets/projects/Amongost few cafe/Shop/barber shop 2 2.webp',
                'assets/projects/Amongost few cafe/Shop/barber shop 3 3.webp',
                'assets/projects/Amongost few cafe/Shop/barber shop final 2 2.webp',
                'assets/projects/Amongost few cafe/Shop/shop new 3 .3.webp',
                'assets/projects/Amongost few cafe/Shop/sneaker shop 1 .1.webp',
                'assets/projects/Amongost few cafe/Shop/sneaker shop final 2 2.webp'
            ],
           
        },
        'Flat-Twelve-Cafe': {
            title: 'Flat Twelve Cafe',
            type: 'Commercial',
            description: 'Charming cafe interior with rustic elements and contemporary design features.',
            images: [
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0010.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0011.webp',

                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0013.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0015.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0016.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0017.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0018.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0019.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0020.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0021.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0022.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0023.webp',
                'assets/projects/Flat Twelve Cafe - Photos/IMG-20241003-WA0024.webp',
            ]

        },
        'odeon-restaurant': {
            title: 'odeon restaurant',
            type: 'Commercial',
            description: 'Charming cafe interior with rustic elements and contemporary design features.',
            images: [
                'assets/projects/odeon restaurant/IMG-20241003-WA0046.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0047.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0048.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0049.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0050.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0051.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0052.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0053.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0054.webp',
                'assets/projects/odeon restaurant/IMG-20241003-WA0055.webp'
            ]

        },

        'smash-gym': {
            title: 'Smash Gym',
            type: 'Recreational',
            description: 'Modern fitness facility featuring premium equipment and dynamic training spaces.',
            images: [
                'assets/projects/Smash Gym/Main Picc.jpg',
                'assets/projects/Smash Gym/smash1.jpg',
                'assets/projects/Smash Gym/smash2.jpg',
                'assets/projects/Smash Gym/smash3.jpg'
            ]
        },
        'smash-pedal-=&-Fitness-club': {
            title: 'smash pedal & Fitness club',
            type: 'Recreational',
            description: 'Modern fitness facility featuring premium equipment and dynamic training spaces.',
            images: [
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0044.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0036.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0037.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0038.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0039.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0040.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0041.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0042.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0043.webp",
                "assets/projects/Recreational/smash pedal & Fitness club/IMG-20241003-WA0045.webp"
            ]
        },
        'yas-island-garden': {
            title: 'Yas Island Villa Landscape',
            type: 'Residential',
            description: 'Elegant outdoor living space with sustainable landscaping and modern amenities.',
            images: [
                'assets/projects/Yas Island Garden/IMG-20241025-WA0101.jpg',
                'assets/projects/Yas Island Garden/yas1.jpg',
                'assets/projects/Yas Island Garden/yas2.jpg',
                'assets/projects/Yas Island Garden/yas3.jpg'
            ]
        },

    };


    const modal = document.getElementById('projectModal');

    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        const modalImage = modal.querySelector('.main-image');
        const modalThumbnails = modal.querySelector('.gallery-thumbnails');
        const modalType = modal.querySelector('.project-type-tag');
        const modalDescription = modal.querySelector('.project-description');
        const closeModal = modal.querySelector('.close-modal');
        const prevButton = modal.querySelector('.gallery-nav.prev');
        const nextButton = modal.querySelector('.gallery-nav.next');

        let currentImageIndex = 0;
        let currentProject = null;
        let currentCategory = null;
        let currentImages = [];

        // open modal from project card
        document.querySelectorAll('.view-project-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const projectCard = button.closest('.project-card');
                const title = projectCard.querySelector('h3').textContent;
                const projectKey = Object.keys(projectData).find(key => projectData[key].title === title);
                openModal(projectKey);
            });
        });

        closeModal.addEventListener('click', closeProjectModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectModal(); });

        function closeProjectModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function openModal(projectKey) {
            currentProject = projectData[projectKey];
            if (!currentProject) return;

            currentImageIndex = 0;
            currentCategory = currentProject.button ? currentProject.button[0] : null;
            updateModal();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function updateModal(selectedCategory = currentCategory) {
            if (!currentProject) return;

            modalTitle.textContent = currentProject.title;
            modalType.textContent = currentProject.type;
            modalDescription.textContent = currentProject.description;

            // category button section
            const categoryContainerId = "categoryButtons";
            let categoryContainer = document.getElementById(categoryContainerId);
            if (!categoryContainer) {
                categoryContainer = document.createElement("div");
                categoryContainer.id = categoryContainerId;
                categoryContainer.classList.add("category-buttons");
                modal.querySelector(".project-details").prepend(categoryContainer);
            }
            categoryContainer.innerHTML = "";

            // if (currentProject.button && currentProject.button.length) {
            //     currentProject.button.forEach(btnName => {
            //         const btn = document.createElement("button");
            //         btn.className = "category-btn";
            //         btn.textContent = btnName;
            //         if (btnName === selectedCategory) btn.classList.add("active");

            //         btn.addEventListener("click", () => {
            //             currentImageIndex = 0;
            //             currentCategory = btnName;
            //             updateModal(btnName);
            //         });

            //         categoryContainer.appendChild(btn);
            //     });

            //     const keyName = `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}images`;
            //     currentImages = currentProject[keyName] || [];
            // } 
            if (currentProject.button && currentProject.button.length) {
                currentProject.button.forEach(btnName => {
                    const btn = document.createElement("button");
                    btn.className = "category-btn";
                    btn.textContent = btnName;
                    if (btnName === selectedCategory) btn.classList.add("active");

                    btn.addEventListener("click", () => {
                        currentImageIndex = 0;
                        currentCategory = btnName;
                        updateModal(btnName);
                    });

                    categoryContainer.appendChild(btn);
                });

                // FIXED: sanitize button text for key lookup
                const safeCategory = selectedCategory.replace(/[\s-]/g, "");
                const keyName = `${safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1)}images`;

                currentImages = currentProject[keyName] || [];
            }
            else {
                categoryContainer.innerHTML = "";
                currentImages = currentProject.images || [];
            }

            // update gallery
            modalImage.src = currentImages[currentImageIndex] || "";
            if (currentProject.type.toLowerCase() === "recreational") {
                modalImage.style.objectFit = "contain";
            } else {
                modalImage.style.objectFit = "cover";
            }
            modalThumbnails.innerHTML = currentImages.map((src, i) => `
            <div class="thumbnail ${i === currentImageIndex ? 'active' : ''}" data-index="${i}">
                <img src="${src}"   loading="lazy" alt="${currentProject.title} - ${i + 1}" >
            </div>`).join('');

            modalThumbnails.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    currentImageIndex = parseInt(thumb.dataset.index);
                    updateModal(selectedCategory);
                });
            });

            // navigation buttons
            prevButton.style.display = currentImageIndex > 0 ? 'flex' : 'none';
            nextButton.style.display = currentImageIndex < currentImages.length - 1 ? 'flex' : 'none';
        }

        // ✅ FIXED: navigation works properly now
        prevButton.addEventListener('click', () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateModal(currentCategory);
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentImageIndex < currentImages.length - 1) {
                currentImageIndex++;
                updateModal(currentCategory);
            }
        });

        // keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                if (e.key === 'Escape') closeProjectModal();
                else if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
                    currentImageIndex--;
                    updateModal(currentCategory);
                } else if (e.key === 'ArrowRight' && currentImageIndex < currentImages.length - 1) {
                    currentImageIndex++;
                    updateModal(currentCategory);
                }
            }
        });
    }
});
