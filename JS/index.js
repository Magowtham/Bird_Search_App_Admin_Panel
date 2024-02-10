const mainBody = document.querySelector(".main-body");
const birdListContainer = document.getElementById("bird-list-container");
const notification = document.querySelector(".notification");
const notificationBtn = document.querySelector(".notification button");
const notificationCountHolder = document.querySelector(".notification div h3");
const notificationPrev = document.querySelector(".notificationPrev");
const removePopUp = document.querySelector(".remove-bird-popup");
const overlay = document.querySelector(".bird-remove-overlay");
const closeBtn = document.querySelector("#remove-bird-close-btn");
const label = document.querySelector("#remove-bird-label");
const input = document.querySelector("#remove-bird-common-name");
const birdFinalRemoveBtn = document.querySelector("#bird-final-remove-btn");
const addBirdBtn = document.querySelector("#add-bird");
const logOutBtn = document.querySelector("#logout-btn");
const pageLoaderContainer = document.querySelector(".loader_container");
//url root decide section
let root = "",
  adminName = "",
  email = "";

(async () => {
  try {
    const response = await fetch("http://localhost:8000/admin/auto_login", {
      credentials: "include",
    });
    const result = await response.json();
    switch (response.status) {
      case 200:
        root = result.root;
        adminName = result.adminName;
        email = result.email;
        break;
      default:
        window.location.href = "admin_login.html";
    }
    if (root) {
      notification.classList.add("root_user");
    }
  } catch (error) {
    window.location.href = "admin_login.html";
  }
})();

async function getNotifications() {
  try {
    pageLoaderContainer.classList.add("loading");
    notificationBtn.disabled = true;
    const response = await fetch(
      "http://localhost:8000/admin/get_notifications",
      {
        credentials: "include",
      }
    );
    const result = await response.json();
    switch (response.status) {
      case 200:
        return result.notifications;
      case 401:
        window.location.href = "admin_login.html";
        break;
      default:
        alert(result.error);
    }
  } catch (error) {
    alert(error.message);
  } finally {
    pageLoaderContainer.classList.remove("loading");
    notificationBtn.disabled = false;
  }
}
async function renderNotificationPage() {
  birdListContainer.innerHTML = "";
  const result = await getNotifications();
  result.forEach((notification) => {
    birdListContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="form-group">
				<div class="card w-100 mt-3 w-25">
        <div class="card-body d-flex justify-content-between">
            <div class="d-flex align-items-center">
            <h5 class="text-capitalize">${notification.adminName}</h5>
            <h5 class="ml-5 font-weight-light " style="font-size: medium;">${
              notification.isEdited
                ? `Edited a Bird on  `
                : `Added a New Bird on  `
            }${notification.date} , ${notification.time}</h5>
            </div>
            <div>
            <button class="btn btn-success" id="preview">Preview</button>
            </div>
        </div>
    </div>
			</div>`
    );
  });
  notificationPrev.classList.add("visible");
  notificationPrev.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  const preview = document.querySelectorAll("#preview");
  preview.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `bird_form.html?root=${btoa(
        root
      )}&isPreview=${btoa(1)}&previewId=${btoa(result[index]._id)}`;
    });
  });
}
async function renderHomePage() {
  try {
    pageLoaderContainer.classList.add("loading");
    const response = await fetch("http://localhost:8000/admin/get_birds_info", {
      credentials: "include",
    });
    const result = await response.json();
    console.log(result);
    switch (response.status) {
      case 200:
        if (result.notificationCount) {
          notificationBtn.disabled = false;
        }
        createBirdList(result.birdsInfo);
        notificationCountHolder.textContent = result.notificationCount;
        break;

      case 500:
        console.log(result.error);
    }
  } catch (error) {
    console.log(error);
  } finally {
    pageLoaderContainer.classList.remove("loading");
  }

  function createBirdList(birds) {
    birds.forEach((birdInfo, index) => {
      console.log(birdInfo);
      birdListContainer.insertAdjacentHTML(
        "beforeend",
        ` <div class="form-group">
        <div class="card w-100 mt-3">
        <div class="card-body d-flex justify-content-between">
            <div class="d-flex align-items-center">
            <h5   class="ml-2">${index + 1}</h5>
            <h5 class="mr-5 ml-4 Cname">${birdInfo.commonName}</h5>
            <h5 class="Kname">${birdInfo.kannadaName}</h5>
            </div>
            <div class="buttons">
            <button class="btn btn-success" id="edit-bird" ${
              birdInfo.isNotificationExists ? `disabled` : ``
            }>Edit </button>
            <button class="btn btn-danger mr-4 remove-bird-btn" ${
              birdInfo.isNotificationExists ? `disabled` : ``
            }>Remove</button>
            </div>
        </div>
    </div>
    </div>`
      );
    });

    const editBtns = document.querySelectorAll("#edit-bird");
    editBtns.forEach((editBtn, index) => {
      editBtn.addEventListener("click", async () => {
        window.location.href = `bird_form.html?root=${btoa(root)}&id=${btoa(
          birds[index]._id
        )}&adminName=${btoa(adminName)}&email=${btoa(email)}`;
      });
    });

    function showPopUpPage(index) {
      removePopUp.classList.add("show");
      overlay.classList.add("show");
      console.log(label);
      label.innerHTML = `Type <span style='color:red;'>${birds[index].commonName}</span> below to confirm`;
      input.addEventListener("input", (e) => {
        if (e.target.value === birds[index].commonName) {
          birdFinalRemoveBtn.disabled = false;
        } else {
          birdFinalRemoveBtn.disabled = true;
        }
      });
      birdFinalRemoveBtn.addEventListener("click", async () => {
        try {
          pageLoaderContainer.classList.add("loading");
          removePopUp.classList.remove("show");
          const response = await fetch(
            "http://localhost:8000/admin/delete_bird",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: birds[index]._id,
                birdKey: birds[index].birdKey,
                imgFormat: birds[index].imgFormat,
              }),
              credentials: "include",
            }
          );
          const result = await response.json();
          switch (response.status) {
            case 200:
              window.location.href = "index.html";
              break;
            case 401:
              window.location.href = "admin_login.html";
              break;
            default:
              alert(result.error);
          }
        } catch (error) {
          alert(error.message);
        } finally {
          overlay.classList.remove("show");
          pageLoaderContainer.classList.remove("loading");
        }
      });
    }
    const removeBirdButtons = document.querySelectorAll(".remove-bird-btn");
    removeBirdButtons.forEach((removeBtn, index) => {
      removeBtn.addEventListener("click", () => {
        showPopUpPage(index);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        removePopUp.classList.remove("show");
        overlay.classList.remove("show");
      }
    });
    overlay.addEventListener("click", () => {
      removePopUp.classList.remove("show");
      overlay.classList.remove("show");
    });
    closeBtn.addEventListener("click", () => {
      removePopUp.classList.remove("show");
      overlay.classList.remove("show");
    });
  }

  //notification button event listeners

  notificationBtn.addEventListener("click", async () => {
    await renderNotificationPage();
  });

  addBirdBtn.addEventListener("click", () => {
    const birdKey = getBirdKey();
    window.location.href = `bird_form.html?root=${btoa(root)}&adminName=${btoa(
      adminName
    )}&email=${btoa(email)}&birdKey=${birdKey}`;
  });

  logOutBtn.addEventListener("click", async () => {
    try {
      overlay.classList.add("show");
      pageLoaderContainer.classList.add("loading");
      await fetch("http://localhost:8000/admin/logout", {
        credentials: "include",
      });
      window.location.href = "admin_login.html";
    } catch (error) {
      alert(error.message);
    } finally {
      overlay.classList.remove("show");
      pageLoaderContainer.classList.remove("loading");
    }
  });
}
function getBirdKey() {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const currentTimeInMilliseconds = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  const alphanumericID =
    `${currentDate}${currentTimeInMilliseconds}${random}`.replace(/\D/g, "");
  return alphanumericID;
}
renderHomePage();
