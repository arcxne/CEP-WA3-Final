class UIEvents {
  static documentLoaded() {
    this.simulationSpeedSlider = document.getElementById(
      "simulationSpeedSlider"
    );
    this.elasticityValueSlider = document.getElementById(
      "elasticityValueSlider"
    );
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
    elasticity = parseFloat(this.elasticityValueSlider.value);
  }
}