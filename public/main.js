// Toggle icon navbar 
let menuIcon = document.querySelector('#menu-icon');

let navbar = document.querySelector('.navbar');

menuIcon.onclick=() => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}

// Scrool section 

let sections = document.querySelectorAll('section')
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(
        sec => {
            let top = window.scrollY;
            let offset = sec.offsetTop - 150 ;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height ){
                navLinks.forEach.apply(
                    links => {
                        links.classList.remove('active');
                        document.querySelector('header nav a [href*=' +id + ']').classList.add('active');
                    }
                );
            }
        }
    );

// sticky navbar
let header = document.querySelector('header');
header.classList.toggle('sticky' ,window.scrollY > 100);

// remove toggle icon and navbar 
menuIcon.classList.remove('fa-xmark');
navbar.classList.remove('active');
};

// scrooll reveal
ScrollReveal({
    distance : '80px',
    duration : 2000 ,
    delay : 200 ,
});

ScrollReveal().reveal('.home-content,heading',{origin:'top'});
ScrollReveal().reveal('.home-img, .services-container , .portfolio-box, .contact form',{origin:'button'});
ScrollReveal().reveal('.home-contact h1 ,.about-img',{origin:'left'});
ScrollReveal().reveal('.home-contact p ,.about-content',{origin:'right'});


// Typed js 
const typed = new Typed('.multiple-text',{
    strings:['Frontend Developer','Java Developer','Database Administrator'],
    typeSpeed:70,
    backSpeed : 70,
    backDelay : 1000,
    loop: true,
})

// Adding event listener to the contact form
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Fetch input values
    const fullName = document.querySelector('input[placeholder="Full Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email Address"]').value.trim();
    const mobileNumber = document.querySelector('input[placeholder="Mobile Number"]').value.trim();
    const message = document.querySelector('textarea').value.trim();

    // Checking for empty fields and validating mobile number length
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

    // Sending form data to the server
    fetch('https://kanishkdevelopersportfolio.up.railway.app/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            alert(data.message || 'Form submitted successfully');
            document.getElementById('contactForm').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        });
});

