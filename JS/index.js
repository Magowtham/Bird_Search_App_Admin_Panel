const loginForm = document.querySelector("#login-form");

async function handleLogin(e) {
  e.preventDefault();
  const data = { email: e.target[0].value, password: e.target[1].value };
  const response = await fetch(
    "https://chirrp-app-test.onrender.com/admin/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );
  const result = await response.json();
  switch (response.status) {
    case 200:
      window.location.href = "http://127.0.0.1:5500/HTML/admin.html";
      break;
    default:
      alert(result.error);
  }
}
loginForm.addEventListener("submit", handleLogin);
