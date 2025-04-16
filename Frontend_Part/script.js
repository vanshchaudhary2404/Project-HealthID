// function scanRFID() {
//   const alertBox = document.createElement("div");
//   alertBox.className = "alert alert-info m-3";
//   alertBox.role = "alert";
//   alertBox.innerHTML = `Scanning RFID/NFC card...`;

//   document.body.prepend(alertBox);

//   setTimeout(() => {
//     alertBox.remove();
//     window.location.href = "dashboard.html";
//   }, 2000); // Optional delay to simulate alert before redirect
// }

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
