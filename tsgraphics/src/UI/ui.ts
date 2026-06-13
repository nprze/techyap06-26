export class UI {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  sliderFloat(
    name: string,
    value: { current: number },
    min: number,
    max: number,
    step = 0.01
  ) {
    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
      <label>
        <span>${name}</span>
        <span class="value">${value.current}</span>
      </label>

      <input 
        type="range"
        min="${min}"
        max="${max}"
        step="${step}"
        value="${value.current}"
      >
    `;

    const slider = row.querySelector("input")!;
    const text = row.querySelector(".value")!;


    slider.addEventListener("input", () => {
      value.current = Number(slider.value);
      text.textContent = value.current.toFixed(3);
    });


    this.root.appendChild(row);
  }


  sliderInt(
    name: string,
    value: { current: number },
    min: number,
    max: number
  ) {
    this.sliderFloat(name, value, min, max, 1);
  }
}