const reset = document.querySelector("#reset-form");

async function handelReset(e) {
  e.preventDefault();
  const newPassword = e.target[0].value;
  const confirmPassword = e.target[1].value;
  if (newPassword === confirmPassword) {
    const response = await fetch(" ", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmPassword),
    });
    const result = await response.json();
    if (response.ok) {
      window.location.href = "http://127.0.0.1:5500/HTML/index.html";
    } else {
      alert("Error: Unable to save password");
    }
  } else {
    alert("Password is not matching");
  }
}
reset.addEventListener("submit", handelReset);
