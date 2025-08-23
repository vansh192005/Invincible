const modal = document.getElementById("bookingModal");
const bookNowBtn = document.querySelector(".book-now-btn");
const modalCloseBtn = document.querySelector(".close-btn");
const participantsButtonsDiv = document.getElementById("participantsButtons");
const participantsFormsDiv = document.getElementById("participantsForms");
// id ho ya na ho, name se pakad lo (safer)
const eventIdInput = document.querySelector('input[name="event_id"]');

// ✅ Global age limits — har event ke click par update honge
let minAge = 0, maxAge = 120;

// Show modal
bookNowBtn.addEventListener("click", () => {
  modal.style.display = "block";

  // dataset camelCase
  if (eventIdInput) eventIdInput.value = bookNowBtn.dataset.eventId || "";

  // Parse age_group, e.g. "12-45 years" / "12 years & above"
  const ageGroup = bookNowBtn.dataset.ageGroup || "";
  const nums = (ageGroup.match(/\d+/g) || []).map(n => parseInt(n, 10));

  if (nums.length >= 2) {        // "12-45"
    [minAge, maxAge] = [nums[0], nums[1]];
  } else if (nums.length === 1) { // "12+"
    minAge = nums[0];
    maxAge = 120;
  } else {
    minAge = 0; maxAge = 120;     // fallback
  }

  // Default show 1 participant
  generateForms(1);
  participantsButtonsDiv.querySelector("button").classList.add("active");
});

// Close modal
modalCloseBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Buttons 1..6
for (let i = 1; i <= 6; i++) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = `${i}`;
  btn.addEventListener("click", () => {
    document.querySelectorAll("#participantsButtons button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    generateForms(i);
  });
  participantsButtonsDiv.appendChild(btn);
}

// Forms
function generateForms(count) {
  participantsFormsDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    participantsFormsDiv.innerHTML += `
      <div class="participant-form">
        <h3>Participant (${i + 1})</h3>

        <label>First Name</label>
        <input type="text" name="firstName[]" placeholder="First Name ${i + 1}" required>

        <label>Last Name</label>
        <input type="text" name="lastName[]" placeholder="Last Name ${i + 1}" required>

        <label>Mobile</label>
        <input type="text" name="phone[]" placeholder="Mobile" required>

        <label>Birthdate</label>
        <input type="date" name="birthdate[]" required onchange="validateBirthdate(this)">
        <span class="error-message" style="color:red;font-size:12px;"></span>

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

// ✅ Birthdate Validation (globals minAge/maxAge use karega)
function validateBirthdate(input) {
  const errorSpan = input.nextElementSibling; // span right after input
  const val = input.value;
  errorSpan.textContent = ""; // reset

  if (!val) return true;

  const birthdate = new Date(val);
  const today = new Date();

  // Future date not allowed
  if (birthdate > today) {
    errorSpan.textContent = "Future date not allowed!";
    input.value = "";
    return false;
  }

  // Current year not allowed
  if (birthdate.getFullYear() === today.getFullYear()) {
    errorSpan.textContent = "Birth year cannot be current year!";
    input.value = "";
    return false;
  }

  // Calculate age precisely (month/day aware)
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) age--;

  // Check against event limits
  if (age < minAge || age > maxAge) {
    errorSpan.textContent = `Age must be between ${minAge} and ${maxAge} years.`;
    input.value = ""; // clear invalid
    return false;
  }

  return true;
}

// (Nice-to-have) — submit se pehle sab birthdates verify
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    let ok = true;
    participantsFormsDiv
      .querySelectorAll('input[name="birthdate[]"]')
      .forEach(inp => { if (!validateBirthdate(inp)) ok = false; });
    if (!ok) e.preventDefault();
  });
}
