let controller;
let slideScene;
let pageScene;
let projectScene;
let mouse = document.querySelector(".cursor");
let mouseTxt = mouse.querySelector("span");
let burger = document.querySelector(".burger");
let skillsBtn = document.querySelector(".skills-btn");
let popup = document.querySelector(".popup-back");
let closePopup = document.querySelector(".close-popup");

//animation Function
function animateSlides() {
  //initalise controller
  controller = new ScrollMagic.Controller();

  //selecting elements
  let sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  //looping over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //gsap for each slide
    //creating gsap timeline
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "100%" }, { y: "0%" }, "-= 0.5");

    //creating scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "slide",
      //   })
      .addTo(controller);
    //new animation
    let pageTl = gsap.timeline();
    //making a new variable to delay our animation
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    //pushing next slide by 50%
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    //reversing the push for next slide to comeUp
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setTween(pageTl)
      //setPin will make our content stuck to the page
      //pushfollowers is here false because we want our slides to wrap up again and again on scrolling
      .setPin(slide, { pushFollowers: false })
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "page",
      //   indent: 200,
      // })
      .addTo(controller);
  });
}
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}
function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (
    item.classList.contains("explore") ||
    item.classList.contains("form-submit")
  ) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerText = "Tap!";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseTxt.innerText = "";
  }
  if (
    item.classList.contains("slide") ||
    item.classList.contains("hero-desc")
  ) {
    mouse.classList.add("color-active");
  } else {
    mouse.classList.remove("color-active");
  }
}
function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to("#logo", 0.5, { display: "none" }, "-=1");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to(".line3", 0.1, { display: "none" }, "-=1");
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 0% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to("#logo", 0.5, { display: "block" }, "-=0.1");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "black" });
    gsap.to(".line3", 0.1, { display: "block" }, "-=1");
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 0% -10%)" });
    document.body.classList.remove("hide");
  }
}
let logo = document.querySelector("#logo");
//barba transitions
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "project",
      beforeEnter() {
        logo.href = "../index.html";
        animateProjects();
        gsap.fromTo(
          ".nav-header",
          1,
          { y: "100%" },
          { y: "0%", ease: "power2.inOut" }
        );
      },
      beforeLeave() {
        controller.destroy();
        projectScene.destroy();
      },
    },
    {
      namespace: "contact",
      beforeEnter() {
        logo.href = "../index.html";
        animateContact();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //adding animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          1,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //scrolling to top
        window.scrollTo(0, 0);
        //adding animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { y: "0%" },
          { y: "-100%", stagger: 0.2, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

//function for animation of projects
function animateProjects() {
  controller = new ScrollMagic.Controller();
  const projects = document.querySelectorAll(".project-anim");
  projects.forEach((project, index, projects) => {
    let projectTl = gsap.timeline({
      defaults: { duration: 1.5, ease: "power2.inOut" },
    });
    let nextSlide = projects.length - 1 === index ? "end" : projects[index + 1];
    let nextImg = nextSlide.querySelector("img");
    projectTl.fromTo(project, { opacity: 1 }, { opacity: 0 });
    // projectTl.fromTo(nextSlide, { x: "-100%" }, { x: "0%" }, "-=0.1");
    // projectTl.fromTo(
    //   nextImg,
    //   { scale: 2, x: "-70%" },
    //   { scale: 1, x: "0%" },
    //   "-=0.9"
    // );
    projectScene = new ScrollMagic.Scene({
      triggerElement: project,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(project, { pushFollowers: false })
      .setTween(projectTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "project",
      // })
      .addTo(controller);
  });
}
function openPopup() {
  if (!popup.classList.contains("active")) {
    popup.classList.add("active");
    let tl = gsap.timeline({
      defaults: { duration: 0.5, ease: "power2.inOut" },
    });
    tl.fromTo(".popup", { y: "0%" }, { y: "-100%" });
    document.body.classList.add("hide");
  }
}
function closeSkillPopup() {
  popup.classList.remove("active");
  document.body.classList.remove("hide");
}
function animateContact() {
  let revealForm = document.querySelector(".reveal-form");
  let tl = gsap.timeline({
    defaults: { duration: 3, ease: "power2.inOut" },
  });
  tl.fromTo(revealForm, { x: "0%" }, { x: "-100%" });
}
//event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
skillsBtn.addEventListener("click", openPopup);
closePopup.addEventListener("click", closeSkillPopup);
