// Firebase config
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      databaseURL: "YOUR_DATABASE_URL",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    document.getElementById("fetchDetailsButton").addEventListener("click", () => {
      const patientId = document.getElementById("patientIdInput").value.trim();
      if (!patientId) return alert("Please enter a valid Patient ID.");

      firebase.database().ref("patients/" + patientId).once("value")
        .then(snapshot => {
          if (!snapshot.exists()) return alert("Patient not found.");

          const data = snapshot.val();

          // Patient Info
          document.getElementById("patientName").textContent = data.name || '';
          document.getElementById("patientGender").textContent = data.gender || '';
          document.getElementById("patientDOB").textContent = data.dob || '';
          document.getElementById("patientStatus").textContent = data.status || '';

          // Blood & Allergies
          document.getElementById("bloodType").textContent = data.bloodType || '';
          document.getElementById("allergiesList").innerHTML = (data.allergies || []).map(a => `<div class="badge bg-danger">${a}</div>`).join(' ');

          // Emergency Contact
          document.getElementById("emergencyContactName").textContent = data.emergencyContact?.name || '';
          document.getElementById("emergencyContactPhone").textContent = data.emergencyContact?.phone || '';

          // Medications
          document.getElementById("medicationsList").innerHTML = (data.medications || []).map(m => `<div>${m}</div>`).join('');

          // History
          document.getElementById("historyList").innerHTML = (data.medicalHistory || []).map(h => `<div>${h}</div>`).join('');

          // Insurance
          document.getElementById("insuranceProvider").textContent = data.insurance?.provider || '';
          document.getElementById("insurancePolicy").textContent = data.insurance?.policy || '';
          document.getElementById("insuranceGroup").textContent = data.insurance?.group || '';
          document.getElementById("insuranceStatus").textContent = data.insurance?.status || '';

          // Vaccination
          document.getElementById("vaccinationList").innerHTML = (data.vaccinations || []).map(v => `<div>${v}</div>`).join('');

          // Last Checkup
          document.getElementById("lastCheckupDate").textContent = data.lastCheckup?.date || '';
          document.getElementById("lastCheckupDoctor").textContent = data.lastCheckup?.doctor || '';
          document.getElementById("lastCheckupBP").textContent = data.lastCheckup?.bp || '';
          document.getElementById("lastCheckupHR").textContent = data.lastCheckup?.heartRate || '';
          document.getElementById("lastCheckupWeight").textContent = data.lastCheckup?.weight || '';

          // Staff Notes
          document.getElementById("notesList").innerHTML = (data.staffNotes || []).map(n => `<div>${n}</div>`).join('');
        })
        .catch(err => {
          console.error(err);
          alert("Failed to fetch patient data.");
        });
    });


function scanRFID() {
  const toastEl = document.getElementById('rfidToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 2000 }); // 2 sec duration
  toast.show();

  // Redirect after toast disappears
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 2200); // Slightly longer than toast delay
}


function enterPatientID() {
  
  window.location.href = "patient-id.html";
  if (patientID) {
    window.location.href = "dashboard.html";
  }
}
