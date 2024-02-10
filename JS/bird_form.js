const formMainContainer = document.getElementById("main-container");
const pageLoaderContainer = document.querySelector(".loader_container");
const overlay = document.querySelector(".bird-remove-overlay");
let birdData = {
  size: "",
  majorColor: "",
  minorColor: "",
  beakShape: "",
  footShape: "",
};
const bird_data_header = document.querySelector(".bird_data_header");
const urlParams = new URLSearchParams(window.location.search);
const root = Number(atob(urlParams.get("root")));
const adminName = atob(urlParams.get("adminName"));
const email = atob(urlParams.get("email"));
const isPreview = Number(atob(urlParams.get("isPreview")));
const previewId = atob(urlParams.get("previewId"));
let birdKey = null;

let id = urlParams.get("id") ? atob(urlParams.get("id")) : null;
birdData.adminName = adminName;
birdData.email = email;
let isFormInEditMode = false,
  isPreviewMode = false;
if (id) {
  isFormInEditMode = true;
} else {
  birdData.isEdited = false;
}
if (isPreview) {
  isPreviewMode = true;
}
if (!isPreviewMode && !isFormInEditMode) {
  birdKey = urlParams.get("birdKey");
}

(async () => {
  try {
    pageLoaderContainer.classList.add("loading");
    if (isFormInEditMode || isPreviewMode) {
      const response = await fetch(
        `http://localhost:8000/admin/get_birds_edit_info?${
          isFormInEditMode ? `id=${id}&preview=0` : `id=${previewId}&preview=1`
        }`,
        {
          credentials: "include",
        }
      );
      const result = await response.json();
      console.log(result);
      switch (response.status) {
        case 200:
          birdData = result.birdEditInfo;
          if (!isPreviewMode) {
            console.log("hello");
            birdData.isEdited = true;
            birdData.adminName = adminName;
            birdData.email = email;
            birdData.birdId = id;
            await renderForm1();
            form1EditDataUpdater();
          } else {
            if (birdData.isEdited) {
              isFormInEditMode = true;
            }
            renderForm2();
            form2EditDataUpdater();
          }
          break;
        case 401:
          window.location.href = "admin_login.html";
          break;
        case 500:
          console.log(result.error);
      }
    } else {
      await renderForm1();
    }
  } catch (error) {
    alert("failed to load");
  } finally {
    if (isPreview) {
      pageLoaderContainer.classList.remove("loading");
    }
  }
})();
async function sendRejectMessage(data) {
  try {
    overlay.classList.add("show");
    pageLoaderContainer.classList.add("loading");
    const response = await fetch("http://localhost:8000/admin/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
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
    alert("unable to send message");
  } finally {
    overlay.classList.remove("show");
    pageLoaderContainer.classList.remove("loading");
  }
}
async function birdDataApprover() {
  try {
    overlay.classList.add("show");
    pageLoaderContainer.classList.add("loading");
    const response = await fetch(
      `http://localhost:8000/admin/${
        birdData.isEdited ? `approve_edit_bird` : `approve_add_bird`
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birdData),
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
    alert("unable to approve!");
  } finally {
    overlay.classList.remove("show");
    pageLoaderContainer.classList.remove("loading");
  }
}
async function sendDataToServer() {
  try {
    //setting the overlay;
    overlay.classList.add("show");
    pageLoaderContainer.classList.add("loading");
    const formData = new FormData();
    Object.keys(birdData).forEach((key) => {
      if (typeof birdData[key] === "object" && key !== "imageSrc") {
        for (let subKey in birdData[key]) {
          formData.append(`${key}.${subKey}`, birdData[key][subKey]);
        }
      } else {
        formData.append(key, birdData[key]);
      }
    });
    console.log(formData);
    const url = `http://localhost:8000/admin/${
      root
        ? isFormInEditMode
          ? `edit_bird/${id}`
          : `add_bird`
        : isFormInEditMode
        ? `edit_bird_notification`
        : `add_bird_notification`
    }`;
    for (const data of formData.entries()) {
      console.log(data);
    }
    const response = await fetch(url, {
      method: `${isFormInEditMode && root ? `PUT` : `POST`}`,
      body: formData,
      credentials: "include",
    });
    const result = await response.json();
    console.log(result);
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
    console.log(error);
    alert("failed to send data");
  } finally {
    overlay.classList.remove("show");
    pageLoaderContainer.classList.remove("loading");
  }
}
//get option functions

async function renderForm1() {
  function formStructure() {
    formMainContainer.innerHTML = `	<form action="#" id="form1" class="hidden">
			<div class="form-group">
				    <h5>Bird Size</h5>
					<select id="birdSize" class="w-100 p-2">
						<option selected disabled>Select Size</option>
						<option>Sparrow</option>
						<option>Sparrow-</option>
						<option>Sparrow--</option>
						<option>Sparrow+</option>
						<option>Sparrow++</option>
						<option>Myna</option>
						<option>Myna-</option>
						<option>Myna--</option>
						<option>Myna+</option>
						<option>Myna++</option>
						<option>Crow</option>
						<option>Crow-</option>
						<option>Crow--</option>
						<option>Crow+</option>
						<option>Crow++</option>
						<option>Eagle</option>
						<option>Eagle-</option>
						<option>Eagle--</option>
						<option>Eagle+</option>
						<option>Eagle++</option>
					</select>
			</div>
			<div>
			<h5>Major Color</h5>
			<div class="form-group">
    			<input type="color" id="majorColor" class="w-20"/>
				<input type="text" value="#ffff" id="majorInput" class="p-1"/>
			</div>
			<h5>Minor Color</h5>
			<div class="form-group">
    			<input type="color" id="minorColor"/>
				<input type="text" value="#ffff" id="minorInput" class="p-1"/>
			</div>
			</div>
			<div class="form-group">
				<h5>Beak Shape</h5>
			<div class="option_container" id="beak-shapes-container">
			</div>
			</div>
			<div class="form-group">
				<h5>Foot Shape</h5>
				<div class="option_container" id="foot-shapes-container">
			</div>
			</div>
         ${
           isPreviewMode
             ? ` <button class="btn btn-danger text-white mr-3 mb-3" id="prev-btn">Previous</button>`
             : ``
         }
		<button class="btn btn-success mr-3 mb-3" id="submit-btn1" >
         <span>${isPreviewMode ? `Approve` : `Submit`}</span>
    </button>
    ${
      isPreviewMode
        ? ` <button class="btn bg-danger text-white mb-3" id="reject-btn">Reject</button>`
        : ``
    }
		</div>
		</form>`;
  }

  async function getOptions() {
    try {
      pageLoaderContainer.classList.add("loading");
      const resposne = await fetch("http://localhost:8000/admin/get_options", {
        credentials: "include",
      });
      const result = await resposne.json();
      switch (resposne.status) {
        case 200:
          return result.options;
        case 401:
          window.location.href = "admin_login.html";
          break;
        case 500:
          console.log(result.error);
      }
    } catch (error) {
      alert("failed to load");
    } finally {
      document.querySelector("#form1").classList.remove("hidden");
      pageLoaderContainer.classList.remove("loading");
    }
  }

  function beakOptionsUiUpdator(beakShapes) {
    const container = document.querySelector("#beak-shapes-container");
    beakShapes.forEach((beak) => {
      container.insertAdjacentHTML(
        "beforeend",
        `	<div class="option_card beak-card">
      <div class="option_selector"></div>
					<img src="${beak.img}" alt=" " />
					<h2>${beak.value.replace(/_/g, " ")}</h2>
				</div>`
      );
    });
  }
  function footOptionsUiUpdator(footShapes) {
    const container = document.querySelector("#foot-shapes-container");
    footShapes.forEach((foot) => {
      container.insertAdjacentHTML(
        "beforeend",
        `	<div class="option_card foot-card">
         <div class="option_selector"></div>
					<img src="${foot.img}" alt=" " />
					<h2>${foot.value.replace(/_/g, " ")}</h2>
				</div>`
      );
    });
  }
  formStructure();
  const { beakShapes, footShapes } = await getOptions();
  beakOptionsUiUpdator(beakShapes);
  footOptionsUiUpdator(footShapes);

  /* Bird Size */
  const submitBtn1 = document.getElementById("submit-btn1");
  const prevBtn = document.getElementById("prev-btn");
  const rejectBtn = document.getElementById("reject-btn");
  const birdSizeInput = document.getElementById("birdSize");
  birdSizeInput.addEventListener("input", (e) => {
    birdData.size = e.target.value.toLowerCase();
  });
  /* For Major Color*/
  const majorColor = document.getElementById("majorColor");
  const majorInput = document.getElementById("majorInput");

  majorInput.value = majorColor.value;
  majorColor.addEventListener("input", function () {
    majorInput.value = majorColor.value;
    birdData.majorColor = majorInput.value;
  });

  majorInput.addEventListener("keyup", (e) => {
    majorColor.value = e.target.value;
    birdData.majorColor = e.target.value;
  });
  /*For Minor Color*/
  const minorColor = document.getElementById("minorColor");
  const minorInput = document.getElementById("minorInput");

  minorInput.value = minorColor.value;
  minorColor.addEventListener("input", function () {
    minorInput.value = minorColor.value;
    birdData.minorColor = minorInput.value;
  });

  minorInput.addEventListener("keyup", (e) => {
    minorColor.value = e.target.value;
    birdData.minorColor = e.target.value;
  });
  const beakCards = document.querySelectorAll(".beak-card");
  beakCards.forEach((card) => {
    card.addEventListener("click", function () {
      document
        .querySelector(".beak_selected")
        ?.classList.remove("beak_selected");
      birdData.beakShape = {
        value: `${card.querySelector("h2").textContent.replace(" ", "_")}`,
        img: `${card.children[1].src}`,
      };
      card.children[0].classList.add("beak_selected");
    });
  });

  /*For Foot Shape*/
  const footCards = document.querySelectorAll(".foot-card");
  footCards.forEach((card) => {
    card.addEventListener("click", function () {
      document
        .querySelector(".foot_selected")
        ?.classList.remove("foot_selected");
      isPreview;
      birdData.footShape = {
        value: `${card.querySelector("h2").textContent.replace(" ", "_")}`,
        img: `${card.children[1].src}`,
      };
      card.children[0].classList.add("foot_selected");
    });
  });
  function validator() {
    const keys = Object.keys(birdData);
    let flag = true;
    keys.forEach((key) => {
      if (key !== "isEdited" && !birdData[key]) {
        flag = false;
      }
    });
    return flag;
  }
  if (isPreviewMode) {
    rejectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      bird_data_header.textContent = "";
      formMainContainer.innerHTML = `<div class="reject-popup">
		<div class="modal-dialog">
			<div class="modal-content">
					<div class="modal-body">
						<textarea id="reject-bird" cols="50" class="w-100" rows="5" placeholder="Message"></textarea>
					</div>
					<div class="modal-footer" style="border: none; padding-top:0 ;">
						<button class="btn btn-success w-25" id="reject-message-btn">Send</button>
					</div>
			</div>
		</div>
	</div>`;
      const textArea = document.querySelector(".reject-popup textarea");
      const rejectMessageBtn = document.querySelector("#reject-message-btn");
      rejectMessageBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await sendRejectMessage({
          message: textArea.value,
          email: birdData.email,
          id: previewId,
          birdKey: birdData.birdKey,
          isEdited: birdData.isEdited,
          isImgEdited: birdData.isImgEdited,
          imgFormat: birdData.imgFormat,
        });
      });
    });

    prevBtn.addEventListener("click", () => {
      formMainContainer.innerHTML = "";
      renderForm2();
      form2EditDataUpdater();
    });
  }

  submitBtn1.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("hello");
    const isValidated = isFormInEditMode || isPreviewMode ? true : validator();
    if (!isValidated) {
      alert("Please Select All The Fields ");
    } else {
      if (!isPreviewMode) {
        if (isFormInEditMode) {
          formMainContainer.innerHTML = "";
          renderForm2();
          form2EditDataUpdater();
        } else {
          formMainContainer.innerHTML = "";
          birdData.birdKey = birdKey;
          renderForm2();
        }
      } else {
        await birdDataApprover();
      }
    }
  });
}

async function renderForm2() {
  const inputFields = [
    `<label for="Cname">Common Name:</label>
				<input type="text" class="form-control" id="Cname"
					placeholder="Enter the Common Name" name="Cname"  required>`,
    `<label for="Iurl" class="${isPreviewMode ? `hide` : ``}">Image:</label>
				<input type="file" accept="image/*" class="form-control ${
          isPreviewMode ? `hide` : ``
        }"  id="bird-image"
				name="Iurl"  ${isFormInEditMode || isPreviewMode ? `` : `required`} >`,
    `<label for="Sname">Scientific Name:</label>
				<input type="text" class="form-control" id="Sname"
					placeholder="Enter Scientific Name" name="Sname" required>`,
    `	<label for="Kname">Kannada Name:</label>
				<input type="text" class="form-control" id="Kname"
					placeholder="Enter Kannada Name" name="Kname" required>`,
    `<label for="Identification">Identification:</label><br>
				<textarea name="Identification" class="w-100" cols="20" rows="3" placeholder="Enter the Identification" required></textarea>`,
    `	<label for="Bseason">Breeding season:</label>
				<input type="text" class="form-control" id="Bseason"
					placeholder="Enter Breeding season" name="Bseason" required>`,
    `<label for="Diet">Diet:</label>
				<input type="text" class="form-control" id="Diet"
					placeholder="Enter Diet" name="Diet"  required>`,
  ];
  const mainContainer = document.createElement("div");
  document.querySelector("body").appendChild(mainContainer);
  mainContainer.className = "container custom-width";
  const form = document.createElement("form");
  mainContainer.appendChild(form);
  for (let i = 0; i < 7; i++) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = inputFields[i];
    form.appendChild(div);
  }
  const button = document.createElement("button");
  button.className = "btn bg-success text-white";
  button.innerHTML = `<span>${isPreviewMode ? `Next` : `Submit`}</span>`;
  button.type = "submit";
  button.id = "finalSubmit";
  form.appendChild(button);

  if (!isPreviewMode) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn bg-danger text-white ml-3";
    prevBtn.textContent = "Previous";
    form.appendChild(prevBtn);
    //second form functions(
    prevBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      mainContainer.remove();
      await renderForm1(true);
      form1EditDataUpdater();
    });
  }
  const imgTag = document.querySelector("#bird-image");
  const allowedImgFormates = ["jpg", "png", "jpeg", "svg"];
  imgTag.addEventListener("change", (e) => {
    const imgFormat = e.target.files[0].type.split("/")[1];
    if (allowedImgFormates.indexOf(imgFormat) === -1) {
      return alert("Please select the valid image format");
    }
    if (isFormInEditMode) {
      birdData.pastImgFormat = birdData.imageSrc.substring(
        birdData.imageSrc.lastIndexOf(".") + 1,
        birdData.imageSrc.length
      );
      birdData.isImgEdited = true;
    }

    birdData.imageSrc = e.target.files[0];
    birdData.imgFormat = imgFormat;
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    birdData.commonName = e.target[0].value;
    birdData.scientificName = e.target[2].value;
    birdData.kannadaName = e.target[3].value;
    birdData.identification = e.target[4].value;
    birdData.diet = e.target[5].value;
    birdData.breedingSeason = e.target[6].value;
    if (!isPreviewMode) {
      await sendDataToServer();
    } else {
      mainContainer.remove();
      await renderForm1();
      form1EditDataUpdater();
    }
  });
}

function form1EditDataUpdater() {
  const select = document.querySelector("#birdSize");
  for (let i = 1; i < select.options.length; i++) {
    if (
      select.options[i].value.toLowerCase() ===
      (birdData.size.value ? birdData.size.value : birdData.size)
    ) {
      select.options[i].selected = true;
    }
  }
  const majorColor = document.getElementById("majorColor");
  const majorInput = document.getElementById("majorInput");
  const minorColor = document.getElementById("minorColor");
  const minorInput = document.getElementById("minorInput");
  majorColor.value = birdData.majorColor;
  majorInput.value = birdData.majorColor;
  minorColor.value = birdData.minorColor;
  minorInput.value = birdData.minorColor;
  const beakCards = document.querySelectorAll(".beak-card");
  const footCards = document.querySelectorAll(".foot-card");
  beakCards.forEach((card) => {
    const beakStr = card.children[2].textContent.replace(" ", "_");
    if (beakStr === birdData.beakShape.value) {
      card.children[0].classList.add("beak_selected");
    }
  });
  footCards.forEach((card) => {
    const footStr = card.children[2].textContent.replace(" ", "_");
    if (footStr === birdData.footShape.value) {
      card.children[0].classList.add("foot_selected");
    }
  });
}
function form2EditDataUpdater() {
  const form = document.querySelector("form");
  form[0].value = birdData.commonName;
  form[2].value = birdData.scientificName;
  form[3].value = birdData.kannadaName;
  form[4].value = birdData.identification;
  form[5].value = birdData.diet;
  form[6].value = birdData.breedingSeason;
}
