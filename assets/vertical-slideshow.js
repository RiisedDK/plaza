/**
 *  @class
 *  @function VerticalSlideshow
 */
if (!customElements.get('vertical-slideshow')) {
  class VerticalSlideshow extends HTMLElement {
    constructor() {
      super();
      let section = this;

      this.parent_section = this.closest('.shopify-section');
      this.slides = Array.from(section.querySelectorAll('.vertical-slideshow--slide'));
      this.dots = section.querySelector('.vertical-slideshow-dots');
      this.dots_li = this.dots?.querySelectorAll('li');
      this.animations = [];
      this.animations_enabled = document.body.classList.contains('animations-true') && typeof gsap !== 'undefined';
    }
    connectedCallback() {
      document.addEventListener('DOMContentLoaded', this.setupScrolling.bind(this));
    }
    setupScrolling() {
      let video_containers = [];
      this.slides.forEach((slide, i) => {
        const length = this.slides.length;
        const endInfo = this.slides.length - 1 === i ? "top top" : "bottom top";
        video_containers.push(slide.querySelector('.vertical-slideshow--slide-video-bg'));

        if(!ScrollTrigger) {
          return;
        }
        
        const instance = ScrollTrigger.create({
          trigger: slide,
          start: "top top",
          end: endInfo,
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 1],
            duration: 0.5,
            delay: 0.2,
            inertia: false,
          },
          pinSpacing: false,
          onToggle: self => {
            // if (this.dots_li) {
            //   [].forEach.call(this.dots_li, function(el) {
            //     el.classList.remove('is-selected');
            //   });
            //   this.dots_li[i].classList.add('is-selected');
            // }
          },
          onUpdate: self => {
            let base_58 = (1 - self.progress.toFixed(3)) * 58;
            if (this.slides.length - 1 !== i) {
              self.pin.style.setProperty('--snap-overlay-opacity', self.progress.toFixed(3));
              self.pin.style.setProperty('--snap-content-opacity', 1 - self.progress.toFixed(3));
            }
            //console.log(self.direction);
            //this.dots_li[i].style.setProperty('--vertical-slideshow--progress', base_58);
            if (self.direction == -1 && self.progress < 0.3) {

              //this.toggleDotClass(i - 1);
              if (video_containers[i]) {
                this.videoPlay(video_containers[i]);
              }
              if (video_containers[i + 1]) {
                this.videoPause(video_containers[i + 1]);
              }
              if (video_containers[i - 1]) {
                this.videoPause(video_containers[i - 1]);
              }
            } else if (self.direction == 1 && self.progress > 0.3) {

              //this.toggleDotClass(i + 1);
              if (video_containers[i]) {
                this.videoPause(video_containers[i]);
              }
              if (video_containers[i - 1]) {
                this.videoPause(video_containers[i - 1]);
              }
              if (video_containers[i + 1]) {
                this.videoPlay(video_containers[i + 1]);
              }
            } else {
              if (this.dots_li) {
                this.toggleDotClass(i);
              }
            }
          }
        });
      });

      setTimeout(() => {
        if (this.dots_li) {
          Array.from(this.dots_li).forEach((dot, index) => {
            dot.addEventListener('click', this.onDotClick.bind(this, dot, index));
          });
        }
      }, 10);
    }
    toggleDotClass(i) {
      [].forEach.call(this.dots_li, function (el) {
        el.classList.remove('is-selected');
      });
      this.dots_li[i].classList.add('is-selected');
    }
    onDotClick(dot, index) {

      let spacers = this.querySelectorAll('.pin-spacer'),
        top = spacers[index].getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top,
        left: 0,
        behavior: "smooth"
      });
    }
    videoPause(video_container) {
      if (!video_container.querySelector('video').paused) {
        video_container.querySelector('video').pause();
      }
    }
    videoPlay(video_container) {
      if (video_container.querySelector('video').paused) {
        video_container.querySelector('video').play();
      }
    }
  }
  customElements.define('vertical-slideshow', VerticalSlideshow);
}