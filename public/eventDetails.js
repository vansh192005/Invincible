const modal = document.getElementById("bookingModal");
const bookNowBtn = document.querySelector(".book-now-btn");
const modalCloseBtn = document.querySelector(".close-btn");
const participantsButtonsDiv = document.getElementById("participantsButtons");
const participantsFormsDiv = document.getElementById("participantsForms");
const eventIdInput = document.getElementById("event_id");

// Show modal
bookNowBtn.addEventListener("click", () => {
  modal.style.display = "block";

  // Set event_id dynamically (example: data attribute on button)
  eventIdInput.value = bookNowBtn.dataset.eventId;

  // Default show 1 participant
  generateForms(1);
  participantsButtonsDiv.querySelector("button").classList.add("active");
});

// Close modal
modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Create participant selector buttons (1 to 6)
for (let i = 1; i <= 6; i++) {
  const btn = document.createElement("button");
  btn.type = "button"; // prevent form submit
  btn.textContent = `${i}`;
  btn.addEventListener("click", () => {
    document.querySelectorAll("#participantsButtons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    generateForms(i);
  });
  participantsButtonsDiv.appendChild(btn);
}

// Generate participant forms dynamically
function generateForms(count) {
  participantsFormsDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    participantsFormsDiv.innerHTML += `
      <div class="participant-form">
        <h3>Participant (${i+1})</h3>

        <label>First Name</label>
        <input type="text" name="firstName[]" placeholder="First Name ${i+1}" required>

        <label>Last Name</label>
        <input type="text" name="lastName[]" placeholder="Last Name ${i+1}" required>

        <label>Mobile</label>
        <input type="text" name="phone[]" placeholder="Mobile" required>

        <label>Birthdate</label>
        <input type="date" name="birthdate[]" required>

        <label>Gender</label>
        <select name="gender[]" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <hr>
      </div>
    `;
  }
}
