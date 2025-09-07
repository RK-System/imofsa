'use strict';

// ===================================================================
//  FUNÇÕES E ELEMENTOS GERAIS DA INTERFACE (UI)
// ===================================================================

const addEventOnElement = function (element, type, listener) {
  if (element.length > 1) {
    for (let i = 0; i < element.length; i++) {
      element[i].addEventListener(type, listener);
    }
  } else {
    element.addEventListener(type, listener);
  }
}

// ===== MENU HAMBURGUER & NAVBAR =====
const navbar = document.querySelector("[data-navbar]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

if (navToggler) {
  navToggler.addEventListener("click", () => {
    navbar.classList.toggle("active");
    navToggler.classList.toggle("active");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    navToggler.classList.remove("active");
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// ===== HEADER SHADOW AO SCROLL =====
const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => {
  header.classList.toggle("active", window.scrollY >= 50);
});

// ===== TABS DE FILTRO (COMPRAR/ALUGAR) =====
const tabBtns = document.querySelectorAll("[data-tab-btn]");
let lastClickedTabBtn = tabBtns[0];

tabBtns.forEach(tabBtn => {
  tabBtn.addEventListener("click", function () {
    if (lastClickedTabBtn) lastClickedTabBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedTabBtn = this;
    // A função de filtro será chamada pelo listener configurado na inicialização
  });
});

// ===================================================================
//  LÓGICA PRINCIPAL DOS IMÓVEIS (DADOS, RENDERIZAÇÃO, FILTROS, MODAL)
// ===================================================================

// --- Variáveis Globais para a Lógica dos Imóveis ---
let propertiesData = []; // Esta variável vai guardar os dados do JSON
const propertyList = document.querySelector(".property-list");
const filterForm = document.querySelector(".hero-form");

// Elementos do formulário de filtro
const searchInputEl = document.getElementById("search");
const categoryInputEl = document.getElementById("category");
const minPriceInputEl = document.getElementById("min-price");
const maxPriceInputEl = document.getElementById("max-price");

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});


// --- Lógica de Favoritos com LocalStorage ---
const getFavorites = () => JSON.parse(localStorage.getItem('favoriteProperties')) || [];
const saveFavorites = (favorites) => localStorage.setItem('favoriteProperties', JSON.stringify(favorites));


// --- Função para Renderizar os Imóveis na Tela ---
const renderProperties = (properties) => {
  propertyList.innerHTML = "";

  if (!properties || properties.length === 0) {
    propertyList.innerHTML = `<p class="no-results">Nenhum imóvel encontrado com os critérios selecionados.</p>`;
    return;
  }

  const favorites = getFavorites();

  properties.forEach(property => {
    const isFavorite = favorites.includes(property.id);
    const propertyCard = document.createElement("li");
    propertyCard.innerHTML = `
      <div class="property-card" data-id="${property.id}">
        <figure class="card-banner img-holder" style="--width: 800; --height: 533;">
          <img src="${property.image}" width="800" height="533" loading="lazy" alt="${property.title}" class="img-cover">
        </figure>

        <button class="card-action-btn ${isFavorite ? 'active' : ''}" aria-label="Adicionar aos Favoritos">
          <ion-icon name="${isFavorite ? 'heart' : 'heart-outline'}"></ion-icon>
        </button>

        <div class="card-content">
          <h3 class="h3"><a  class="card-title">${property.title}</a></h3>
          <ul class="card-list">
            <li class="card-item"><div class="item-icon"><ion-icon name="cube-outline"></ion-icon></div><span class="item-text">${property.area} m²</span></li>
            <li class="card-item"><div class="item-icon"><ion-icon name="bed-outline"></ion-icon></div><span class="item-text">${property.beds} Quarto(s)</span></li>
            <li class="card-item"><div class="item-icon"><ion-icon name="man-outline"></ion-icon></div><span class="item-text">${property.baths} Banheiro(s)</span></li>
            <li class="card-item"><div class="item-icon"><ion-icon name="car-outline"></ion-icon></div><span class="item-text">${property.garage} Garagem</span></li>
          </ul>
          <div class="card-meta">
            <div>
              <span class="meta-title">Preço</span>
              <span class="meta-text">${priceFormatter.format(property.price)}</span>
            </div>
            <div>
              <span class="meta-title">Avaliação</span>
              <span class="meta-text">
                <div class="rating-wrapper"><ion-icon name="star"></ion-icon><ion-icon name="star"></ion-icon><ion-icon name="star"></ion-icon><ion-icon name="star"></ion-icon><ion-icon name="star-half"></ion-icon></div>
                <span>${property.rating.toFixed(1)} (${property.reviews} reviews)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
    propertyList.appendChild(propertyCard);
  });
};


// --- Função Principal de Filtragem ---
const applyFilters = () => {
  const searchInput = searchInputEl ? searchInputEl.value.toLowerCase() : "";
  const categoryInput = categoryInputEl ? categoryInputEl.value : "todas";
  const minPriceInput = minPriceInputEl ? parseFloat(minPriceInputEl.value) || 0 : 0;
  const maxPriceInput = maxPriceInputEl ? parseFloat(maxPriceInputEl.value) || Infinity : Infinity;
  const activeTab = document.querySelector(".tab-btn.active");
  const activeNegocio = activeTab ? activeTab.textContent.trim().toLowerCase() : "todos";

  const filteredProperties = propertiesData.filter(property => {
    const titleMatch = property.title.toLowerCase().includes(searchInput);
    const categoryMatch = categoryInput === 'todas' || property.category === categoryInput;
    const priceMatch = property.price >= minPriceInput && property.price <= maxPriceInput;
    const negocioMatch = activeNegocio === "todos" ? true : property.negocio.includes(activeNegocio) || property.negocio === "alugar/comprar";
    return titleMatch && categoryMatch && priceMatch && negocioMatch;
  });

  renderProperties(filteredProperties);
};


// --- Lógica do Modal de Mídia ---
const modalOverlay = document.querySelector("[data-modal-overlay]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const modalImg = document.querySelector("[data-modal-img]");
const prevBtn = document.querySelector("[data-prev-btn]");
const nextBtn = document.querySelector("[data-next-btn]");
const playVideoBtn = document.querySelector("[data-play-video-btn]");
const videoWrapper = document.querySelector("[data-video-wrapper]");
let currentProperty, currentImageIndex;

const openModal = () => {
  modalOverlay.classList.add("active");
  modalContainer.classList.add("active");
  document.body.classList.add("modal-active");
};

const closeModal = () => {
  modalOverlay.classList.remove("active");
  modalContainer.classList.remove("active");
  document.body.classList.remove("modal-active");
  videoWrapper.innerHTML = "";
  videoWrapper.style.display = "none";
  modalImg.style.display = "block";
};

const showImage = (index) => {
  modalImg.src = currentProperty.gallery[index];
  currentImageIndex = index;
  videoWrapper.style.display = "none";
  modalImg.style.display = "block";
};

const showNextImage = () => showImage((currentImageIndex + 1) % currentProperty.gallery.length);
const showPrevImage = () => showImage((currentImageIndex - 1 + currentProperty.gallery.length) % currentProperty.gallery.length);

const playVideo = () => {
  if (currentProperty.videoUrl) {
    modalImg.style.display = "none";
    videoWrapper.style.display = "block";
    videoWrapper.innerHTML = `<iframe width="100%" height="100%" src="${currentProperty.videoUrl}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
};


// --- Event Listeners para Favoritos e Modal (Usando Delegação de Eventos) ---
propertyList.addEventListener("click", (e) => {
  const heartButton = e.target.closest('.card-action-btn');
  const cardBanner = e.target.closest('.card-banner');

  if (heartButton) {
    const card = heartButton.closest('.property-card');
    const propertyId = parseInt(card.dataset.id);
    const icon = heartButton.querySelector('ion-icon');
    let favorites = getFavorites();

    if (favorites.includes(propertyId)) {
      favorites = favorites.filter(id => id !== propertyId);
      icon.name = 'heart-outline';
      heartButton.classList.remove('active');
    } else {
      favorites.push(propertyId);
      icon.name = 'heart';
      heartButton.classList.add('active');
    }
    saveFavorites(favorites);
  }

  if (cardBanner) {
    const propertyCard = cardBanner.closest(".property-card");
    const propertyId = parseInt(propertyCard.dataset.id);
    currentProperty = propertiesData.find(p => p.id === propertyId);

    if (currentProperty) {
      showImage(0);
      playVideoBtn.style.display = currentProperty.videoUrl ? 'flex' : 'none';
      openModal();
    }
  }
});

// Listeners para fechar e navegar no modal
if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
if (nextBtn) nextBtn.addEventListener("click", showNextImage);
if (prevBtn) prevBtn.addEventListener("click", showPrevImage);
if (playVideoBtn) playVideoBtn.addEventListener("click", playVideo);


// ===================================================================
//  PONTO DE ENTRADA E INICIALIZAÇÃO DA APLICAÇÃO
// ===================================================================

async function iniciarAplicacao() {
  try {
    // 1. Busca os dados dos imóveis no arquivo JSON
    const response = await fetch('imoveis/propriedades.json'); // <-- ATENÇÃO AQUI: MUDE PARA 'imoveis/propriedades.json' SE NECESSÁRIO
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }
    propertiesData = await response.json();

    // 2. Renderiza a lista inicial de imóveis na tela
    renderProperties(propertiesData);

    // 3. Configura os event listeners para os filtros AGORA que os dados existem
    if (searchInputEl) searchInputEl.addEventListener('input', applyFilters);
    if (categoryInputEl) categoryInputEl.addEventListener('change', applyFilters);
    if (minPriceInputEl) minPriceInputEl.addEventListener('change', applyFilters);
    if (maxPriceInputEl) maxPriceInputEl.addEventListener('change', applyFilters);
    tabBtns.forEach(btn => btn.addEventListener("click", applyFilters));
    if (filterForm) filterForm.addEventListener("submit", (e) => e.preventDefault());

  } catch (error) {
    console.error("Falha ao iniciar a aplicação:", error);
    propertyList.innerHTML = `<p class="no-results">Não foi possível carregar os imóveis. Por favor, tente novamente mais tarde.</p>`;
  }
}

// Dispara a função de inicialização quando o HTML estiver completamente carregado
document.addEventListener("DOMContentLoaded", iniciarAplicacao);


// ===================================================================
//  SCRIPTS ADICIONAIS (BOTÃO VOLTAR AO TOPO, BANNER LGPD)
// ===================================================================

// --- Botão Voltar ao Topo ---
const topButton = document.getElementById("top");
if (topButton) {
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 600);
  });
  topButton.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- Lógica do Banner LGPD ---
const lgpdBanner = document.getElementById('lgpdBanner');
const acceptLgpdBtn = document.getElementById('acceptLgpdBtn');
const declineLgpdBtn = document.getElementById('declineLgpdBtn');

if (lgpdBanner) {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  if (!getCookie('lgpdConsent')) {
    lgpdBanner.classList.remove('hidden');
  }

  acceptLgpdBtn.addEventListener('click', () => {
    setCookie('lgpdConsent', 'accepted', 365);
    lgpdBanner.classList.add('hidden');
    if (typeof toastr !== 'undefined') toastr.success("Cookies aceitos com sucesso!", "Confirmação");
  });

  declineLgpdBtn.addEventListener('click', () => {
    setCookie('lgpdConsent', 'declined', 1);
    lgpdBanner.classList.add('hidden');
    if (typeof toastr !== 'undefined') toastr.error("Cookies foram rejeitados.", "Aviso");
  });

  // --- Configurações do Toastr (se estiver usando) ---
  if (typeof toastr !== 'undefined') {
    toastr.options = {
      positionClass: "toast-bottom-center",
      progressBar: true,
      timeOut: 3000,
    };
  }
}