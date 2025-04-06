// images.js
import { feed, pageIndicator, widthSlider } from './domRefs.js';

let slides = [];
let currentIndex = 0;

export async function loadImagesFromSubfolder(folderHandle) {
  feed.innerHTML = '';
  slides = [];
  currentIndex = 0;

  const imageFiles = [];
  for await (const entry of folderHandle.values()) {
    if (entry.kind === 'file' && /\.(jpe?g|png|gif|webp)$/i.test(entry.name)) {
      imageFiles.push(entry);
    }
  }

  imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  for (const fileHandle of imageFiles) {
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);

    const slide = document.createElement('div');
    slide.className = 'image-slide';

    const img = document.createElement('img');
    img.src = url;
    img.alt = file.name;

    slide.appendChild(img);
    feed.appendChild(slide);
  }

  slides = document.querySelectorAll('.image-slide');
  document.documentElement.style.setProperty('--image-width', widthSlider.value + 'px');
  updatePageIndicator(0, slides.length); // after loading new images
}

export function scrollToPage(index) {
  if (slides.length > 0 && index >= 0 && index < slides.length) {
    slides[index].scrollIntoView({ behavior: 'instant', block: 'start' });
  }
}

export function updatePageIndicator(i_currentIndex, i_totalSlides) {
  pageIndicator.textContent = `Page ${i_currentIndex + 1} / ${i_totalSlides}`;
}

export function setupScrollTracking() {
  feed.addEventListener('scroll', () => {
    let foundIndex = 0;
    const scrollTop = feed.scrollTop;
    slides.forEach((slide, i) => {
      if (slide.offsetTop <= scrollTop + 10) {
        foundIndex = i;
      }
    });
    currentIndex = foundIndex;
    window.currentIndex = foundIndex; // Store current index in window object
    updatePageIndicator(currentIndex, slides.length);
  });
}