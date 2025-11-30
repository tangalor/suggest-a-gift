// Data Collect - Content Script per Amazon.it
console.log('Data Collect extension loaded on Amazon.it');

// Chiave per il sessionStorage
const STORAGE_KEY = 'dc_products_json';

// Variabile per salvare i prodotti trovati
let productsData = [];

// Funzione per salvare il JSON nel sessionStorage
function saveJSONToStorage(jsonString) {
  try {
    sessionStorage.setItem(STORAGE_KEY, jsonString);
    console.log('JSON saved to sessionStorage');
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
  }
}

// Funzione per caricare il JSON dal sessionStorage
function loadJSONFromStorage() {
  try {
    const json = sessionStorage.getItem(STORAGE_KEY);
    return json || '';
  } catch (e) {
    console.error('Error loading from sessionStorage:', e);
    return '';
  }
}

// Funzione per contare i prodotti nel JSON storage
function getStoredProductsCount() {
  try {
    const json = loadJSONFromStorage();
    if (json.trim()) {
      const products = JSON.parse(json);
      if (Array.isArray(products)) {
        return products.length;
      }
    }
  } catch (e) {
    console.error('Error counting stored products:', e);
  }
  return 0;
}

// Funzione per ottenere statistiche aggregate
function getStoredProductsStats() {
  const stats = {
    total: 0,
    byRecipient: {},
    byCategory: {}
  };

  try {
    const json = loadJSONFromStorage();
    if (json.trim()) {
      const products = JSON.parse(json);
      if (Array.isArray(products)) {
        stats.total = products.length;
        
        // Conta per recipient
        products.forEach(product => {
          const recipient = product.recipient || 'Non specificato';
          stats.byRecipient[recipient] = (stats.byRecipient[recipient] || 0) + 1;
        });
        
        // Conta per category
        products.forEach(product => {
          const category = product.category || 'Non specificato';
          stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        });
      }
    }
  } catch (e) {
    console.error('Error getting stored products stats:', e);
  }

  return stats;
}

// Funzione per raccogliere i dati dei prodotti dalla pagina
function collectProductsData() {
  console.log('Collecting products data from page...');
  productsData = [];

  // Trova tutti i link dei prodotti con la classe specificata
  const productLinks = document.querySelectorAll('a.a-link-normal.aok-block');
  
  console.log(`Found ${productLinks.length} product links`);

  productLinks.forEach((link, index) => {
    try {
      let productUrl = link.href;
      
      // Rimuovi il parametro "ref=" e tutto quello che segue
      if (productUrl.includes('ref=')) {
        productUrl = productUrl.split('ref=')[0];
        // Rimuovi eventuali & o ? finali
        productUrl = productUrl.replace(/[?&]$/, '');
      }
      
      // Aggiungi il tag di affiliazione
      productUrl += '?tag=suggestgift77-21';
      
      // Cerca l'immagine del prodotto dentro il link
      const img = link.querySelector('img.a-dynamic-image.p13n-sc-dynamic-image.p13n-product-image');
      const imageUrl = img ? img.src : null;
      
      // Cerca il titolo del prodotto: div.p13n-sc-truncate-desktop-type2.p13n-sc-truncated textContent
      let productTitle = 'Titolo non disponibile';
      const titleDiv = document.querySelector('div.p13n-sc-truncate-desktop-type2.p13n-sc-truncated');
      if (titleDiv) {
        productTitle = titleDiv.textContent.trim();
      } else {
        // Fallback: prova senza la seconda classe
        const titleDivAlt = document.querySelector('div.p13n-sc-truncate-desktop-type2');
        if (titleDivAlt) {
          productTitle = titleDivAlt.textContent.trim();
        } else if (img && img.alt) {
          // Ultimo fallback: usa l'alt dell'immagine
          productTitle = img.alt;
        }
      }

      // Cerca il prezzo con la struttura specifica
      let price = null;
      
      // Cerca il container del prezzo vicino al link del prodotto
      const productContainer = link.closest('.a-section') || link.parentElement;
      
      if (productContainer) {
        // Cerca: span.a-size-base.a-color-price > span._cDEzb_p13n-sc-price_3mJ9Z
        const priceContainer = productContainer.querySelector('span.a-size-base.a-color-price');
        
        if (priceContainer) {
          const priceSpan = priceContainer.querySelector('span._cDEzb_p13n-sc-price_3mJ9Z');
          if (priceSpan) {
            price = priceSpan.textContent.trim();
          }
        }
      }

      // Aggiungi solo se abbiamo almeno URL e immagine
      if (productUrl && imageUrl) {
        productsData.push({
          id: index + 1,
          title: productTitle,
          url: productUrl,
          image: imageUrl,
          price: price || 'Prezzo non disponibile'
        });
      }
    } catch (error) {
      console.error('Error collecting product data:', error);
    }
  });

  console.log(`Collected ${productsData.length} products with complete data`);
  return productsData;
}

// Funzione per interpretare categoria, destinatario ed età dal titolo
function interpretProductData(title) {
  const titleLower = title.toLowerCase();
  
  // Determina il destinatario
  let recipient = 'Unisex';
  if (titleLower.match(/donna|women|femminile|lei|her|girls|ragazza/i)) {
    recipient = 'Donna';
  } else if (titleLower.match(/uomo|men|maschile|lui|him|boys|ragazzo/i)) {
    recipient = 'Uomo';
  } else if (titleLower.match(/bambini|bambino|bambina|kids|child|baby|neonato/i)) {
    recipient = 'Bambini';
  }
  
  // Determina l'età
  let age = '18+';
  if (titleLower.match(/bambini|bambino|bambina|kids|child|baby|neonato|giocattolo|gioco/i)) {
    age = '0-17';
  }
  
  // Determina la categoria
  let category = 'Altro';
  
  if (titleLower.match(/orologio|watch/i)) category = titleLower.match(/donna|women/i) ? 'Orologio Donna' : titleLower.match(/uomo|men/i) ? 'Orologio Uomo' : 'Orologio';
  else if (titleLower.match(/libro|book/i)) category = 'Libri';
  else if (titleLower.match(/profumo|parfum|fragranza/i)) category = 'Profumi';
  else if (titleLower.match(/borsa|zaino|valigia|bag/i)) category = 'Borse e Zaini';
  else if (titleLower.match(/scarpe|shoes|sneaker/i)) category = 'Scarpe';
  else if (titleLower.match(/gioiell|bracciale|collana|anello|orecchini|jewelry/i)) category = 'Gioielli';
  else if (titleLower.match(/smartphone|telefono|cellulare|phone/i)) category = 'Smartphone';
  else if (titleLower.match(/tablet|ipad/i)) category = 'Tablet';
  else if (titleLower.match(/laptop|notebook|computer/i)) category = 'Computer';
  else if (titleLower.match(/cuffie|auricolar|headphone|earbuds/i)) category = 'Audio';
  else if (titleLower.match(/gioco|giocattolo|toy|game/i)) category = 'Giochi';
  else if (titleLower.match(/console|playstation|xbox|nintendo/i)) category = 'Gaming';
  else if (titleLower.match(/cosmetico|makeup|trucco|beauty/i)) category = 'Cosmetici';
  else if (titleLower.match(/abbigliamento|maglietta|felpa|vestito|clothing/i)) category = 'Abbigliamento';
  else if (titleLower.match(/elettronica|electronic/i)) category = 'Elettronica';
  else if (titleLower.match(/casa|home|arredamento/i)) category = 'Casa';
  else if (titleLower.match(/sport|fitness|palestra/i)) category = 'Sport';
  
  return { category, recipient, age };
}

// Funzione per creare il JSON dei prodotti
function generateProductsJSON(existingJSON = '') {
  let existingProducts = [];
  
  // Parse del JSON esistente se presente
  if (existingJSON.trim()) {
    try {
      existingProducts = JSON.parse(existingJSON);
      if (!Array.isArray(existingProducts)) {
        existingProducts = [];
      }
    } catch (e) {
      console.error('Error parsing existing JSON:', e);
      existingProducts = [];
    }
  }
  
  // Crea un set per controllare i duplicati
  const existingLinks = new Set(existingProducts.map(p => p.link));
  const existingImages = new Set(existingProducts.map(p => p.imageLink));
  const existingTitles = new Set(existingProducts.map(p => p.title));
  
  // Aggiungi nuovi prodotti evitando duplicati
  productsData.forEach(product => {
    // Controlla se è un duplicato
    if (existingLinks.has(product.url) || 
        existingImages.has(product.image) || 
        existingTitles.has(product.title)) {
      return; // Skip duplicati
    }
    
    // Estrai solo il numero dal prezzo
    let priceNumber = product.price.replace(/[^0-9,]/g, '').replace(',', '.');
    priceNumber = parseFloat(priceNumber) || 0;
    priceNumber = Math.round(priceNumber);
    
    // Interpreta categoria, destinatario ed età
    const interpretation = interpretProductData(product.title);
    
    existingProducts.push({
      title: product.title,
      link: product.url,
      price: priceNumber.toString(),
      imageLink: product.image,
      category: interpretation.category,
      recipient: interpretation.recipient,
      age: interpretation.age
    });
  });
  
  return existingProducts;
}

// Funzione per mostrare la modale JSON
function showJSONModal() {
  // Verifica se la modale esiste già
  let modal = document.getElementById('dc-json-modal');
  
  if (!modal) {
    // Crea la modale
    modal = document.createElement('div');
    modal.id = 'dc-json-modal';
    modal.className = 'dc-modal-overlay';
    
    modal.innerHTML = `
      <div class="dc-modal-content">
        <div class="dc-modal-header">
          <h3>📋 Export JSON</h3>
          <button class="dc-modal-close" id="dc-json-modal-close">✕</button>
        </div>
        <div class="dc-modal-body">
          <div class="dc-json-counter">
            Prodotti nel JSON: <strong id="dc-json-count">0</strong>
          </div>
          <textarea id="dc-json-textarea" class="dc-json-textarea" placeholder="Il JSON dei prodotti apparirà qui..."></textarea>
        </div>
        <div class="dc-modal-footer">
          <button class="dc-btn dc-btn-copy" id="dc-json-copy">📋 Copia JSON</button>
          <button class="dc-btn dc-btn-clear" id="dc-json-clear">🗑️ Svuota</button>
          <button class="dc-btn dc-btn-close" id="dc-json-close">Chiudi</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('dc-json-modal-close').addEventListener('click', closeJSONModal);
    document.getElementById('dc-json-close').addEventListener('click', closeJSONModal);
    document.getElementById('dc-json-copy').addEventListener('click', copyJSONToClipboard);
    document.getElementById('dc-json-clear').addEventListener('click', clearJSONStorage);
    
    // Event listener per salvare quando il testo cambia
    const textarea = document.getElementById('dc-json-textarea');
    textarea.addEventListener('input', () => {
      updateJSONCounter();
      saveJSONToStorage(textarea.value);
      updateGlobalCounter();
    });
  }
  
  // Carica il JSON esistente dal sessionStorage
  const existingJSON = loadJSONFromStorage();
  
  // Genera il nuovo JSON
  const productsJSON = generateProductsJSON(existingJSON);
  
  // Aggiorna la textarea
  const textarea = document.getElementById('dc-json-textarea');
  textarea.value = JSON.stringify(productsJSON, null, 2);
  
  // Salva nel sessionStorage
  saveJSONToStorage(textarea.value);
  
  // Aggiorna i contatori
  updateJSONCounter();
  updateGlobalCounter();
  
  // Mostra la modale
  modal.classList.add('show');
  document.body.classList.add('modal-open');
}

// Funzione per chiudere la modale JSON
function closeJSONModal() {
  const modal = document.getElementById('dc-json-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// Funzione per copiare il JSON negli appunti
function copyJSONToClipboard() {
  const textarea = document.getElementById('dc-json-textarea');
  textarea.select();
  document.execCommand('copy');
  
  const btn = document.getElementById('dc-json-copy');
  const originalText = btn.textContent;
  btn.textContent = '✅ Copiato!';
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
}

// Funzione per aggiornare il contatore dei prodotti nel JSON
function updateJSONCounter() {
  const textarea = document.getElementById('dc-json-textarea');
  const countEl = document.getElementById('dc-json-count');
  
  try {
    const json = JSON.parse(textarea.value);
    if (Array.isArray(json)) {
      countEl.textContent = json.length;
    } else {
      countEl.textContent = '0';
    }
  } catch (e) {
    countEl.textContent = '0';
  }
}

// Funzione per aggiornare il contatore globale nel sidebar
function updateGlobalCounter() {
  const globalCountEl = document.getElementById('dc-global-count');
  if (globalCountEl) {
    const count = getStoredProductsCount();
    globalCountEl.textContent = count;
  }
  
  // Aggiorna anche le statistiche
  updateGlobalStats();
}

// Funzione per aggiornare le statistiche globali
function updateGlobalStats() {
  const stats = getStoredProductsStats();
  
  // Aggiorna recipient stats
  const recipientStatsEl = document.getElementById('dc-recipient-stats');
  if (recipientStatsEl) {
    const recipientCount = Object.keys(stats.byRecipient).length;
    let html = `<div class="dc-stats-header">👥 Destinatari (${recipientCount} tipi):</div>`;
    
    // Ordina per numerosità decrescente
    const sortedRecipients = Object.entries(stats.byRecipient)
      .sort((a, b) => b[1] - a[1]);
    
    sortedRecipients.forEach(([recipient, count]) => {
      html += `
        <div class="dc-stats-item">
          <span class="dc-stats-label">${recipient}</span>
          <span class="dc-stats-value">${count}</span>
        </div>
      `;
    });
    
    recipientStatsEl.innerHTML = html;
  }
  
  // Aggiorna category stats
  const categoryStatsEl = document.getElementById('dc-category-stats');
  if (categoryStatsEl) {
    const categoryCount = Object.keys(stats.byCategory).length;
    let html = `<div class="dc-stats-header">🏷️ Categorie (${categoryCount} tipi):</div>`;
    
    // Ordina per numerosità decrescente
    const sortedCategories = Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1]);
    
    sortedCategories.forEach(([category, count]) => {
      html += `
        <div class="dc-stats-item">
          <span class="dc-stats-label">${category}</span>
          <span class="dc-stats-value">${count}</span>
        </div>
      `;
    });
    
    categoryStatsEl.innerHTML = html;
  }
}

// Funzione per svuotare il JSON storage
function clearJSONStorage() {
  if (confirm('Sei sicuro di voler svuotare tutti i prodotti salvati?')) {
    sessionStorage.removeItem(STORAGE_KEY);
    const textarea = document.getElementById('dc-json-textarea');
    textarea.value = '';
    updateJSONCounter();
    updateGlobalCounter();
    
    const btn = document.getElementById('dc-json-clear');
    const originalText = btn.textContent;
    btn.textContent = '✅ Svuotato!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }
}

// Funzione per creare l'HTML dei prodotti
function renderProductsHTML() {
  if (productsData.length === 0) {
    return `
      <div class="dc-section">
        <div class="dc-section-title">Nessun prodotto trovato</div>
        <p>Naviga su una pagina con prodotti Amazon e ricarica.</p>
      </div>
    `;
  }

  let html = `
    <div class="dc-section">
      <div class="dc-section-header">
        <div class="dc-section-title">📦 Prodotti trovati: ${productsData.length}</div>
        <button class="dc-btn dc-btn-export" id="dc-export-json">📋 Export JSON</button>
      </div>
    </div>
    <div class="dc-section dc-global-counter">
      <div class="dc-global-counter-content">
        <div class="dc-global-counter-icon">💾</div>
        <div class="dc-global-counter-text">
          <div class="dc-global-counter-label">Prodotti salvati totali:</div>
          <div class="dc-global-counter-number" id="dc-global-count">${getStoredProductsCount()}</div>
        </div>
      </div>
    </div>
    <div class="dc-section dc-stats-section">
      <div id="dc-recipient-stats" class="dc-stats-group">
        <!-- Le statistiche recipient verranno inserite qui -->
      </div>
    </div>
    <div class="dc-section dc-stats-section">
      <div id="dc-category-stats" class="dc-stats-group">
        <!-- Le statistiche category verranno inserite qui -->
      </div>
    </div>
  `;

  productsData.forEach(product => {
    html += `
      <div class="dc-product-box">
        <div class="dc-product-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="dc-product-info">
          <div class="dc-product-title">${product.title}</div>
          <div class="dc-product-price">${product.price}</div>
          <div class="dc-product-link">
            <a href="${product.url}" target="_blank" class="dc-link-btn">
              🔗 Vai al prodotto
            </a>
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

// Funzione per aggiornare il contenuto del pannello
function updateSidebarContent() {
  const content = document.getElementById('dc-sidebar-content');
  if (content) {
    content.innerHTML = renderProductsHTML();
    
    // Aggiorna le statistiche
    updateGlobalStats();
    
    // Aggiungi event listener al bottone export JSON
    const exportBtn = document.getElementById('dc-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', showJSONModal);
    }
  }
}

// Funzione per creare l'interfaccia laterale
function createSidebarUI() {
  // Verifica se l'UI è già stata creata
  if (document.getElementById('dc-sidebar-tab')) {
    return;
  }

  // Crea il pulsante a linguetta
  const tab = document.createElement('div');
  tab.id = 'dc-sidebar-tab';
  tab.textContent = 'Data Collect';
  tab.title = 'Apri Data Collect';

  // Crea il pannello laterale
  const panel = document.createElement('div');
  panel.id = 'dc-sidebar-panel';

  // Crea l'header del pannello
  const header = document.createElement('div');
  header.id = 'dc-sidebar-header';
  header.innerHTML = '<h2>📊 Data Collect</h2>';

  // Crea il contenuto del pannello
  const content = document.createElement('div');
  content.id = 'dc-sidebar-content';
  content.innerHTML = `
    <div class="dc-section">
      <div class="dc-section-title">Caricamento...</div>
      <p>Raccogliendo dati dalla pagina...</p>
    </div>
  `;

  // Assembla il pannello
  panel.appendChild(header);
  panel.appendChild(content);

  // Aggiungi tutto al DOM
  document.body.appendChild(tab);
  document.body.appendChild(panel);

  // Aggiungi l'event listener per il toggle
  tab.addEventListener('click', toggleSidebar);

  // Aggiungi animazione pulse al primo caricamento
  tab.classList.add('pulse');
  setTimeout(() => {
    tab.classList.remove('pulse');
  }, 6000);

  // Raccogli i dati dopo un breve delay per assicurarsi che la pagina sia caricata
  setTimeout(() => {
    collectProductsData();
    updateSidebarContent();
  }, 1500);
}

// Funzione per aprire/chiudere il pannello laterale
function toggleSidebar() {
  const tab = document.getElementById('dc-sidebar-tab');
  const panel = document.getElementById('dc-sidebar-panel');

  if (!tab || !panel) return;

  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    // Chiudi il pannello
    panel.classList.remove('open');
    tab.classList.remove('active');
    tab.title = 'Apri Data Collect';
  } else {
    // Apri il pannello
    panel.classList.add('open');
    tab.classList.add('active');
    tab.title = 'Chiudi Data Collect';
  }
}

// Inizializza l'estensione quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createSidebarUI);
} else {
  createSidebarUI();
}

// Gestisci la navigazione SPA di Amazon (se necessario)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Ricrea l'UI se necessario dopo la navigazione
    setTimeout(createSidebarUI, 1000);
  }
}).observe(document, { subtree: true, childList: true });
