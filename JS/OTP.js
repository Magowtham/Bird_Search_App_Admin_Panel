const OTP = document.querySelector("#OTP-form");

async function handleOTP(e) {
  e.preventDefault();
  const data = { otp: e.target[0].value };
  const response = await fetch("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  switch (response.status) {
    case 200:
      window.location.href = "http://127.0.0.1:5500/HTML/reset.html";
      break;
    default:
      alert(result.error);
  }
}
OTP.addEventListener("submit", handleOTP);
