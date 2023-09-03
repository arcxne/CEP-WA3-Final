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

    // Number of bodies input box
    this.bodiesNumberInput = document.getElementById("circlesNumInput");

    // Data page
    this.dataPage = document.getElementById("dataPage");
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
    for (let i = num; i < dataPanels.length + 1; i++) {
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
    dataPanel.querySelector(".px").value = circle.x.toFixed(0);
    dataPanel.querySelector(".py").value = circle.y.toFixed(0);
    dataPanel.querySelector(".vx").value = circle.velx.toFixed(2);
    dataPanel.querySelector(".vy").value = circle.vely.toFixed(2);
    dataPanel.querySelector(".ke").value = circle.ke.toFixed(2);
    dataPanel.querySelector(".momentum").value = circle.momentum.toFixed(2);
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
        if (input.value == '') return;
        UIEvents.updateCircleData(circleIndex, input);
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

  static updateDataPage() {
    //Update the "number of bodies" input box, if the user is not editing it
    if (document.activeElement != this.bodiesNumberInput) {
      this.bodiesNumberInput.value = circles.length;
    }
    // else {
    //   return;
    // }

    //Update the bodydatacontrols with the mass, position, velocity of their corresponding bodies
    let bodyDataControls = this.dataPage.querySelectorAll(".bodyDataControl");
    for (let i = 0; i < circles.length; i++) {
      let bodyDataControl = bodyDataControls[i];
      let body = circles[i];

      //Get relevant controls to update
      let massInput = bodyDataControl.querySelector(".mass");
      let posXInput = bodyDataControl.querySelector(".px");
      let posYInput = bodyDataControl.querySelector(".py");
      let velocityXInput = bodyDataControl.querySelector(".vx");
      let velocityYInput = bodyDataControl.querySelector(".vy");
      let keLabel = bodyDataControl.querySelector(".ke");
      let momentumLabel = bodyDataControl.querySelector(".momentum");

      //Update control values if the user is not editing them (aka they do not have focus)
      //This is quite the chain of if statements, but I have no idea how else to do this
      if (document.activeElement != massInput) {
        massInput.value = body.mass.toFixed(0);
      }

      if (document.activeElement != posXInput) {
        posXInput.value = body.x.toFixed(0);
      }

      if (document.activeElement != posYInput) {
        posYInput.value = body.y.toFixed(0);
      }

      if (document.activeElement != velocityXInput) {
        velocityXInput.value = body.velx.toFixed(2);
      }

      if (document.activeElement != velocityYInput) {
        velocityYInput.value = body.vely.toFixed(2);
      }

      bodyDataControl.querySelector(".body-circle").style.backgroundColor = body.colour;
      keLabel.value = body.ke.toFixed(2);
      momentumLabel.value = body.momentum.toFixed(2);
    }
  }

}