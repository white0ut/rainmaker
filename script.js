document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('#nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const backToTopBtn = document.getElementById('back-to-top');
    const bookingForm = document.getElementById('charter-booking-form');
    const yearSpan = document.getElementById('current-year');
    const dateInputs = document.querySelectorAll('input[type="date"]');

    // --- Mobile Navigation ---
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            // Optional: Toggle body scroll
            // document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navList.classList.remove('active');
                    // document.body.style.overflow = '';
                }
            });
        });

        // Close menu if clicking outside of it (optional)
        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !navToggle.contains(event.target) && navList.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                 // document.body.style.overflow = '';
            }
        });
    }

    // --- Sticky Header Background Change (Optional) ---
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- FAQ Accordion ---
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-toggle i');

        if (question && answer && icon) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all others first (optional, uncomment if you want only one open)
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item && otherItem.classList.contains('active')) {
                //         otherItem.classList.remove('active');
                //         otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                //         otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
                //     }
                // });

                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
                icon.className = isActive ? 'fas fa-plus' : 'fas fa-minus';
            });
        }
    });

    // --- Back to Top Button ---
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Smooth scroll back to top
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
             // Use #header as target for better offset handling with sticky header
             const targetElement = document.querySelector(backToTopBtn.getAttribute('href'));
             if (targetElement) {
                 targetElement.scrollIntoView({ behavior: 'smooth'});
             } else {
                 window.scrollTo({ top: 0, behavior: 'smooth' }); // Fallback
             }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Ensure it's a valid internal link and not just "#"
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Only prevent default if target exists
                     // Calculate offset position considering the sticky header
                    const headerOffset = document.getElementById('header')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                     // Close mobile nav if open after clicking a link
                    if (navList && navList.classList.contains('active')) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navList.classList.remove('active');
                        // document.body.style.overflow = '';
                    }
                }
            } else if (targetId === '#') {
                // Prevent default for links that are just "#"
                e.preventDefault();
            }
        });
    });

    // --- Basic Form Validation & Submission ---
    if (bookingForm) {
        // Set min date for date inputs
        const today = new Date();
        // Optional: Add a buffer of a few days? e.g., today.setDate(today.getDate() + 2);
        const minDate = today.toISOString().split('T')[0];
        dateInputs.forEach(input => {
            input.min = minDate;
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default submission

            // Simple check for required fields (HTML5 validation should handle most)
            let isValid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                     // Optional: Add error indication near the field
                     field.style.borderColor = 'red';
                } else {
                     field.style.borderColor = ''; // Reset border color
                }
            });

             // Honeypot check
             const honeypot = bookingForm.querySelector('.honeypot input');
             if (honeypot && honeypot.value !== '') {
                 isValid = false;
                 console.log("Spam detected!"); // Don't alert user
             }

            if (isValid) {
                // Here you would typically send the data using Fetch API or AJAX
                // For this example, we'll just show an alert and reset.
                console.log('Form data submitted (simulation):', new FormData(bookingForm));
                alert('Thank you for your booking request! We will contact you shortly via phone or email to confirm availability and arrange the deposit.');
                bookingForm.reset();
                 // Reset any error styles
                 requiredFields.forEach(field => field.style.borderColor = '');

                // --- !!! IMPORTANT !!! ---
                // Replace the alert above with actual form submission logic.
                // Example using Fetch API (POST to a server endpoint):
                /*
                const formData = new FormData(bookingForm);
                fetch('/your-server-endpoint', { // Replace with your actual endpoint
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // or response.text() depending on server response
                })
                .then(data => {
                    console.log('Success:', data);
                    alert('Thank you! Your request has been sent.');
                    bookingForm.reset();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Sorry, there was an issue sending your request. Please try calling or texting.');
                });
                */
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // --- Set Current Year in Footer ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

     // --- Initialize Lightbox/Slider ---
     // If you add Lightbox2:
     // lightbox.option({ /* options */ });

     // If you add Slick Carousel (Example for testimonials):
     /*
     if (typeof $ !== 'undefined' && $('.testimonial-container').length) { // Check if jQuery and element exist
         $('.testimonial-container').slick({
             dots: true,
             infinite: true,
             speed: 500,
             slidesToShow: 1, // Adjust as needed for wider screens
             adaptiveHeight: true,
             autoplay: true,
             autoplaySpeed: 5000,
             // responsive: [ ... ] // Add responsive settings if needed
         });
     }
     */

}); // End DOMContentLoaded