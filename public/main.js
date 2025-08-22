// DOM Elements
const header = document.querySelector('.header');
const menuToggle = document.getElementById('menu-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');
const backToTop = document.querySelector('.back-to-top');
const revealElements = document.querySelectorAll('[data-reveal]');

// Toggle menu on mobile
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
    });
});

// Change header style on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
    
    // Reveal elements on scroll
    revealOnScroll();
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Reveal elements on scroll
function revealOnScroll() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Initialize ScrollReveal
ScrollReveal({
    reset: false,
    distance: '60px',
    duration: 1500,
    delay: 200
});

// Typed.js text animation
const typed = new Typed('.multiple-text', {
    strings: ['Full Stack Developer', 'Java Developer', 'MERN Stack Developer'],
    typeSpeed: 70,
    backSpeed: 70,
    backDelay: 1000,
    loop: true
});

// Contact form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Fetch input values
    const fullName = document.querySelector('input[placeholder="Full Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email Address"]').value.trim();
    const mobileNumber = document.querySelector('input[placeholder="Mobile Number"]').value.trim();
    const message = document.querySelector('textarea').value.trim();
    
    // Validate form inputs
    let missingFields = [];
    if (!fullName) missingFields.push("Full Name");
    if (!email) missingFields.push("Email Address");
    if (!mobileNumber) {
        missingFields.push("Mobile Number");
    } else if (mobileNumber.length !== 10) {
        alert("Mobile Number must be exactly 10 digits.");
        return; // Stop form submission
    }
    if (!message) missingFields.push("Message");
    
    if (missingFields.length > 0) {
        alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
        return; // Stop form submission
    }
    
    // Prepare data for submission
    const formData = {
        fullName: fullName,
        email: email,
        mobileNumber: mobileNumber,
        message: message
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    
    // Send data to server
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Show success message
        alert(data.message || 'Message sent successfully!');
        contactForm.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    })
    .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize reveal animations on page load
window.addEventListener('load', () => {
    revealOnScroll();
    updateActiveNavLink();

});

