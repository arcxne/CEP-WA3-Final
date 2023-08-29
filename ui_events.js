class UIEvents {
  static documentLoaded() {
    this.simulationSpeedSlider = document.getElementById(
      "simulationSpeedSlider"
    );
    this.elasticityValueSlider = document.getElementById(
      "elasticityValueSlider"
    );
    this.circlesNumInput = document.getElementById("circlesNumInput");
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

  static bodiesNumberEditing() {
    //Only update the list if the value of the "number of bodies" input box is not null (duh)
    if (
      this.bodiesNumberInput.value != null &&
      this.bodiesNumberInput.value != ""
    ) {
      //Push/Remove bodies from the sv_bodies array
      if (bodiesNumberInputValue > sv_bodies.length) {
        //Add bodies
        //Find out how many bodies we need to add
        let addBodies = bodiesNumberInputValue - sv_bodies.length;

        for (let i = 0; i < addBodies; i++) {
          //Create a new color for the body
          let bodyColorArray = [
            random(25, 255),
            random(25, 255),
            random(25, 255),ui_events.js
          ];

          //Add a new body
          sv_bodies.push(
            new Body(
              Math.round(random(10, 50)),
              Math.round(random(50, width - 50)),
              Math.round(random(height)),
              random(2.5),
              random(2.5),
              bodyColorArray
            )
          );

          //Add a new control
          this.addBodyDataControl(
            sv_bodies.length,
            color(bodyColorArray[0], bodyColorArray[1], bodyColorArray[2])
          );
        }
      } else if (bodiesNumberInputValue < sv_bodies.length) {
        //Remove bodies
        //Find out how many bodies we need to remove
        let removeBodies = sv_bodies.length - bodiesNumberInputValue;
        for (let i = 0; i < removeBodies; i++) {
          sv_bodies.pop();

          //Remove a body data control as well
          this.removeLastBodyDataControl();
        }
      }
    }
  }

  static addBodyDataControl(bodyNumber, bodyColor) {
    //Clone template control
    let bodyDataControl = this.bodyDataLayoutTemplate.cloneNode(true);
    bodyDataControl.classList.remove("hidden");
    bodyDataControl.removeAttribute("id");

    //Change the label
    let label = bodyDataControl.querySelector(".collapse-title-label");
    label.innerHTML = "Body " + bodyNumber.toString() + " Data";

    //Store the index of the corresponding body in the dataset of the input boxes
    //(used when the user is editing these input boxes)
    let dataInputBoxes = bodyDataControl.querySelectorAll(
      "input.mass, input.px, input.py, input.vx, input.vy"
    );
    for (let i = 0; i < dataInputBoxes.length; i++) {
      dataInputBoxes[i].dataset.bodyindex = (bodyNumber - 1).toString();
    }

    //Change the color of the circle representing the body
    let bodyCircle = bodyDataControl.querySelector(".body-circle");
    bodyCircle.style.backgroundColor = bodyColor.toString();

    //Add bodydatacontrol
    this.dataPage.appendChild(bodyDataControl);
  }

  static numCirclesChanged() {
    let newCirclesNum = parseInt(this.circlesNumInput.value);
    if (circlesNum > newCirclesNum) {
      this.removeCircle(newCirclesNum);
    } else if (circlesNum < newCirclesNum) {
      this.addCircle(newCirclesNum);
    }
    circlesNum = newCirclesNum;
    console.log("hi");
  }

  static addCircle(num) {
    for (let i = circlesNum; i < num; i++) {
      circles.push(
        new Circle(
          random(0, walls[2]),
          random(0, walls[3]),
          random(-10, 10),
          random(-10, 10),
          random(1, 10),
          color(random(0, 255), random(0, 255), random(0, 255))
        )
      );
    }

    // add to panel

    //Clone template control
    let bodyDataControl = this.bodyDataLayoutTemplate.cloneNode(true);
    bodyDataControl.classList.remove("hidden");
    bodyDataControl.removeAttribute("id");

    //Change the label
    let label = bodyDataControl.querySelector(".collapse-title-label");
    label.innerHTML = "Body " + bodyNumber.toString() + " Data";

    let dataInputBoxes = bodyDataControl.querySelectorAll(
      "input.mass, input.px, input.py, input.vely, input.vely"
    );

    for (let i = 0; i < dataInputBoxes.length; i++) {
      dataInputBoxes[i].dataset.bodyindex = (bodyNumber - 1).toString();
    }

    //Change the color of the circle representing the body
    let bodyCircle = bodyDataControl.querySelector(".body-circle");
    bodyCircle.style.backgroundColor = bodyColor.toString();

    //Add bodydatacontrol
    this.dataPage.appendChild(bodyDataControl);
  }

  static removeCircle(num) {
    circles.splice(num, circlesNum - num);

    // remove from panel
  }
}