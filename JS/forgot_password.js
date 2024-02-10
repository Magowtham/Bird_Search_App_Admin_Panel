const forgot = document.querySelector("#forgot-form");
const loginBtn = document.querySelector("#otp-btn");
const loginBtnText = loginBtn.children[0];
const spinner = loginBtn.children[1];

async function handleForgot(e) {
  e.preventDefault();
  const data = { email: e.target[0].value };
  try {
    spinner.classList.add("loading");
    loginBtnText.style.opacity = 0;
    loginBtn.disable = true;
    loginBtn.style.opacity = 0.8;
    const response = await fetch("http://localhost:8000/admin/get_otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials:"include"
    });
    const result = await response.json();
    switch (response.status) {
      case 200:
        window.location.href = "http://127.0.0.1:5500/HTML/otp.html";
        break;
      default:
        alert(result.error);
    }
  } catch (error) {
    alert("failed to get otp");
  } finally {
    spinner.classList.remove("loading");
    loginBtnText.style.opacity = 1;
    loginBtn.disable = false;
    loginBtn.style.opacity = 1;
  }
}
forgot.addEventListener("submit", handleForgot);
