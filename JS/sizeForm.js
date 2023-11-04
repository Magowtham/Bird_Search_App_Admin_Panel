const birdData = {
  size: "",
  majorColor: "",
  minorColor: "",
  beakShape: "",
  footShape: "",
};
const submitBtn1 = document.getElementById("submit1");
/* Bird Size */
const birdSizeInput = document.getElementById("birdSize");
birdSizeInput.addEventListener("input", (e) => {
  birdData.size = e.target.value;
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

/*For Beak Shape*/
const beakShape = document.querySelectorAll(".beak_option_card");
beakShape.forEach((card) => {
  card.addEventListener("click", function () {
    document
      .querySelector(".beak-card-selected")
      ?.classList.remove("beak-card-selected");
    birdData.beakShape = card.querySelector("h2").textContent;
    card.classList.add("beak-card-selected");
  });
});

/*For Foot Shape*/
const footCards = document.querySelectorAll(".foot_option_card");
footCards.forEach((card) => {
  card.addEventListener("click", function () {
    document
      .querySelector(".foot-card-selected")
      ?.classList.remove("foot-card-selected");
    birdData.footShape = card.querySelector("h2").textContent;
    card.classList.add("foot-card-selected");
  });
});
function validator() {
  const keys = Object.keys(birdData);
  let flag = true;
  keys.forEach((key) => {
    if (!birdData[key]) {
      flag = false;
    }
  });
  return flag;
}
function secondForm() {
  const inputFields = [
    `<label for="Cname">Common Name:</label>
				<input type="text" class="form-control" id="Cname"
					placeholder="Enter the Common Name" name="Cname" required>`,
    `<label for="Iurl">Image URL:</label>
				<input type="text" class="form-control" id="Iurl"
					placeholder="Enter Image URL" name="Iurl" required>`,
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
					placeholder="Enter Diet" name="Diet" required>`,
  ];
  const mainContainer = document.createElement("div");
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
  button.textContent = "Submit";
  button.type = "submit";
  button.id = "finalSubmit";
  form.appendChild(button);
  document.querySelector("body").appendChild(mainContainer);
}
function secondFormFunctions() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    birdData.commonName = e.target[0].value;
    birdData.imageSrc = e.target[1].value;
    birdData.scientificName = e.target[2].value;
    birdData.kannadaName = e.target[3].value;
    birdData.identification = e.target[4].value;
    birdData.diet = e.target[5].value;
    birdData.breedingSeason = e.target[6].value;
    console.log(birdData);
  });
}
submitBtn1.addEventListener("click", () => {
  const isValidated = validator();
  if (!isValidated) {
    alert("Please Select All The Fields ");
  } else {
    document.querySelector("#main-container").remove();
    secondForm();
    secondFormFunctions();
  }
});
