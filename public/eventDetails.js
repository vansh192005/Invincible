const modal = document.getElementById("bookingModal");
const bookNowBtn = document.querySelector(".book-now-btn");
const modalCloseBtn = document.querySelector(".close-btn");
const participantsButtonsDiv = document.getElementById("participantsButtons");
const participantsFormsDiv = document.getElementById("participantsForms");

// Show modal
bookNowBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal
modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Create participant selector buttons (1 to 6)
for (let i = 1; i <= 6; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".participants-selector button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    generateForms(i);
  });
  participantsButtonsDiv.appendChild(btn);
}

// Generate participant forms
function generateForms(count) {
  participantsFormsDiv.innerHTML = ""; // clear old forms
  for (let i = 1; i <= count; i++) {
    participantsFormsDiv.innerHTML += `
      <div class="participant-form">
        <h3>Participant (${i})</h3>

        <label>First Name</label>
        <input type="text" name="firstName" placeholder="First Name" required>

        <label>Last Name</label>
        <input type="text" name="lastName" placeholder="Last Name" required>

        <label>Mobile</label>
        <input type="text" name="phone" placeholder="Mobile" required>

        <label>Birthdate</label>
        <input type="date" name="birthdate" required>

        <label>Gender</label>
        <select required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <hr>
      </div>
    `;
  }
}


