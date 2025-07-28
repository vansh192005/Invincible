// Header, sidebar, and hero-section functionality
// This script handles the sidebar toggle, background image sliding, and typed text effect
let hamburger = document.querySelector('.hamburger');
let sidebar = document.querySelector('.sidebar');
let closeBtn = document.querySelector('.close-btn button');
let heroSection = document.querySelector('.hero-section');

let imageArr = [
    '/images/hero-section/climbing.jpg',
    '/images/hero-section/clouds.jpg',
    '/images/hero-section/beach.jpg',
    '/images/hero-section/dessert.jpg'
];

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('show');
})

// Change background image every 5 seconds
let currentIndex = 0;

heroSection.style.backgroundImage = `url(${imageArr[currentIndex]})`;

// Duration for the slide animation and time between slides (in ms)
const slideDuration = 1000; // must match CSS transition duration (1s)
const slideInterval = 5000; // total time each image is shown

function slideNextImage() {
    const nextIndex = (currentIndex + 1) % imageArr.length;

    const slideDiv = document.createElement('div');
    slideDiv.className = 'bg-transition';
    slideDiv.style.backgroundImage = `url(${imageArr[nextIndex]})`;
    slideDiv.style.left = '100%';
    heroSection.appendChild(slideDiv);

    // Force reflow
    void slideDiv.offsetWidth;

    // Animate sliding in
    slideDiv.style.left = '0';

    // When transition ends (after slideDuration)
    slideDiv.addEventListener('transitionend', () => {
        heroSection.style.backgroundImage = `url(${imageArr[nextIndex]})`;
        slideDiv.remove();
        currentIndex = nextIndex;

        // Schedule next slide after slideInterval milliseconds
        setTimeout(slideNextImage, slideInterval);
    }, { once: true });
}

// Start the first slide after exactly slideInterval ms (5 seconds)
setTimeout(slideNextImage, slideInterval);



// Typed text effect
const words = ["Adventure", "Nature", "Thrill", "Peace", "Excitement"];
let currentWordIndex = 0;
const typedText = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");

function typeWord(word, callback) {
    typedText.textContent = "";
    typedText.style.animation = "none"; // Reset animation
    void typedText.offsetWidth; // Trigger reflow
    typedText.style.animation = ""; // Restart animation

    let i = 0;
    let typing = setInterval(() => {
        if (i < word.length) {
            typedText.textContent += word.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            setTimeout(callback, 3000); // Wait 3 seconds before next word
        }
    }, 100);
}

function rotateWords() {
    typeWord(words[currentWordIndex], () => {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        rotateWords();
    });
}

rotateWords();


// Highlighted events section 
const highlightedEventsContainer = document.querySelector('.highlighted-events-container');

let highlightedEvents = [
    { image: "/images/Highlighted/Matheran.jpg" },
    { image: "/images/Highlighted/Kerela.jpg" },
    { image: "/images/Highlighted/Saputara.jpg" },
    { image: "/images/Highlighted/Mahabaleshwar.jpg" },
    { image: "/images/Highlighted/DiscoverDangs.jpg" },
    { image: "/images/Highlighted/PoloForest.jpg" },
    { image: "/images/Highlighted/ValleyOfFlowers.jpg" },
];

highlightedEvents.forEach(event => {
    // Create new card
    const eventcard = document.createElement('div');
    eventcard.classList.add('event-card');

    // Set background image
    eventcard.style.backgroundImage = `url(${event.image})`;
    eventcard.style.backgroundSize = 'cover';
    eventcard.style.backgroundPosition = 'center';

    // Create and add heading
    const heading = document.createElement('h2');
    heading.textContent = event.name;
    heading.style.color = 'white';
    heading.style.textShadow = '1px 1px 5px black';

    eventcard.appendChild(heading);
    highlightedEventsContainer.appendChild(eventcard);
});


// Weekend events section
const weekendEventsContainer = document.querySelector('.weekend-events-container');
let weekendEvents = [
    { image: "/images/Weekend/bakor.jpg" },
    { image: "/images/Weekend/dangs.jpg" },
    { image: "/images/Weekend/maharashtra.jpg" },
    { image: "/images/Weekend/matheran.jpg" },
    { image: "/images/Weekend/panchgani.jpg" },
    { image: "/images/Weekend/poloForest.jpg" },
    { image: "/images/Weekend/saputara.jpg" },
];

weekendEvents.forEach(event => {
    // Create new card
    const eventcard = document.createElement('div');
    eventcard.classList.add('event-card');

    // Set background image
    eventcard.style.backgroundImage = `url(${event.image})`;
    eventcard.style.backgroundSize = 'cover';
    eventcard.style.backgroundPosition = 'center';

    // Create and add heading
    const heading = document.createElement('h2');
    heading.textContent = event.name;
    heading.style.color = 'white';
    heading.style.textShadow = '1px 1px 5px black';

    eventcard.appendChild(heading);
    weekendEventsContainer.appendChild(eventcard);
});
