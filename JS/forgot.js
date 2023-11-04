const forgot = document.querySelector("#forgot-form");

async function handleForgot(e) {
  e.preventDefault();
  const data = { email: e.target[0].value };
  const response = await fetch("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  switch (response.status) {
    case 200:
      window.location.href = "http://127.0.0.1:5500/HTML/OTP.html";
      break;
    default:
      alert(result.error);
  }
}
forgot.addEventListener("submit", handleForgot);
