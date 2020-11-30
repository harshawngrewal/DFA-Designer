const canvas = document.querySelector('#canvas');
let shadow = false;
canvas.addEventListener('click', (e) => {
  if (shadow == false) {
    shadow = true;
    e.target.style.boxShadow = "0 0 30px rgba(107, 104, 104, 0.5)";
  }
  else {
    shadow = false;
    e.target.style.boxShadow = "";
  }
})