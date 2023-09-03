class UIEvents {
  static documentLoaded() {
    this.simulationSpeedSlider = document.getElementById(
      "simulationSpeedSlider"
    );
    this.elasticityValueSlider = document.getElementById(
      "elasticityValueSlider"
    );
    this.circlesNumInput = document.getElementById("circlesNumInput");
    // this.dataPanelContainer = document.getElementById("dataPanelContainer"); // New container element
    this.bodyDataLayoutTemplate = document.getElementById("bodyDataLayout");
  }

  static resetBtnClicked() {

  }

  static playPauseBtnClicked() {
    play = !play;
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");

    if (play) {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else {
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
    }
  }

  static forwardOneFrameBtnClicked() {
    play = !play;
    setTimeout(() => {
      play = !play;
    }, 1000 / 60);
  }

  static simulationSpeedChanged() {
    simSpeed = parseFloat(this.simulationSpeedSlider.value);
  }

  static elasticityValueChanged() {
    elasticity = parseInt(this.elasticityValueSlider.value);
  }

  static numCirclesChanged() {
    let element = this.circlesNumInput;
    if (element == null || element == '') return;

    let newCirclesNum = parseFloat(element.value);
    newCirclesNum = newCirclesNum < 1 ? 1 : newCirclesNum;
    newCirclesNum = newCirclesNum > 5 ? 5 : newCirclesNum;
    console.log(newCirclesNum);

    if (newCirclesNum < circlesNum) {
      this.removeCircle(newCirclesNum);
    } else if (newCirclesNum > circlesNum) {
      this.addCircle(newCirclesNum);
    }
  }

  static addCircle(num) {
    for (let i = circlesNum; i < num; i++) {
      let colour = color(random(0, 255), random(0, 255), random(0, 255));
      circles.push(
        new Circle(
          random(0, walls[2]),
          random(0, walls[3]),
          random(-10, 10),
          random(-10, 10),
          random(1, 10),
          colour
        )
      );

      this.updateDataPanel(circles[i]);
    }

    circlesNum = num;
  }

  static removeCircle(num) {
    if (num >= circlesNum) {
      return; // Nothing to remove if the number is not valid just in case
    }

    // Remove circles from the array
    circles.splice(num, circlesNum - num);

    // Remove corresponding data panels from the right-side data panel container
    const dataContainer = document.getElementById("dataPage");

    // Select all data panels with class 'bodyDataLayout' (your cloned template)
    const dataPanels = document.querySelectorAll(".bodyDataLayout");

    // Remove data panels beyond the specified number
    for (let i = num; i < dataPanels.length+1; i++) {
      dataContainer.removeChild(dataPanels[i]);
    }

    circlesNum = num;

    // Update data panels' labels
    const updatedDataPanels = document.querySelectorAll(".bodyDataLayout");
    updatedDataPanels.forEach((dataPanel, index) => {
      dataPanel.querySelector(".collapse-title-label").textContent = `Body ${index + 1} Data`;
    });
  }


  static updateDataPanel(circle) {
    // Create a new data panel element for the circle
    const dataPanel = this.bodyDataLayoutTemplate.cloneNode(true);
    dataPanel.classList.remove("hidden");

    // Update the data panel with the circle's information
    const circleIndex = circles.indexOf(circle);
    dataPanel.querySelector(".collapse-title-label").textContent = `Body ${circleIndex + 1} Data`;
    dataPanel.querySelector(".mass").value = circle.mass;
    dataPanel.querySelector(".px").value = circle.x;
    dataPanel.querySelector(".py").value = circle.y;
    dataPanel.querySelector(".vx").value = circle.velx;
    dataPanel.querySelector(".vy").value = circle.vely;
    dataPanel.querySelector(".body-circle").style.backgroundColor = circle.colour;

    // Append the data panel to the right-side data panel container
    const dataContainer = document.getElementById("dataPage");
    dataContainer.appendChild(dataPanel);

    // Remove existing event listeners
    dataPanel.querySelectorAll("input").forEach((input) => {
      input.removeEventListener("input", UIEvents.updateCircleData);
    });

    // Add an event listener to update circle data when user edits input fields
    dataPanel.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        // inputs.push(input);
        UIEvents.updateCircleData(circleIndex, input);
        // console.log(inputs);
      });
    });
  }

  static updateCircleData(circleIndex, inputElement) {
    // Update the corresponding circle's data based on the input element
    const circle = circles[circleIndex];
    const className = inputElement.className;

    if (className.includes("mass")) {
      circle.mass = parseFloat(inputElement.value);
    } else if (className.includes("px")) {
      circle.x = parseFloat(inputElement.value);
    } else if (className.includes("py")) {
      circle.y = parseFloat(inputElement.value);
    } else if (className.includes("vx")) {
      circle.velx = parseFloat(inputElement.value);
    } else if (className.includes("vy")) {
      circle.vely = parseFloat(inputElement.value);
    }
  }
}