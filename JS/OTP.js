const OTP = document.querySelector("#OTP-form");
const loginBtn = document.querySelector("#verify-btn");
const loginBtnText = loginBtn.children[0];
const spinner = loginBtn.children[1];
async function handleOTP(e) {
  e.preventDefault();
  const data = { otp: e.target[0].value };
  try {
    spinner.classList.add("loading");
    loginBtnText.style.opacity = 0;
    loginBtn.disable = true;
    loginBtn.style.opacity = 0.8;
    const response = await fetch("http://localhost:8000/admin/verify_otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials:"include"
    });
    const result = await response.json();
    switch (response.status) {
      case 200:
        window.location.href = `http://127.0.0.1:5500/HTML/reset.html?email=${result.email}`;
        break;
      default:
        alert(result.error);
    }
  } catch (error) {
    alert("failed to verify OTP");
  } finally {
    spinner.classList.remove("loading");
    loginBtnText.style.opacity = 1;
    loginBtn.disable = false;
    loginBtn.style.opacity = 1;
  }
}
OTP.addEventListener("submit", handleOTP);
