'use strict';

// DADOS DOS IMÓVEIS (JSON)
const propertiesData = [
  {
    id: 1,
    title: "Casa Rua Real Madrid, 367 <br> Centro - Irará/BA",
    image: "images/img1.jpg",
    gallery: ["images/img1.jpg", "images/img1a.jpg", "images/img1b.jpg", "images/img1c.jpg", "images/img1d.jpg"],
    videoUrl: "https://www.youtube.com/embed/PVoQZhnyxiE",
    category: "casa",
    negocio: "comprar",
    area: 142,
    beds: 3,
    baths: 2,
    garage: 3,
    price: 5000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 2,
    title: "Chácara Estrada do Mato, 102 <br> Matinha - Feira de Santana/BA",
    image: "images/img2.jpg",
    gallery: ["images/img2.jpg", "images/img2a.jpg", "images/img2b.jpg", "images/img2c.jpg", "images/img2d.jpg"],
    videoUrl: "https://www.youtube.com/embed/RXxOZCV9Czk",
    category: "chacara",
    negocio: "comprar",
    area: 2500,
    beds: 3,
    baths: 2,
    garage: 4,
    price: 8000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 3,
    title: "Apartamento Av. Leal Maia, 207 <br> Centro - Salvador/BA",
    image: "images/img3.jpg",
    gallery: ["images/img3.jpg", "images/img3a.jpg", "images/img3b.jpg", "images/img3c.jpg", "images/img3d.jpg"],
    videoUrl: "https://www.youtube.com/embed/5A8ZdLnXizE",
    category: "apartamento",
    negocio: "alugar/comprar",
    area: 67,
    beds: 3,
    baths: 3,
    garage: 1,
    price: 50000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 4,
    title: "Sala Ed. Premier Rua Amazonas, 67 <br> Centro - Salvador/BA",
    image: "images/img4.jpg",
    gallery: ["images/img4.jpg", "images/img4a.jpg", "images/img4b.jpg", "images/img4c.jpg", "images/img4d.jpg"],
    videoUrl: "https://www.youtube.com/embed/PVoQZhnyxiE",
    category: "sala",
    negocio: "comprar",
    area: 44,
    beds: 3,
    baths: 2,
    garage: 0,
    price: 100000,
    rating: 5.0,
    reviews: 24
  },
  {
    id: 5,
    title: "Terreno BR-324 KM 107 s/n, <br> Jaíba - Irará/BA",
    image: "images/img5.jpg",
    gallery: ["images/img5.jpg", "images/img5a.jpg", "images/img5b.jpg", "images/img5c.jpg", "images/img5d.jpg"],
    videoUrl: "https://www.youtube.com/embed/5A8ZdLnXizE",
    category: "galpao",
    negocio: "alugar",
    area: 6500,
    beds: 3,
    baths: 2,
    garage: 9,
    price: 150000,
    rating: 4,
    reviews: 19
  },
  {
    id: 6,
    title: "Galpão Rua Piracicaba, 1.658 <br> Jussara - Jequié/BA",
    image: "images/img6.jpg",
    gallery: ["images/img6.jpg", "images/img6a.jpg", "images/img6b.jpg", "images/img6c.jpg", "images/img6d.jpg"],
    videoUrl:  "https://www.youtube.com/embed/RXxOZCV9Czk",
    category: "terreno",
    negocio: "alugar/comprar",
    area: 1200,
    beds: 4,
    baths: 3,
    garage: 8,
    price: 120000,
    rating: 7,
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

// ===== MENU HAMBURGUER & NAVBAR ACTIVE =====
const navbar = document.querySelector("[data-navbar]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

// Função para alternar o menu hamburguer
function toggleNav() {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

// Adiciona evento ao botão hamburguer
if (navToggler) {
  navToggler.addEventListener("click", toggleNav);
}

// Função para fechar o menu hamburguer
function closeNav() {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

// Ativar link clicado e fechar menu hamburguer no mobile
navLinks.forEach(link => {
  link.addEventListener("click", function () {
    // Remove 'active' de todos os links
    navLinks.forEach(l => l.classList.remove("active"));
    // Adiciona 'active' ao link clicado
    this.classList.add("active");
    // Fecha o menu hamburguer (útil no mobile)
    closeNav();
  });
});

// ===== HEADER SHADOW AO SCROLL =====
const header = document.querySelector("[data-header]");
window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

// ===== TABS (se você usar tabs em outra parte do site) =====
const tabBtns = document.querySelectorAll("[data-tab-btn]");
let lastClickedTabBtn = tabBtns[0];

tabBtns.forEach(tabBtn => {
  tabBtn.addEventListener("click", function () {
    if (lastClickedTabBtn) lastClickedTabBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedTabBtn = this;
  });
});


//========================================//
//  RENDERIZAÇÃO E FILTRO DE PROPRIEDADES //
//========================================//

const propertyList = document.querySelector(".property-list");
const filterForm = document.querySelector(".hero-form");

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Pega a lista de favoritos do localStorage
function getFavorites() {
  const favoritesJSON = localStorage.getItem('favoriteProperties');
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

// Salva a lista de favoritos no localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
}


// ===================================================================
//  RENDERIZAÇÃO DE PROPRIEDADES (ATUALIZADA)
// ===================================================================

const renderProperties = (properties) => {
  propertyList.innerHTML = "";

  if (!properties || properties.length === 0) {
    propertyList.innerHTML = `<p class="no-results">Nenhum imóvel encontrado com os critérios selecionados.</p>`;
    return;
  }

  // Pega a lista de favoritos UMA VEZ antes de começar o loop
  const favorites = getFavorites();

  properties.forEach(property => {
    const propertyCard = document.createElement("li");

    // Verifica se o imóvel atual está na lista de favoritos
    const isFavorite = favorites.includes(property.id);

    propertyCard.innerHTML = `
      <div class="property-card" data-id="${property.id}">
        <figure class="card-banner img-holder" style="--width: 800; --height: 533;">
          <img src="${property.image}" width="800" height="533" loading="lazy" alt="${property.title}" class="img-cover">
        </figure>

        <button class="card-action-btn ${isFavorite ? 'active' : ''}" aria-label="add to favourite">
          <ion-icon name="${isFavorite ? 'heart' : 'heart-outline'}"></ion-icon>
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
               <span class="item-text">0${property.garage} Garagem</span>
             </li>
          </ul>
          <div class="card-meta">
            <div>
              <span class="meta-title">Preço</span>
              <span class="meta-text">R$ ${priceFormatter.format(property.price)}</span>
            </div>
            <div>
              <span class="meta-title">Avaliação</span>
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

// ===================================================================
//  EVENTO DE CLIQUE PARA ADICIONAR/REMOVER FAVORITOS
// ===================================================================

propertyList.addEventListener('click', function (event) {
  // Encontra o botão de coração mais próximo que foi clicado
  const heartButton = event.target.closest('.card-action-btn');

  // Se o clique não foi em um botão de coração, não faz nada
  if (!heartButton) return;

  // Pega o card e o ID do imóvel
  const card = heartButton.closest('.property-card');
  const propertyId = parseInt(card.dataset.id);
  const icon = heartButton.querySelector('ion-icon');

  // Pega a lista atual de favoritos
  let favorites = getFavorites();

  // Verifica se o imóvel JÁ é um favorito
  if (favorites.includes(propertyId)) {
    // Se sim, REMOVE da lista
    favorites = favorites.filter(id => id !== propertyId);
    // E atualiza a aparência do botão
    icon.name = 'heart-outline';
    heartButton.classList.remove('active');
  } else {
    // Se não, ADICIONA na lista
    favorites.push(propertyId);
    // E atualiza a aparência do botão
    icon.name = 'heart';
    heartButton.classList.add('active');
  }

  // Salva a nova lista (modificada) de volta no localStorage
  saveFavorites(favorites);
});


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

// Mostra o botão quando rolar para baixo
window.onscroll = function () {
  const topButton = document.getElementById("top");
  if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
    topButton.classList.add("show"); // Mostra o botão
  } else {
    topButton.classList.remove("show"); // Esconde o botão
  }
};

// Rolagem suave para o topo
document.getElementById("top").addEventListener("click", function (event) {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Transição suave para o topo
  });
});

// --- Lógica do Banner LGPD ---
const lgpdBanner = document.getElementById('lgpdBanner');
const acceptLgpdBtn = document.getElementById('acceptLgpdBtn');
const declineLgpdBtn = document.getElementById('declineLgpdBtn');

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

if (!getCookie('lgpdConsent')) {
  lgpdBanner.classList.remove('hidden');
}

acceptLgpdBtn.addEventListener('click', () => {
  setCookie('lgpdConsent', 'accepted', 365);
  lgpdBanner.classList.add('hidden');
  toastr.success("Cookies aceitos com sucesso!", "Confirmação");
});

declineLgpdBtn.addEventListener('click', () => {
  setCookie('lgpdConsent', 'declined', 1);
  lgpdBanner.classList.add('hidden');
  toastr.error("Cookies foram rejeitados.", "Aviso");
});

// --- Configurações do Toastr ---
toastr.options = {
  positionClass: "toast-bottom-center",
  progressBar: true,
  timeOut: 3000,
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};