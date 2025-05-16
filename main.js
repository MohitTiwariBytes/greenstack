document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText, CustomEase);

  CustomEase.create("smoothEase", "0.625, 0.05, 0, 1");

  let split1 = SplitText.create(".main__text h1", {
    type: "chars",
    charsClass: "char++",
  });
  let split2 = SplitText.create(".small__text p", {
    type: "words",
    mask: "words",
    wordsClass: "word++",
  });

  let buttonSplit = SplitText.create("#duplicate1, #duplicate2", {
    type: "chars",
    wordsClass: "charBtn++",
  });

  const slideUp = () => {
    gsap.fromTo(
      "#duplicate1 div",
      {
        y: "0",
      },
      {
        y: "-100%",
        ease: "smoothEase",
        stagger: {
          amount: 0.3,
          from: "start",
        },
        duration: 0.8,
      }
    );
    gsap.fromTo(
      "#duplicate2 div",
      {
        y: "100%",
      },
      {
        y: "-100%",
        ease: "smoothEase",
        stagger: {
          amount: 0.3,
          from: "start",
        },
        duration: 0.8,
      }
    );
  };
  const slideDown = () => {
    gsap.fromTo(
      "#duplicate1 div",
      {
        y: "-100%",
      },
      {
        y: "0",
        ease: "smoothEase",
        stagger: {
          amount: 0.3,
          from: "start",
        },
        duration: 0.8,
      }
    );
    gsap.fromTo(
      "#duplicate2 div",
      {
        y: "-100%",
      },
      {
        y: "0",
        ease: "smoothEase",
        stagger: {
          amount: 0.3,
          from: "start",
        },
        duration: 0.8,
      }
    );
  };

  const btn = document.getElementById("rsvpBtn");

  btn.addEventListener("mouseenter", slideUp);
  btn.addEventListener("mouseleave", slideDown);

  gsap.fromTo(
    btn,
    {
      opacity: 0,
      top: "25px",
    },
    {
      top: "0px",
      opacity: 1,
      duration: 2,
      ease: "smoothEase",
      delay: 1,
    }
  );

  gsap.fromTo(
    ".char",
    {
      y: "100%",
      opacity: 0,
      color: "#0AE448",
    },
    {
      opacity: 1,
      color: "black",
      y: "0%",
      ease: "smoothEase",
      stagger: {
        amount: 0.3,
        from: "random",
      },
      duration: 1.4,
    }
  );
  gsap.fromTo(
    ".word",
    {
      y: "200%",
    },
    {
      y: "0",
      ease: "smoothEase",
      stagger: 0.01,
      delay: 0.6,
      duration: 1.4,
    }
  );

  const container = document.getElementById("background-flairs");
  const totalAvailableImages = 31;
  const flairSize = 30;
  const maxAttempts = 10;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function isOverlap(x1, y1, size1, x2, y2, size2) {
    return !(
      x1 + size1 < x2 ||
      x1 > x2 + size2 ||
      y1 + size1 < y2 ||
      y1 > y2 + size2
    );
  }

  let flairImgs = [];
  const revealRadius = 120;

  function createFlairs() {
    container.innerHTML = "";
    flairImgs = [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;
    const flairCount = Math.min(500, Math.floor(area / 200));

    const placedPositions = [];

    const gridCols = Math.ceil(Math.sqrt(flairCount * (width / height) + 50));
    const gridRows = Math.ceil(flairCount / gridCols);

    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;

    for (let i = 0; i < flairCount; i++) {
      let img = document.createElement("img");
      const imgIndex = Math.floor(randomBetween(1, totalAvailableImages + 1));
      img.src = `./Flairs/flair-2D-${imgIndex}.png`;
      img.alt = "Flair";
      img.style.position = "fixed";
      img.style.width = `${flairSize}px`;
      img.style.height = `${flairSize}px`;
      img.style.pointerEvents = "none";
      img.style.userSelect = "none";
      img.style.opacity = 0.04;
      img.style.filter = "grayscale(100%) brightness(60%)";

      let col = i % gridCols;
      let row = Math.floor(i / gridCols);

      let placed = false;
      let attempts = 0;
      while (!placed && attempts < maxAttempts) {
        let left = randomBetween(
          col * cellWidth,
          (col + 1) * cellWidth - flairSize
        );
        let top = randomBetween(
          row * cellHeight,
          (row + 1) * cellHeight - flairSize
        );
        let rotation = randomBetween(-45, 45);

        let overlapping = placedPositions.some((pos) =>
          isOverlap(left, top, flairSize, pos.left, pos.top, flairSize)
        );

        if (!overlapping) {
          img.style.left = `${left}px`;
          img.style.top = `${top}px`;
          img.style.transform = `rotate(${rotation}deg)`;
          placedPositions.push({ left, top });
          placed = true;
        }
        attempts++;
      }

      if (placed) {
        container.appendChild(img);
        flairImgs.push(img);
      }
    }
  }

  createFlairs();

  window.addEventListener("resize", () => {
    createFlairs();
  });

  window.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 650) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    flairImgs.forEach((img) => {
      const imgRect = img.getBoundingClientRect();
      const imgX = imgRect.left + imgRect.width / 2;
      const imgY = imgRect.top + imgRect.height / 2;

      const dx = mouseX - imgX;
      const dy = mouseY - imgY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < revealRadius) {
        gsap.to(img, {
          duration: 0.4,
          ease: "power2.out",
          opacity: 0.5,
          filter: "grayscale(50%) brightness(100%)",
        });
      } else {
        gsap.to(img, {
          duration: 0.4,
          ease: "power2.out",
          opacity: 0.04,
          filter: "grayscale(100%) brightness(60%)",
        });
      }
    });
  });
});
