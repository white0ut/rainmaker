document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const header = document.getElementById('header');
    const faqItems = document.querySelectorAll('.faq-item');
    const backToTopBtn = document.getElementById('back-to-top');
    const bookingForm = document.getElementById('charter-booking-form');
    const yearSpan = document.getElementById('current-year');
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    // Initialize responsive navigation
    const nav = responsiveNav(".nav-collapse", {
        animate: true,
        transition: 300,
        label: "Menu",
        closeOnNavClick: true
    });
    
    // Sticky Header Background Change
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-toggle i');

        if (question && answer && icon) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
                icon.className = isActive ? 'fas fa-plus' : 'fas fa-minus';
            });
        }
    });

    // Back to Top Button
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = document.getElementById('header')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 991 && nav) {
                        nav.close();
                    }
                }
            } else if (targetId === '#') {
                e.preventDefault();
            }
        });
    });

    // Form Validation & Submission
    if (bookingForm) {
        // Set minimum date to today
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        
        dateInputs.forEach(input => {
            input.min = minDate;
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            
            // Validate required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = '';
                }
            });

            // Check honeypot (spam protection)
            const honeypot = bookingForm.querySelector('.honeypot input');
            if (honeypot && honeypot.value !== '') {
                isValid = false;
                console.log("Spam detected!");
            }

            if (isValid) {
                // In production, replace with actual form submission
                console.log('Form data submitted (simulation):', new FormData(bookingForm));
                alert('(Simulation): Thank you for your booking request! We will contact you shortly via phone or email to confirm availability and arrange the deposit.');
                
                // Reset form
                bookingForm.reset();
                requiredFields.forEach(field => field.style.borderColor = '');
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // Set Current Year in Footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Lightbox initialization - if you're using a lightbox library
    // Uncomment if you add Lightbox2 or similar
    /*
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': "Image %1 of %2"
        });
    }
    */
    
    // Ensure responsive nav is properly initialized
    window.addEventListener('resize', () => {
        if (nav) {
            nav.resize();
        }
    });
});