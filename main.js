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
                        links.classLIst.remove('active');
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


// connection of backend using nodejs and express 
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const formData = {
      fullName: document.querySelector('input[placeholder="Full Name"]').value,
      email: document.querySelector('input[placeholder="Email Address"]').value,
      mobileNumber: document.querySelector('input[placeholder="Mobile Number"]').value,
      message: document.querySelector('textarea').value
    };
      // http://localhost:300
    fetch('http://localhost:300//api/contact', {
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
