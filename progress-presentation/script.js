const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');

let index = 0;
totalEl.textContent = String(slides.length);

function render() {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  currentEl.textContent = String(index + 1);
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === slides.length - 1;
}

function next() {
  if (index < slides.length - 1) {
    index += 1;
    render();
  }
}

function prev() {
  if (index > 0) {
    index -= 1;
    render();
  }
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown') next();
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') prev();
});

render();
