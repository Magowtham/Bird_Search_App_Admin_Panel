const reset = document.querySelector("#reset-form");
const loginBtn = document.querySelector("#reset-btn");
const loginBtnText = loginBtn.children[0];
const spinner = loginBtn.children[1];

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
async function handelReset(e) {
  e.preventDefault();
  const newPassword = e.target[0].value;
  const confirmPassword = e.target[1].value;
  try {
    spinner.classList.add("loading");
    loginBtnText.style.opacity = 0;
    loginBtn.disable = true;
    loginBtn.style.opacity = 0.8;
    if (newPassword === confirmPassword) {
      const response = await fetch("http://localhost:8000/admin/set_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: confirmPassword }),
        credentials: "include",
      });
      const result = await response.json();
      console.log(response.status);
      if (response.status === 202) {
        window.location.href = "http://127.0.0.1:5500/HTML/admin_login.html";
      } else {
        alert(result.error);
      }
    } else {
      alert("password is not matching!");
    }
  } catch (error) {
    alert("faild to set password");
  } finally {
    spinner.classList.remove("loading");
    loginBtnText.style.opacity = 1;
    loginBtn.disable = false;
    loginBtn.style.opacity = 1;
  }
}
reset.addEventListener("submit", handelReset);
