'use strict';

// DADOS DOS IMÓVEIS (JSON)
const propertiesData = [
  {
    id: 1,
    title: "Casa Rua Real, 367 Centro Irará Bahia",
    image: "images/img2.jpg",
    gallery: ["images/img2.jpg", "images/gallery1.jpg", "images/gallery2.jpg"],
    videoUrl: "https://www.youtube.com/embed/PVoQZhnyxiE",
    category: "casa",
    negocio: "comprar",
    area: 7500,
    beds: 3,
    baths: 2,
    price: 5000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 2,
    title: "Chácara Estrada do Mato, 102 Matinha Feira de Santana Bahia",
    image: "images/img3.jpg",
    gallery: ["images/img3.jpg", "images/gallery3.jpg", "images/gallery4.jpg"],
    videoUrl: "https://www.youtube.com/embed/RXxOZCV9Czk",
    category: "chacara",
    negocio: "comprar",
    area: 8000,
    beds: 3,
    baths: 2,
    price: 4000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 3,
    title: "49 Consett Rd, Hilton, UK",
    image: "images/img4.jpg",
    gallery: ["images/img4.jpg", "images/gallery5.jpg", "images/gallery1.jpg"],
    videoUrl: "https://www.youtube.com/embed/y2tEPkio_9A",
    category: "offices",
    negocio: "alugar/comprar",
    area: 8000,
    beds: 3,
    baths: 3,
    price: 5000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 4,
    title: "5 Helland Bridge, Upper Boat, UK",
    image: "images/img5.jpg",
    gallery: ["images/img5.jpg", "images/gallery2.jpg", "images/gallery3.jpg"],
    videoUrl: null,
    category: "townhome",
    negocio: "comprar",
    area: 7500,
    beds: 3,
    baths: 2,
    price: 3500,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 5,
    title: "53 Main St, Acharacle, UK",
    image: "images/img6.jpg",
    gallery: ["images/img6.jpg", "images/gallery4.jpg", "images/gallery5.jpg"],
    videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ",
    category: "house",
    negocio: "alugar",
    area: 7500,
    beds: 3,
    baths: 2,
    price: 2800,
    rating: 4.8,
    reviews: 19
  },
  {
    id: 6,
    title: "10 Southlands Road, United Kingdom",
    image: "images/img7.jpg",
    gallery: ["images/img7.jpg", "images/gallery1.jpg", "images/gallery3.jpg"],
    videoUrl: null,
    category: "apartment",
    negocio: "alugar/comprar",
    area: 8000,
    beds: 4,
    baths: 3,
    price: 5500,
    rating: 4.9,
    reviews: 31
  },
];


const addEventOnElement = function (element, type, listener) {
  if (element.length > 1) {
    for (let i = 0; i < element.length; i++) {
      element[i].addEventListener(type, listener);
    }
  } else {
    element.addEventListener(type, listener);
  }
}

//============ NAVBAR ===============//
const navbar = document.querySelector("[data-navbar]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
}

if (navToggler) addEventOnElement(navToggler, "click", toggleNav);

const closeNav = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

if (navLinks.length) addEventOnElement(navLinks, "click", closeNav);

const header = document.querySelector("[data-header]");
window.addEventListener("scroll", function () {
  if (this.window.scrollY >= 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

// Tab Button
const tabBtns = document.querySelectorAll("[data-tab-btn]");
let lastClickedTabBtn = tabBtns[0];

const changeTab = function () {
  lastClickedTabBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedTabBtn = this;
}
if (tabBtns.length) addEventOnElement(tabBtns, "click", changeTab);

//========================================//
//  RENDERIZAÇÃO E FILTRO DE PROPRIEDADES //
//========================================//

const propertyList = document.querySelector(".property-list");
const filterForm = document.querySelector(".hero-form");

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const renderProperties = (properties) => {
  propertyList.innerHTML = "";

  if (!properties || properties.length === 0) {
    propertyList.innerHTML = `<p class="no-results">Nenhum imóvel encontrado com os critérios selecionados.</p>`;
    return;
  }

  properties.forEach(property => {
    const propertyCard = document.createElement("li");
    propertyCard.innerHTML = `
      <div class="property-card" data-id="${property.id}">
        <figure class="card-banner img-holder" style="--width: 800; --height: 533;">
          <img src="${property.image}" width="800" height="533" loading="lazy" alt="${property.title}" class="img-cover">
        </figure>
        <button class="card-action-btn" aria-label="add to favourite">
          <ion-icon name="heart-outline"></ion-icon>
        </button>
        <div class="card-content">
          <h3 class="h3">
            <a href="#" class="card-title">${property.title}</a>
          </h3>
          <ul class="card-list">
            <li class="card-item">
              <div class="item-icon"><ion-icon name="cube-outline"></ion-icon></div>
              <span class="item-text">${property.area} m2</span>
            </li>
            <li class="card-item">
              <div class="item-icon"><ion-icon name="bed-outline"></ion-icon></div>
              <span class="item-text">0${property.beds} Quarto(s)</span>
            </li>
            <li class="card-item">
              <div class="item-icon"><ion-icon name="man-outline"></ion-icon></div>
              <span class="item-text">0${property.baths} Banheiro(s)</span>
            </li>
            <li class="card-item">
              <div class="item-icon"><ion-icon name="car-outline"></ion-icon></div>
              <span class="item-text">0${property.baths} Garagem</span>
            </li>
          </ul>
          <div class="card-meta">
            <div>
              <span class="meta-title">Preço</span>
              <span class="meta-text">R$ ${priceFormatter.format(property.price)}</span>
            </div>
            <div>
              <span class="meta-title">Rating</span>
              <span class="meta-text">
                <div class="rating-wrapper">
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                  <ion-icon name="star"></ion-icon>
                </div>
                <span>${property.rating} (${property.reviews})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
    propertyList.appendChild(propertyCard);
  });
}

// ========== FILTRO PRINCIPAL ==========

const searchInputEl = document.getElementById("search");
const categoryInputEl = document.getElementById("category");
const minPriceInputEl = document.getElementById("min-price");
const maxPriceInputEl = document.getElementById("max-price");

// Função para saber qual tab está ativa (Comprar, Alugar, Todos)
function getActiveNegocio() {
  const activeTab = document.querySelector(".tab-btn.active");
  if (!activeTab) return "todos";
  return activeTab.textContent.trim().toLowerCase(); // comprar, alugar, todos
}

// Função que aplica todos os filtros, incluindo a tab
function applyFilters() {
  const searchInput = searchInputEl ? searchInputEl.value.toLowerCase() : "";
  const categoryInput = categoryInputEl ? categoryInputEl.value : "todas";
  const minPriceInput = minPriceInputEl ? parseInt(minPriceInputEl.value) || 0 : 0;
  const maxPriceInput = maxPriceInputEl ? parseInt(maxPriceInputEl.value) || Infinity : Infinity;
  const activeNegocio = getActiveNegocio();

  const filteredProperties = propertiesData.filter(property => {
    const titleMatch = searchInput ? property.title.toLowerCase().includes(searchInput) : true;
    const categoryMatch = categoryInput === 'todas' || property.category === categoryInput;
    const priceMatch = property.price >= minPriceInput && property.price <= maxPriceInput;
    let negocioMatch = true;
    if (activeNegocio !== "todos") {
      negocioMatch = property.negocio === activeNegocio || property.negocio === "alugar/comprar";
    }
    return titleMatch && categoryMatch && priceMatch && negocioMatch;
  });

  renderProperties(filteredProperties);
}

// Listeners dos campos de filtro
if (searchInputEl) searchInputEl.addEventListener('input', applyFilters);
if (categoryInputEl) categoryInputEl.addEventListener('change', applyFilters);
if (minPriceInputEl) minPriceInputEl.addEventListener('change', applyFilters);
if (maxPriceInputEl) maxPriceInputEl.addEventListener('change', applyFilters);

// Listener das tabs para aplicar o filtro ao clicar
if (tabBtns.length) tabBtns.forEach(btn => {
  btn.addEventListener("click", applyFilters);
});

// Remove o comportamento de submit do formulário
if (filterForm) filterForm.addEventListener("submit", function (e) {
  e.preventDefault();
});

// Renderizar todos os imóveis na carga inicial
document.addEventListener("DOMContentLoaded", () => {
  renderProperties(propertiesData);
});

//=========================//
//  MODAL (POPUP) DE MÍDIA //
//=========================//

const modalOverlay = document.querySelector("[data-modal-overlay]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const modalImg = document.querySelector("[data-modal-img]");
const prevBtn = document.querySelector("[data-prev-btn]");
const nextBtn = document.querySelector("[data-next-btn]");
const playVideoBtn = document.querySelector("[data-play-video-btn]");
const videoWrapper = document.querySelector("[data-video-wrapper]");

let currentProperty;
let currentImageIndex;

function openModal() {
  modalOverlay.classList.add("active");
  modalContainer.classList.add("active");
  document.body.classList.add("modal-active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
  modalContainer.classList.remove("active");
  document.body.classList.remove("modal-active");
  // Limpa o vídeo ao fechar
  videoWrapper.innerHTML = "";
  videoWrapper.style.display = "none";
  modalImg.style.display = "block";
}

function showImage(index) {
  modalImg.src = currentProperty.gallery[index];
  currentImageIndex = index;
  videoWrapper.style.display = "none";
  modalImg.style.display = "block";
}

function showNextImage() {
  const nextIndex = (currentImageIndex + 1) % currentProperty.gallery.length;
  showImage(nextIndex);
}

function showPrevImage() {
  const prevIndex = (currentImageIndex - 1 + currentProperty.gallery.length) % currentProperty.gallery.length;
  showImage(prevIndex);
}

function playVideo() {
  if (currentProperty.videoUrl) {
    modalImg.style.display = "none";
    videoWrapper.style.display = "block";
    videoWrapper.innerHTML = `<iframe width="100%" height="100%" src="${currentProperty.videoUrl}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
}

// Event Listeners para o Modal
if (propertyList) propertyList.addEventListener("click", function (e) {
  const cardBanner = e.target.closest(".card-banner");
  if (cardBanner) {
    const propertyCard = cardBanner.closest(".property-card");
    const propertyId = parseInt(propertyCard.dataset.id);
    currentProperty = propertiesData.find(p => p.id === propertyId);

    if (currentProperty) {
      showImage(0);
      if (currentProperty.videoUrl) {
        playVideoBtn.style.display = 'flex';
      } else {
        playVideoBtn.style.display = 'none';
      }
      openModal();
    }
  }
});

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
if (nextBtn) nextBtn.addEventListener("click", showNextImage);
if (prevBtn) prevBtn.addEventListener("click", showPrevImage);
if (playVideoBtn) playVideoBtn.addEventListener("click", playVideo);
