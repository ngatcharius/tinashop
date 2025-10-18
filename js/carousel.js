class CardCarousel {
  constructor() {
    this.cards = document.querySelectorAll(".card-item");
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    // Event listeners
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.next());
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prev());

    // Autoplay
    this.startAutoplay();

    // Pause autoplay on hover
    document
      .querySelector(".cards-carousel")
      .addEventListener("mouseenter", () => {
        this.stopAutoplay();
      });

    document
      .querySelector(".cards-carousel")
      .addEventListener("mouseleave", () => {
        this.startAutoplay();
      });
  }

  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Rotate cards
    const newIndex = (this.currentIndex + 1) % this.cards.length;
    this.rotateCards(newIndex);
    this.currentIndex = newIndex;

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Rotate cards backward
    const newIndex =
      (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.rotatePrevCards(newIndex);
    this.currentIndex = newIndex;

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  rotateCards(newIndex) {
    this.cards.forEach((card, index) => {
      const distance =
        (index - newIndex + this.cards.length) % this.cards.length;

      // Remove previous animation classes
      card.classList.remove("slide-out-left", "slide-in-right");

      // Set new position
      this.setCardPosition(card, distance);
    });
  }

  rotatePrevCards(newIndex) {
    this.cards.forEach((card, index) => {
      const distance =
        (index - newIndex + this.cards.length) % this.cards.length;

      // Remove previous animation classes
      card.classList.remove("slide-out-left", "slide-in-right");

      // Set new position
      this.setCardPosition(card, distance);
    });
  }

  setCardPosition(card, distance) {
    let transform = "";
    let opacity = 0;
    let zIndex = 1;

    switch (distance) {
      case 0: // Front card
        transform = "translateX(0) translateY(0) scale(1) rotateY(0deg)";
        opacity = 1;
        zIndex = 5;
        break;
      case 1: // Right side
        transform =
          "translateX(220px) translateY(20px) scale(0.85) rotateY(-20deg)";
        opacity = 0.7;
        zIndex = 4;
        break;
      case 2: // Far right
        transform =
          "translateX(440px) translateY(60px) scale(0.6) rotateY(-50deg)";
        opacity = 0.4;
        zIndex = 3;
        break;
      case 3: // Left side
        transform =
          "translateX(-220px) translateY(20px) scale(0.85) rotateY(20deg)";
        opacity = 0.7;
        zIndex = 4;
        break;
      case 4: // Far left
        transform =
          "translateX(-440px) translateY(60px) scale(0.6) rotateY(50deg)";
        opacity = 0.4;
        zIndex = 3;
        break;
    }

    card.style.transform = transform;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
    card.style.transition = "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, 4000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Initialize carousel when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new CardCarousel();
});
