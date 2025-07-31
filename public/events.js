// Sidebar Toggle Functionality
let hamburger = document.querySelector('.hamburger');
let sidebar = document.querySelector('.sidebar');
let closeBtn = document.querySelector('.close-btn button');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('show');
})

// Event Card
let eventList = document.querySelector('.event-list');
let events = [
    {
        image: "/images/Events/jagatsukh_expedition.jpg",
        title: "Mt Jagatsukh Expedition",
        description: `From \u20B9${15000}/- 8 days/7 nights`
    },
    {
        image: "/images/Events/Kerela.jpg",
        title: "Kerela Calling",
        description: `From \u20B9${9,999}/- 3 days/2 nights`
    },
    {
        image: "/images/Events/Matheran.jpg",
        title: "Explore & Adore: Marvellous Matheran",
        description: `From \u20B9${6,500}/- 3 days/2 nights`
    },
    {
        image: "/images/Events/Saputara.jpg",
        title: "Saputara Family Camp",
        description: `From \u20B9${3,300}/- 3 days/2 nights`
    },
    {
        image: "/images/Events/Maharashtra.jpg",
        title: "Magical Maharashtra",
        description: `From \u20B9${3,900}/- 3 days/2 nights`
    },
    {
        image: "/images/Events/Vaarso_cycling.jpg",
        title: "Vaarso Cycling Expedition",
        description: `From \u20B9${999}/- 5 days/4 nights`
    },
];

events.forEach(event => {
    let eventCard = document.createElement('div');
    eventCard.classList.add('event-card');

    eventCard.innerHTML = `
    <img src="${event.image}" alt="${event.title}">
    <h4>${event.title}</h4>
    <div class="event-info">
        <p>${event.description}</p>
    </div>
`;


    eventList.appendChild(eventCard);
})