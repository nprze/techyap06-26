class panelData {
  static instance: panelData;
  static get(): panelData { return panelData.instance; }

  constructor(speedArg: number, gravityArg: number) {
    this.speed = speedArg;
    this.gravity = gravityArg;
  }

  speed: number;
  gravity: number;
}

class UI {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  sliderFloat(
    name: string,
    value: number,
    setValue: (v: number) => void,
    min: number,
    max: number,
    step = 0.01
  ) {
    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
      <label>
        <span>${name}</span>
      </label>

      <input 
        type="range"
        min="${min}"
        max="${max}"
        step="${step}"
        value="${value}"
      ><span class="value">${value}</span>
    `;

    const slider = row.querySelector("input")!;
    const text = row.querySelector(".value")!;

    slider.addEventListener("input", () => {
      const val = Number(slider.value);
      setValue(val);
      text.textContent = val.toFixed(3);
    });

    this.root.appendChild(row);
  }


  sliderInt(
    name: string,
    value: number,
    setValue: (v: number) => void,
    min: number,
    max: number
  ) {
    this.sliderFloat(name, value, setValue, min, max, 1);
  }
}

export { panelData, UI }