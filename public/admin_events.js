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


// Delete Event 
document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const eventTitle = btn.getAttribute("data-title"); // title fetch karega
    if (confirm(`Are you sure you want to delete "${eventTitle}" ?`)) {
      const res = await fetch(`/admin_events/${encodeURIComponent(eventTitle)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("Event deleted successfully!");
        window.location.reload(); // refresh after delete
      } else {
        alert("Failed to delete event.");
      }
    }
  });
});
