const addEventBtn = document.querySelector("#addEventBtn");
const addEventDetailsBtn = document.querySelector("#addEventDetailsBtn");
const addEventForm = document.querySelector("#eventForm");
const addEventDetailsForm = document.querySelector("#eventDetailsForm");
const closeBtns = document.querySelectorAll(".close-btn");

// Show "Add Event" form
addEventBtn.addEventListener("click", () => {
  addEventForm.style.display = "block";
  addEventDetailsForm.style.display = "none"; // ✅ doosra hide
});

// Show "Add Event Details" form
addEventDetailsBtn.addEventListener("click", () => {
  addEventDetailsForm.style.display = "block";
  addEventForm.style.display = "none"; // ✅ doosra hide
});

// Hide whichever form ka close button press hua
closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest("form").style.display = "none"; // sirf us form ko hide karega
  });
});
