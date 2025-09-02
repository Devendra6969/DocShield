window.onscroll = function () {
  scrollFunctionBTT(); // back to top button
};

// Use const for variables that aren't reassigned
const myButton = document.getElementById("scroll-btn");

function scrollFunctionBTT() {
  // Check if myButton exists to prevent errors if the element is not on the page
  if (myButton) {
    if (
      document.body.scrollTop > 45 ||
      document.documentElement.scrollTop > 45
    ) {
      myButton.style.display = "block";
    } else {
      myButton.style.display = "none";
    }
  }
}

function topFunction() {
  document.body.scrollTop = 0; // for Safari
  document.documentElement.scrollTop = 0; // for Chrome, Firefox, IE and Opera
}

// AOS ANIMATION ON SCROLL
AOS.init({
  duration: 1000,
  easing: "ease",
  once: true, // whether animation should happen only once - while scrolling down
});

function changeBackground() {
  setInterval(() => {
    var bgs = ["../assets/images/bg.jpg", "../assets/images/home5.jpg"];

    var index = Math.floor(Math.random() * bgs.length);

    // Use a more specific selector if possible, and check if it exists
    const homeElement = document.querySelector(".home");
    if (homeElement) {
      homeElement.style.backgroundImage = `url(${bgs[index]})`;
    }
  }, 10000);
} // <-- FIXED: The closing brace was in the wrong place.

// Call the function if you want it to start automatically
// changeBackground();
