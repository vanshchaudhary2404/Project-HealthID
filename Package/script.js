// Import necessary modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZi_ctVvu77IyLpLYKgHw6Q8T2h3zgPuc",
  authDomain: "healthid-dba33.firebaseapp.com",
  projectId: "healthid-dba33",
  storageBucket: "healthid-dba33.firebasestorage.app",
  messagingSenderId: "644379177641",
  appId: "1:644379177641:web:ca7b5d50a111a9d1f42fb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Global patientId variable
let patientId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Capture patientId from URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  patientId = urlParams.get('patientId') || localStorage.getItem('patientID');
  
  if (patientId) {
    localStorage.setItem('patientID', patientId); // Ensure consistent casing
    fetchPatientData(patientId); // Load data immediately
  } else {
    console.warn("No patientId found, dashboard may be empty.");
    // Optionally redirect to patient-id.html if no patientId
    // window.location.href = "patient-id.html";
  }
});

async function fetchPatientData(id) {
  const patientRef = doc(db, "patients", id);
  const patientSnap = await getDoc(patientRef);

  if (patientSnap.exists()) {
    const data = patientSnap.data();
    console.log("Fetched data:", data);

    document.getElementById("patientName").value = data.personalInfo?.name || "";
    document.getElementById("patientGender").value = data.personalInfo?.gender || "";
    document.getElementById("patientDOB").value = data.personalInfo?.dob || "";
    document.getElementById("patientStatus").value = data.personalInfo?.status || "";
    document.getElementById("bloodType").value = data.bloodAndAllergies?.bloodType || "";
    document.getElementById("emergencyContactName").value = data.emergencyContact?.name || "";
    document.getElementById("emergencyContactPhone").value = data.emergencyContact?.phone || "";
    document.getElementById("insuranceProvider").value = data.insuranceDetails?.provider || "";
    document.getElementById("insurancePolicy").value = data.insuranceDetails?.policyNumber || "";
    document.getElementById("insuranceGroup").value = data.insuranceDetails?.groupNumber || "";
    document.getElementById("insuranceStatus").value = data.insuranceDetails?.status || "";
    document.getElementById("lastCheckupDate").value = data.lastCheckup?.date || "";
    document.getElementById("lastCheckupDoctor").value = data.lastCheckup?.doctor || "";
    document.getElementById("lastCheckupBP").value = data.lastCheckup?.bp || "";
    document.getElementById("lastCheckupHR").value = data.lastCheckup?.heartRate || "";
    document.getElementById("lastCheckupWeight").value = data.lastCheckup?.weight || "";

    populateList("medicationsList", data.currentMedications || [], "name", "dose", "frequency");
    populateList("historyList", data.medicalHistory || [], "condition", "date", "notes");
    populateList("vaccinationList", data.vaccinationStatus || [], "name", "date", "status");
    populateList("allergiesList", data.bloodAndAllergies?.allergies || [], null);
    populateList("notesList", data.staffNotes || [], "author", "date", "note");
  } else {
    alert("Patient not found!");
  }
}

function populateList(containerId, dataArray, key1, key2, key3) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!dataArray || dataArray.length === 0) {
    container.innerHTML = "<p class='text-muted'>No data available.</p>";
    return;
  }

  dataArray.forEach((item) => {
    const div = document.createElement("div");
    div.className = "d-flex gap-2 mb-2";
    const p = document.createElement("p");
    if (containerId === "allergiesList" && typeof item === "string") {
      p.innerText = item;
    } else if (key1 && key2 && key3) {
      p.innerText = `${item[key1]} - ${item[key2]} (${item[key3]})`;
    } else if (key1 && key2) {
      p.innerText = `${item[key1]} - ${item[key2]}`;
    } else if (typeof item === "string") {
      p.innerText = item;
    } else {
      p.innerText = JSON.stringify(item);
    }
    div.appendChild(p);
    container.appendChild(div);
  });
}

// Login and Edit Functionality
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in as:", user.email);

        const inputs = document.querySelectorAll("input");
        inputs.forEach(function(input) {
          input.disabled = false;
        });

        const buttons = [
          "addMedicationBtn", "addAllergyBtn", "addHistoryBtn", "addVaccineBtn",
          "addNoteBtn", "cancelEditBtn", "saveAllChangesBtn"
        ];
        buttons.forEach(btnId => {
          const btn = document.getElementById(btnId);
          if (btn) btn.classList.remove("d-none");
          else console.error(`Button with ID ${btnId} not found`);
        });

        const navbarUsername = document.getElementById("navbar-username");
        if (navbarUsername) {
          navbarUsername.textContent = user.email;
          navbarUsername.style.display = "block";
        }

        const logoutButton = document.getElementById("logout-button");
        if (logoutButton) {
          logoutButton.style.display = "block";
          logoutButton.addEventListener("click", function() {
            signOut(auth).then(() => {
              console.log("Logged out successfully");
              inputs.forEach(function(input) {
                input.disabled = true;
              });
              document.getElementById("navbar-username").style.display = "none";
              document.getElementById("logout-button").style.display = "none";
              document.querySelectorAll(".btn").forEach(btn => btn.classList.add("d-none"));
            }).catch((error) => {
              console.error("Error logging out:", error);
            });
          });
        } else {
          console.error("Logout button not found");
        }

        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
        if (loginModal) loginModal.hide();
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("Login failed: " + error.message);
      });
  });

  document.getElementById("updateInfoButton").addEventListener("click", function() {
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
  });

  // Initials update
  const patientNameInput = document.getElementById('patientName');
  const initialsDiv = document.getElementById('patientInitials');
  function updateInitials() {
    const name = patientNameInput.value.trim();
    if (name) {
      const initials = name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
      initialsDiv.textContent = initials;
    } else {
      initialsDiv.textContent = '';
    }
  }
  patientNameInput.addEventListener('input', updateInitials);
  updateInitials();

  // Add Medication
  document.getElementById("addMedicationBtn").addEventListener("click", function() {
    const medicationsList = document.getElementById("medicationsList");
    const newMedDiv = document.createElement("div");
    newMedDiv.className = "d-flex gap-2 mb-2";
    const newMed = document.createElement("input");
    newMed.type = "text";
    newMed.className = "form-control";
    newMed.placeholder = "Medication Name - Dose (Frequency)";
    newMedDiv.appendChild(newMed);
    medicationsList.appendChild(newMedDiv);
  });

  // Add Allergy
  document.getElementById("addAllergyBtn").addEventListener("click", function() {
    const allergiesList = document.getElementById("allergiesList");
    const newAllergyDiv = document.createElement("div");
    newAllergyDiv.className = "d-flex gap-2 mb-2";
    const newAllergy = document.createElement("input");
    newAllergy.type = "text";
    newAllergy.className = "form-control";
    newAllergy.placeholder = "Allergy";
    newAllergyDiv.appendChild(newAllergy);
    allergiesList.appendChild(newAllergyDiv);
  });

  // Add History
  document.getElementById("addHistoryBtn").addEventListener("click", function() {
    const historyList = document.getElementById("historyList");
    const newHistoryDiv = document.createElement("div");
    newHistoryDiv.className = "d-flex gap-2 mb-2";
    const newHistory = document.createElement("input");
    newHistory.type = "text";
    newHistory.className = "form-control";
    newHistory.placeholder = "Condition - Date (Notes)";
    newHistoryDiv.appendChild(newHistory);
    historyList.appendChild(newHistoryDiv);
  });

  // Add Vaccine
  document.getElementById("addVaccineBtn").addEventListener("click", function() {
    const vaccinationList = document.getElementById("vaccinationList");
    const newVaccineDiv = document.createElement("div");
    newVaccineDiv.className = "d-flex gap-2 mb-2";
    const newVaccine = document.createElement("input");
    newVaccine.type = "text";
    newVaccine.className = "form-control";
    newVaccine.placeholder = "Vaccine Name - Date (Status)";
    newVaccineDiv.appendChild(newVaccine);
    vaccinationList.appendChild(newVaccineDiv);
  });

  // Add Note
  document.getElementById("addNoteBtn").addEventListener("click", function() {
    const notesList = document.getElementById("notesList");
    const newNoteDiv = document.createElement("div");
    newNoteDiv.className = "d-flex gap-2 mb-2";
    const newNote = document.createElement("input");
    newNote.type = "text";
    newNote.className = "form-control";
    newNote.placeholder = "Author - Date (Note)";
    newNoteDiv.appendChild(newNote);
    notesList.appendChild(newNoteDiv);
  });

  // Cancel Edit
  document.getElementById("cancelEditBtn").addEventListener("click", function() {
    fetchPatientData(patientId);
  });

  // Save All Changes
  const saveButton = document.getElementById("saveAllChangesBtn");
  if (saveButton) {
    saveButton.addEventListener("click", async function() {
      console.log("Save button clicked");
      const patientRef = doc(db, "patients", patientId);
      const patientSnap = await getDoc(patientRef);
      const data = patientSnap.data() || {};

      console.log("Current data from Firebase:", data);
      const newMedications = Array.from(document.querySelectorAll("#medicationsList input")).map(input => input.value);
      const newAllergies = Array.from(document.querySelectorAll("#allergiesList input")).map(input => input.value);
      const newHistory = Array.from(document.querySelectorAll("#historyList input")).map(input => input.value);
      const newVaccines = Array.from(document.querySelectorAll("#vaccinationList input")).map(input => input.value);
      const newNotes = Array.from(document.querySelectorAll("#notesList input")).map(input => input.value);
      console.log("New Medications:", newMedications);
      console.log("New Allergies:", newAllergies);
      console.log("New History:", newHistory);
      console.log("New Vaccines:", newVaccines);
      console.log("New Notes:", newNotes);

      const allData = {
        personalInfo: {
          name: document.getElementById("patientName").value,
          gender: document.getElementById("patientGender").value,
          dob: document.getElementById("patientDOB").value,
          status: document.getElementById("patientStatus").value
        },
        bloodAndAllergies: {
          bloodType: document.getElementById("bloodType").value,
          allergies: [
            ...data.bloodAndAllergies?.allergies || [],
            ...newAllergies.map(allergy => allergy.trim()).filter(v => v)
          ]
        },
        emergencyContact: {
          name: document.getElementById("emergencyContactName").value,
          phone: document.getElementById("emergencyContactPhone").value
        },
        currentMedications: [
          ...data.currentMedications || [],
          ...newMedications.map(med => {
            console.log("Processing medication:", med);
            const parts = med.split(" - ");
            if (parts.length === 2) {
              const name = parts[0].trim();
              const doseAndFrequency = parts[1].trim().split(" (");
              if (doseAndFrequency.length === 2) {
                const dose = doseAndFrequency[0].trim();
                const frequency = doseAndFrequency[1].replace(")", "").trim();
                if (name && dose && frequency) {
                  return { name: name, dose: dose, frequency: frequency };
                }
              }
            }
            console.warn("Invalid medication format, skipping:", med);
            return null;
          }).filter(Boolean)
        ],
        medicalHistory: [
          ...data.medicalHistory || [],
          ...newHistory.map(history => {
            const historyParts = history.split(" - ");
            if (historyParts.length === 2) {
              const condition = historyParts[0].trim();
              const dateAndNotes = historyParts[1].trim().split(" (");
              if (dateAndNotes.length === 2) {
                const date = dateAndNotes[0].trim();
                const notes = dateAndNotes[1].replace(")", "").trim();
                return { condition: condition, date: date, notes: notes };
              }
            }
            console.warn("Invalid history format, skipping:", history);
            return null;
          }).filter(Boolean)
        ],
        vaccinationStatus: [
          ...data.vaccinationStatus || [],
          ...newVaccines.map(vaccine => {
            const vaccineParts = vaccine.split(" - ");
            if (vaccineParts.length === 2) {
              const vaccineName = vaccineParts[0].trim();
              const dateAndStatus = vaccineParts[1].trim().split(" (");
              if (dateAndStatus.length === 2) {
                const date = dateAndStatus[0].trim();
                const status = dateAndStatus[1].replace(")", "").trim();
                return { name: vaccineName, date: date, status: status };
              }
            }
            console.warn("Invalid vaccine format, skipping:", vaccine);
            return null;
          }).filter(Boolean)
        ],
        insuranceDetails: {
          provider: document.getElementById("insuranceProvider").value,
          policyNumber: document.getElementById("insurancePolicy").value,
          groupNumber: document.getElementById("insuranceGroup").value,
          status: document.getElementById("insuranceStatus").value
        },
        lastCheckup: {
          date: document.getElementById("lastCheckupDate").value,
          doctor: document.getElementById("lastCheckupDoctor").value,
          bp: document.getElementById("lastCheckupBP").value,
          heartRate: document.getElementById("lastCheckupHR").value,
          weight: document.getElementById("lastCheckupWeight").value
        },
        staffNotes: [
          ...data.staffNotes || [],
          ...newNotes.map(note => {
            const noteParts = note.split(" - ");
            if (noteParts.length === 2) {
              const author = noteParts[0].trim();
              const dateAndNote = noteParts[1].trim().split(" (");
              if (dateAndNote.length === 2) {
                const date = dateAndNote[0].trim();
                const noteText = dateAndNote[1].replace(")", "").trim();
                return { author: author, date: date, note: noteText };
              }
            }
            console.warn("Invalid note format, skipping:", note);
            return null;
          }).filter(Boolean)
        ],
        lastUpdated: new Date().toISOString()
      };

      console.log("Data to be saved:", allData);

      try {
        await updateDoc(patientRef, allData);
        console.log("Update successful, fetching fresh data...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        const freshSnap = await getDoc(patientRef);
        console.log("Fresh data after update:", freshSnap.data());
        await fetchPatientData(patientId);
        alert("Successfully updated in database!");
      } catch (error) {
        console.error("Error saving all changes:", error);
        alert("Error updating database: " + error.message);
      }
    });
  } else {
    console.error("Save button with ID 'saveAllChangesBtn' not found in the DOM");
  }
});