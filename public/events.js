// Sidebar Toggle Functionality
let hamburger = document.querySelector('.hamburger');
let sidebar = document.querySelector('.sidebar');
let closeBtn = document.querySelector('.close-btn button');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('show');
})

// Event Card
let eventList = document.querySelector('.event-list');
let eventCard = document.querySelector('.event-card');

// let events = [
//     {
//         id: uuidv4(),
//         image: "/images/Events/jagatsukh_expedition.jpg",
//         title: "Mt Jagatsukh Expedition",
//         description: `From \u20B9${15000}/- 8 days/7 nights`
//     },
//     {
//         id: uuidv4(),
//         image: "/images/Events/Kerela.jpg",
//         title: "Kerela Calling",
//         description: `From \u20B9${9,999}/- 3 days/2 nights`
//     },
//     {
//         id: uuidv4(),
//         image: "/images/Events/Matheran.jpg",
//         title: "Explore & Adore: Marvellous Matheran",
//         description: `From \u20B9${6,500}/- 3 days/2 nights`
//     },
//     {
//         id: uuidv4(),
//         image: "/images/Events/Saputara.jpg",
//         title: "Saputara Family Camp",
//         description: `From \u20B9${3,300}/- 3 days/2 nights`
//     },
//     {
//         id: uuidv4(),
//         image: "/images/Events/Maharashtra.jpg",
//         title: "Magical Maharashtra",
//         description: `From \u20B9${3,900}/- 3 days/2 nights`
//     },
//     {
//         id: uuidv4(),
//         image: "/images/Events/Vaarso_cycling.jpg",
//         title: "Vaarso Cycling Expedition",
//         description: `From \u20B9${999}/- 5 days/4 nights`
//     },
// ];

// events.forEach(event => {

//     let eventCard = document.createElement('div');
//     eventCard.classList.add('event-card');

//     eventCard.innerHTML = `
//     <img src="${event.image}" alt="${event.title}">
//     <h4>${event.title}</h4>
//     <div class="event-info">
//         <p>${event.description}</p>
//     </div>
// `;
//     eventCard.addEventListener('click', () => {
//         window.location.href = `/events/${event.id}`;
//     })
//     eventList.appendChild(eventCard);
// })