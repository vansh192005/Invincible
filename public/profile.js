// Update Modal Elements
const updateModal = document.getElementById("updateBookingModal");
const updateModalCloseBtn = updateModal.querySelector(".close-btn");
const updateParticipantsButtonsDiv = document.getElementById("updateParticipantsButtons");
const updateParticipantsFormsDiv = document.getElementById("updateParticipantsForms");
const updateBookingIdInput = document.getElementById("updateBookingId");

// ===== Function to open update modal with prefilled data =====
function openUpdateModal(bookingData) {
  updateModal.style.display = "block";

  // Set booking id
  updateBookingIdInput.value = bookingData.booking_id;

  // Clear old buttons
  updateParticipantsButtonsDiv.innerHTML = "";

  // Create participant selector buttons based on data length
  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${i}`;
    btn.addEventListener("click", () => {
      document.querySelectorAll("#updateParticipantsButtons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      generateUpdateForms(i, bookingData.participants);
    });
    updateParticipantsButtonsDiv.appendChild(btn);
  }

  // Default show participants already booked
  let count = bookingData.participants.length;
  generateUpdateForms(count, bookingData.participants);
  updateParticipantsButtonsDiv.querySelectorAll("button")[count - 1].classList.add("active");
}

// ===== Generate Update Forms with prefilled values =====
function generateUpdateForms(count, participantsData) {
  updateParticipantsFormsDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = participantsData[i] || {};
    updateParticipantsFormsDiv.innerHTML += `
      <div class="participant-form">
        <h3>Participant (${i + 1})</h3>

        <label>First Name</label>
        <input type="text" name="firstName[]" value="${p.first_name || ""}" placeholder="First Name ${i + 1}" required>

        <label>Last Name</label>
        <input type="text" name="lastName[]" value="${p.last_name || ""}" placeholder="Last Name ${i + 1}" required>

        <label>Mobile</label>
        <input type="text" name="phone[]" value="${p.phone || ""}" placeholder="Mobile" required>

        <label>Birthdate</label>
        <input type="date" name="birthdate[]" value="${p.birthdate ? new Date(p.birthdate).toISOString().split('T')[0] : ""}" required>

        <label>Gender</label>
        <select name="gender[]" required>
          <option value="">Select Gender</option>
          <option value="Male" ${p.gender === "Male" ? "selected" : ""}>Male</option>
          <option value="Female" ${p.gender === "Female" ? "selected" : ""}>Female</option>
        </select>

        <input type="hidden" name="participantId[]" value="${p.participant_id || ''}"> 

        <hr>
      </div>
    `;
  }
}

// ===== Close Modal =====
updateModalCloseBtn.addEventListener("click", () => {
  updateModal.style.display = "none";
});

// ===== Example usage: When user clicks "Update" button on row =====
document.querySelectorAll(".update-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const bookingData = JSON.parse(btn.dataset.booking); // server se JSON string bhejna hoga
    openUpdateModal(bookingData); // call function with prefilled data
  });
});
