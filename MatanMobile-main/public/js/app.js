// קובץ JavaScript זה מכיל את כל הלוגיקה של האפליקציה
// ניהול מצב, קריאות API, ופונקציות עזר

// משתנים גלובליים
const API_BASE_URL = '/api';
let currentUser = null;
let cartItems = [];
let productsFilters = { category: '', brand: '', storage: '' };

function getAuthToken() {
  return localStorage.getItem('authToken');
}

// fetch עם Authorization header ל-JWT
function apiFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return fetch(url, { ...options, headers });
}

function loadUserFromStorage() {
  const userStr = localStorage.getItem('currentUser');
  const token = getAuthToken();
  if (userStr && token) {
    currentUser = JSON.parse(userStr);
    updateUserUI();
  } else if (!token) {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUserUI();
  }
}

function saveUserToStorage(user, token) {
  if (user && token) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    currentUser = user;
  } else {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    currentUser = null;
  }
  updateUserUI();
}

// פונקציה לעדכון ממשק המשתמש (Header)
// מציגה/מסתירה כפתורי התחברות/התנתקות לפי מצב המשתמש
function updateUserUI() {
  const userMenu = document.querySelector('.user-menu');
  const mobileAuth = document.getElementById('mobileAuth');
  const target = userMenu || mobileAuth;
  if (!target) return;

  const authHTML = currentUser ? `
    <div class="mobile-auth-user">
      <a href="profile.html" class="mobile-auth-link">👤 ${currentUser.firstName || currentUser.email}</a>
      ${(currentUser.isAdmin || currentUser.email === 'admin@matan.com') ? '<a href="admin.html" class="mobile-auth-link">⚙️ לוח בקרה</a>' : ''}
      <a href="profile.html#profile-orders" class="mobile-auth-link">📦 ההזמנות שלי</a>
      <button type="button" class="mobile-auth-logout" onclick="logout(); closeMobileMenu();">🚪 התנתקות</button>
    </div>
  ` : `
    <div class="mobile-auth-btns">
      <a href="login.html" class="btn btn-secondary btn-sm">התחבר</a>
      <a href="register.html" class="btn btn-primary btn-sm">הרשם</a>
    </div>
  `;

  if (currentUser) {
    const userMenuHTML = `
      <div class="user-dropdown">
        <button class="user-dropdown-trigger" onclick="toggleUserDropdown(event)" aria-expanded="false">
          שלום, ${currentUser.firstName || currentUser.email} ▾
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <a href="profile.html#profile-details">👤 פרטים אישיים</a>
          <a href="profile.html#profile-credit">💳 אמצעי תשלום שמורים</a>
          <a href="profile.html#profile-orders">📦 ההזמנות שלי</a>
          <a href="profile.html#profile-address">🏠 פרטי חיוב ומשלוח</a>
          ${(currentUser.isAdmin || currentUser.email === 'admin@matan.com') ? '<a href="admin.html">⚙️ לוח בקרה</a>' : ''}
          <hr>
          <button type="button" class="user-dropdown-logout" onclick="logout()">🚪 התנתקות</button>
        </div>
      </div>
    `;
    if (userMenu) userMenu.innerHTML = userMenuHTML;
    if (mobileAuth) mobileAuth.innerHTML = authHTML;
    loadCart();
  } else {
    const guestHTML = `
      <a href="login.html" class="btn btn-secondary">התחבר</a>
      <a href="register.html" class="btn btn-primary">הרשם</a>
    `;
    if (userMenu) userMenu.innerHTML = guestHTML;
    if (mobileAuth) mobileAuth.innerHTML = authHTML;
    cartItems = [];
    updateCartBadge();
  }
}

function closeMobileMenu() {
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');
  if (nav) nav.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// פתיחה/סגירה של תפריט המשתמש
function toggleUserDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById('userDropdownMenu');
  const trigger = document.querySelector('.user-dropdown-trigger');
  if (menu && trigger) {
    const isOpen = menu.classList.contains('show');
    menu.classList.toggle('show');
    trigger.setAttribute('aria-expanded', !isOpen);
    if (!isOpen) {
      document.addEventListener('click', closeUserDropdownOnce);
    }
  }
}
function closeUserDropdownOnce() {
  const menu = document.getElementById('userDropdownMenu');
  const trigger = document.querySelector('.user-dropdown-trigger');
  if (menu && trigger) {
    menu.classList.remove('show');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeUserDropdownOnce);
  }
}

function logout() {
  saveUserToStorage(null, null);
  cartItems = [];
  updateCartBadge();
  if (window.location.pathname.includes('cart.html')) {
    window.location.href = 'index.html';
  }
}

// פונקציה לטעינת מוצרים (תמיכה בסינון לפי קטגוריה, מותג, נפח אחסון)
async function loadProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.storage) params.set('storage', filters.storage);
    const query = params.toString();
    const url = `${API_BASE_URL}/products${query ? '?' + query : ''}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      displayProducts(result.data);
    } else {
      showAlert('שגיאה בטעינת המוצרים', 'error');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showAlert('שגיאה בטעינת המוצרים', 'error');
  }
}

// סינון דינמי – מעדכן סינונים, טוען מוצרים, מעדכן URL ומצב active
function applyFilter(updates) {
  Object.assign(productsFilters, updates);
  loadProducts(productsFilters);
  const params = new URLSearchParams();
  if (productsFilters.category) params.set('category', productsFilters.category);
  if (productsFilters.brand) params.set('brand', productsFilters.brand);
  if (productsFilters.storage) params.set('storage', productsFilters.storage);
  const query = params.toString();
  const url = `products.html${query ? '?' + query : ''}`;
  history.replaceState(null, '', url);
  updateFilterActiveStates();
}

// עדכון מצב active על כפתורי הסינון
function updateFilterActiveStates() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    const val = btn.dataset.category ?? '';
    btn.classList.toggle('active', (val === '' && !productsFilters.category) || val === productsFilters.category);
  });
  document.querySelectorAll('.brand-filter-btn').forEach(btn => {
    const val = btn.dataset.brand ?? '';
    btn.classList.toggle('active', (val === '' && !productsFilters.brand) || val === productsFilters.brand);
  });
  document.querySelectorAll('.storage-filter-btn').forEach(btn => {
    const val = btn.dataset.storage ?? '';
    btn.classList.toggle('active', (val === '' && !productsFilters.storage) || val === productsFilters.storage);
  });
}

// פונקציה להצגת מוצרים
// מציגה את המוצרים ברשת על המסך
function displayProducts(products) {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;

  if (products.length === 0) {
    productsGrid.innerHTML = '<div class="empty-state"><h2>לא נמצאו מוצרים</h2></div>';
    return;
  }

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card" data-brand="${(product.brand || '').toLowerCase()}" data-category="${(product.category || '').toLowerCase()}" onclick="viewProduct(${product.id})">
      <img src="${product.image || 'https://via.placeholder.com/300'}" 
           alt="${product.title}" 
           class="product-image"
           onerror="this.src='https://via.placeholder.com/300'">
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">₪${product.price.toLocaleString()}</div>
        <div class="product-rating">${'★'.repeat(Math.floor(product.rating))} ${product.rating}</div>
        <p class="product-description">${product.description || ''}</p>
        <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
          הוסף לסל
        </button>
      </div>
    </div>
  `).join('');
}

// פונקציה להצגת מוצר בודד
// טוענת ומציגה פרטי מוצר ספציפי
async function loadProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const result = await response.json();

    if (result.success) {
      displayProductDetails(result.data);
    } else {
      showAlert('מוצר לא נמצא', 'error');
    }
  } catch (error) {
    console.error('Error loading product:', error);
    showAlert('שגיאה בטעינת המוצר', 'error');
  }
}

// פונקציה להצגת פרטי מוצר
// מציגה את פרטי המוצר עם אפשרות לבחירת צבע ואחסון אם יש ווריאציות
function displayProductDetails(product) {
  const container = document.querySelector('.product-details');
  if (!container) return;

  // בדיקה אם יש ווריאציות (צבעים, אחסון או דגמים)
  const hasVariations = product.variations && (product.variations.colors || product.variations.storage || product.variations.models);
  
  // בחירות ברירת מחדל
  let selectedColor = product.variations?.colors?.[0] || null;
  let selectedStorage = product.variations?.storage?.[0] || null;
  let selectedModel = product.variations?.models?.[0] || null;
  
  // חישוב מחיר לפי בחירות
  let currentPrice = product.price || 0;
  if (selectedStorage) {
    currentPrice += selectedStorage.priceModifier || 0;
  }
  if (selectedColor) {
    currentPrice += selectedColor.priceModifier || 0;
  }

  // שמירת מחיר בסיסי למשתנה גלובלי
  window[`basePrice_${product.id}`] = product.price || 0;

  // יצירת HTML לבחירת צבעים
  let colorSelectionHTML = '';
  if (product.variations?.colors) {
    colorSelectionHTML = `
      <div class="variation-section">
        <h3>בחירת צבע:</h3>
        <div class="color-options">
          ${product.variations.colors.map((color, index) => `
            <div class="color-option ${index === 0 ? 'selected' : ''}" 
                 data-color="${color.value}"
                 onclick="selectColor('${color.value}', ${product.id})">
              <img src="${color.image}" alt="${color.name}" 
                   onerror="this.src='https://via.placeholder.com/100'">
              <span>${color.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // יצירת HTML לבחירת אחסון
  let storageSelectionHTML = '';
  if (product.variations?.storage) {
    storageSelectionHTML = `
      <div class="variation-section">
        <h3>בחירת נפח אחסון:</h3>
        <div class="storage-options">
          ${product.variations.storage.map((storage, index) => {
            const storagePrice = product.price + (storage.priceModifier || 0);
            return `
              <button class="storage-option ${index === 0 ? 'selected' : ''}" 
                      data-storage="${storage.value}"
                      data-price-modifier="${storage.priceModifier || 0}"
                      onclick="selectStorage('${storage.value}', ${storage.priceModifier || 0}, ${product.id})">
                ${storage.name}
                ${storage.priceModifier > 0 ? `<span class="price-diff">+₪${storage.priceModifier.toLocaleString()}</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // יצירת HTML לבחירת דגם
  let modelSelectionHTML = '';
  if (product.variations?.models) {
    modelSelectionHTML = `
      <div class="variation-section">
        <h3>בחירת דגם:</h3>
        <div class="storage-options">
          ${product.variations.models.map((model, index) => `
            <button class="storage-option ${index === 0 ? 'selected' : ''}" 
                    data-model="${model.value}"
                    data-price-modifier="${model.priceModifier || 0}"
                    onclick="selectModel('${model.value}', ${model.priceModifier || 0}, ${product.id})">
              ${model.name}
              ${model.priceModifier > 0 ? `<span class="price-diff">+₪${model.priceModifier.toLocaleString()}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="product-detail-card" data-brand="${(product.brand || '').toLowerCase()}" data-category="${(product.category || '').toLowerCase()}">
      <div class="product-detail-image-wrap">
        <img src="${selectedColor?.image || product.image || 'https://via.placeholder.com/500'}" 
             alt="${product.title}" 
             class="product-detail-image"
           id="product-main-image-${product.id}"
           onerror="this.src='https://via.placeholder.com/500'">
      </div>
      <div class="product-detail-info">
        <h1>${product.title}</h1>
        <div class="product-price-block">
          <div class="product-price-label">מחיר</div>
          <div class="product-price-main" id="product-price-${product.id}">₪${currentPrice.toLocaleString()}</div>
        </div>
        <div class="product-rating">${'★'.repeat(Math.floor(product.rating))} ${product.rating}</div>
        <p class="product-description">${product.description || ''}</p>
        
        ${colorSelectionHTML}
        ${storageSelectionHTML}
        ${modelSelectionHTML}
        
        <div class="product-specs">
          <p><strong>מותג:</strong> ${product.brand || 'לא צוין'}</p>
          <p><strong>דגם:</strong> ${product.model || 'לא צוין'}</p>
          ${selectedStorage ? `<p><strong>אחסון נבחר:</strong> <span id="selected-storage-${product.id}">${selectedStorage.name}</span></p>` : ''}
          ${selectedColor ? `<p><strong>צבע נבחר:</strong> <span id="selected-color-${product.id}">${selectedColor.name}</span></p>` : ''}
          ${selectedModel ? `<p><strong>דגם נבחר:</strong> <span id="selected-model-${product.id}">${selectedModel.name}</span></p>` : ''}
          <p><strong>מלאי:</strong> ${product.stock || 0} יחידות</p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="addToCartWithVariations(${product.id})">
          הוסף לסל
        </button>
      </div>
    </div>
  `;

  // שמירת בחירות נוכחיות
  window[`selectedColor_${product.id}`] = selectedColor?.value || null;
  window[`selectedStorage_${product.id}`] = selectedStorage?.value || null;
  window[`selectedStoragePriceModifier_${product.id}`] = selectedStorage?.priceModifier || 0;
  window[`selectedModel_${product.id}`] = selectedModel?.value || null;
}

// פונקציה לניווט למוצר
// מעבירה לדף פרטי המוצר
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// פונקציה לבחירת צבע
// מעדכנת את התמונה והמחיר לפי הצבע שנבחר
function selectColor(colorValue, productId) {
  // הסרת בחירה קודמת
  document.querySelectorAll(`.color-option[data-color]`).forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // הוספת בחירה חדשה
  const selectedOption = document.querySelector(`.color-option[data-color="${colorValue}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    
    // עדכון תמונה ראשית
    const img = selectedOption.querySelector('img');
    if (img) {
      const mainImage = document.getElementById(`product-main-image-${productId}`);
      if (mainImage) {
        mainImage.src = img.src;
      }
    }
    
    // עדכון בחירה נוכחית
    window[`selectedColor_${productId}`] = colorValue;
    
    // עדכון תצוגת צבע נבחר
    const colorName = selectedOption.querySelector('span').textContent;
    const selectedColorSpan = document.getElementById(`selected-color-${productId}`);
    if (selectedColorSpan) {
      selectedColorSpan.textContent = colorName;
    }
    
    // עדכון מחיר אם יש שינוי מחיר לצבע
    updateProductPrice(productId);
  }
}

// פונקציה לבחירת אחסון
// מעדכנת את המחיר לפי האחסון שנבחר
function selectStorage(storageValue, priceModifier, productId) {
  // הסרת בחירה קודמת
  document.querySelectorAll(`.storage-option[data-storage]`).forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // הוספת בחירה חדשה
  const selectedOption = document.querySelector(`.storage-option[data-storage="${storageValue}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    
    // עדכון בחירה נוכחית
    window[`selectedStorage_${productId}`] = storageValue;
    window[`selectedStoragePriceModifier_${productId}`] = priceModifier;
    
    // עדכון תצוגת אחסון נבחר
    const storageText = selectedOption.textContent.trim();
    const storageName = storageText.split('\n')[0] || storageText.split('+')[0].trim();
    const selectedStorageSpan = document.getElementById(`selected-storage-${productId}`);
    if (selectedStorageSpan) {
      selectedStorageSpan.textContent = storageName;
    }
    
    // עדכון מחיר
    updateProductPrice(productId);
  }
}

// פונקציה לבחירת דגם
// מעדכנת את הדגם הנבחר
function selectModel(modelValue, priceModifier, productId) {
  // הסרת בחירה קודמת
  document.querySelectorAll(`.storage-option[data-model]`).forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // הוספת בחירה חדשה
  const selectedOption = document.querySelector(`.storage-option[data-model="${modelValue}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    
    // עדכון בחירה נוכחית
    window[`selectedModel_${productId}`] = modelValue;
    
    // עדכון תצוגת דגם נבחר
    const modelText = selectedOption.textContent.trim();
    const modelName = modelText.split('\n')[0] || modelText.split('+')[0].trim();
    const selectedModelSpan = document.getElementById(`selected-model-${productId}`);
    if (selectedModelSpan) {
      selectedModelSpan.textContent = modelName;
    }
  }
}

// פונקציה לעדכון מחיר המוצר
// מחשבת את המחיר הסופי לפי בחירות הצבע והאחסון
function updateProductPrice(productId) {
  const basePrice = window[`basePrice_${productId}`] || 0;
  const storageModifier = window[`selectedStoragePriceModifier_${productId}`] || 0;
  const colorModifier = 0; // כרגע אין שינוי מחיר לצבעים
  
  const totalPrice = basePrice + storageModifier + colorModifier;
  
  // עדכון תצוגת המחיר
  const priceElement = document.getElementById(`product-price-${productId}`);
  if (priceElement) {
    priceElement.textContent = `₪${totalPrice.toLocaleString()}`;
  }
}

// פונקציה להוספה לסל עם ווריאציות
// מוסיפה מוצר לסל עם הצבע והאחסון שנבחרו
async function addToCartWithVariations(productId) {
  if (!currentUser) {
    showAlert('אנא התחבר כדי להוסיף מוצרים לסל', 'error');
    window.location.href = 'login.html';
    return;
  }

  const selectedColor = window[`selectedColor_${productId}`] || null;
  const selectedStorage = window[`selectedStorage_${productId}`] || null;
  const selectedModel = window[`selectedModel_${productId}`] || null;

  try {
    const response = await apiFetch(`${API_BASE_URL}/cart/${currentUser.id}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        productId, 
        quantity: 1,
        variation: {
          color: selectedColor,
          storage: selectedStorage,
          model: selectedModel
        }
      })
    });

    const result = await response.json();

    if (result.success) {
      showAlert('המוצר נוסף לסל בהצלחה!', 'success');
      cartItems = result.data.items;
      updateCartBadge();
    } else {
      showAlert(result.message || 'שגיאה בהוספת המוצר לסל', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showAlert('שגיאה בהוספת המוצר לסל', 'error');
  }
}

// פונקציה להוספה לסל (ללא ווריאציות - למוצרים רגילים)
// מוסיפה מוצר לסל הקניות
async function addToCart(productId) {
  if (!currentUser) {
    showAlert('אנא התחבר כדי להוסיף מוצרים לסל', 'error');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await apiFetch(`${API_BASE_URL}/cart/${currentUser.id}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    const result = await response.json();

    if (result.success) {
      showAlert('המוצר נוסף לסל בהצלחה!', 'success');
      cartItems = result.data.items;
      updateCartBadge();
    } else {
      showAlert(result.message || 'שגיאה בהוספת המוצר לסל', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showAlert('שגיאה בהוספת המוצר לסל', 'error');
  }
}

// פונקציה לטעינת סל
// טוענת את סל הקניות של המשתמש
async function loadCart() {
  if (!currentUser) return;

  try {
    const response = await apiFetch(`${API_BASE_URL}/cart/${currentUser.id}`);
    const result = await response.json();

    if (result.success) {
      cartItems = result.data.items;
      updateCartBadge();
      if (document.querySelector('.cart-items')) {
        displayCart(result.data);
      }
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// פונקציה להצגת סל
// מציגה את פריטי הסל על המסך
function displayCart(cartData) {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartSummary = document.querySelector('.cart-summary');

  if (!cartItemsContainer) return;

  if (cartData.items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-state">
        <h2>הסל שלך ריק</h2>
        <p style="margin: 1rem 0;">עדיין לא הוספת מוצרים לסל. גלו את המגוון שלנו!</p>
        <a href="products.html" class="btn btn-primary">עבור למוצרים</a>
      </div>
    `;
    if (cartSummary) {
      cartSummary.innerHTML = '';
    }
    return;
  }

  cartItemsContainer.innerHTML = cartData.items.map(item => `
    <div class="cart-item">
      <img src="${item.product.image || 'https://via.placeholder.com/100'}" 
           alt="${item.product.title}" 
           class="cart-item-image"
           onerror="this.src='https://via.placeholder.com/100'">
      <div class="cart-item-info">
        <h3 class="cart-item-title">${item.product.title}</h3>
        <div class="cart-item-price">₪${item.product.price.toLocaleString()}</div>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
        <input type="number" class="quantity-input" value="${item.quantity}" 
               onchange="updateCartQuantity(${item.productId}, this.value)" min="1">
        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-total">₪${(item.product.price * item.quantity).toLocaleString()}</div>
      <button class="btn btn-danger" onclick="removeFromCart(${item.productId})">הסר</button>
    </div>
  `).join('');

  if (cartSummary) {
    cartSummary.innerHTML = `
      <h2>סיכום הזמנה</h2>
      <div class="cart-total">סה"כ: ₪${cartData.total.toLocaleString()}</div>
      <button class="btn btn-success btn-lg" onclick="checkout()">המשך לתשלום</button>
    `;
  }
}

// פונקציה לעדכון כמות בסל
async function updateCartQuantity(productId, quantity) {
  if (!currentUser) return;

  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }

  try {
    const response = await apiFetch(`${API_BASE_URL}/cart/${currentUser.id}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity: parseInt(quantity) })
    });

    const result = await response.json();

    if (result.success) {
      cartItems = result.data.items;
      updateCartBadge();
      displayCart(result.data);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

// פונקציה להסרת מוצר מסל
async function removeFromCart(productId) {
  if (!currentUser) return;

  try {
    const response = await apiFetch(`${API_BASE_URL}/cart/${currentUser.id}/remove/${productId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      cartItems = result.data.items;
      updateCartBadge();
      displayCart(result.data);
      showAlert('המוצר הוסר מהסל', 'success');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}

// פונקציה לעדכון ספירת הסל
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// פונקציה להצגת התראה
function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  document.body.insertBefore(alert, document.body.firstChild);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// לוגואים למותגים (לסינון ויזואלי)
const BRAND_LOGOS = {
  Apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  Samsung: 'https://ksp.co.il/images/brands/137.png',
  Xiaomi: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
  OnePlus: 'https://ksp.co.il/images/brands/2190.png',
  Nothing: 'https://ksp.co.il/images/brands/42471.png'
};

// פונקציה לטעינת קטגוריות (דינמי מ-API)
async function loadCategories() {
  const categoriesContainer = document.querySelector('.categories');
  if (!categoriesContainer) return;

  let categories = [{ name: 'הכל', value: null }];
  try {
    const res = await fetch(`${API_BASE_URL}/products/filters/options`);
    const result = await res.json();
    if (result.success && result.data.categories?.length) {
      categories = categories.concat(result.data.categories.map(c => ({ name: c.name, value: c.value })));
    } else {
      categories.push({ name: 'סמארטפונים', value: 'smartphones' }, { name: 'אביזרים', value: 'accessories' });
    }
  } catch (e) {
    categories.push({ name: 'סמארטפונים', value: 'smartphones' }, { name: 'אביזרים', value: 'accessories' });
  }

  const urlParams = new URLSearchParams(window.location.search);
  productsFilters.category = urlParams.get('category') || '';
  productsFilters.brand = urlParams.get('brand') || '';
  productsFilters.storage = urlParams.get('storage') || '';
  
  categoriesContainer.innerHTML = categories.map(cat => {
      const val = cat.value || '';
      const isActive = (!val && !productsFilters.category) || (val === productsFilters.category);
      return `
        <button type="button" class="category-btn ${isActive ? 'active' : ''}" data-category="${val}">
          ${cat.name}
        </button>
      `;
    }).join('');
  
  categoriesContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter({ category: btn.dataset.category || '' }));
  });
}

// טעינת אפשרויות סינון (מותגים, נפחי אחסון) והצגתם
async function loadFilterOptions() {
  const brandContainer = document.getElementById('brandFilters');
  const storageContainer = document.getElementById('storageFilters');
  if (!brandContainer || !storageContainer) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products/filters/options`);
    const result = await res.json();
    if (!result.success) return;

    const { brands, storage } = result.data;
    const currentBrand = productsFilters.brand;
    const currentStorage = productsFilters.storage;

    brandContainer.innerHTML = `
      <button type="button" class="brand-filter-btn ${!currentBrand ? 'active' : ''}" data-brand="" title="הכל">
        <span style="font-size:20px">◉</span>
        <span>הכל</span>
      </button>
    ` + brands.map(b => {
      const logo = BRAND_LOGOS[b] || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const isActive = currentBrand === b;
      return `
        <button type="button" class="brand-filter-btn ${isActive ? 'active' : ''}" data-brand="${b}" title="${b}">
          <img src="${logo}" alt="${b}" onerror="this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'">
          <span>${b}</span>
        </button>
      `;
    }).join('');

    storageContainer.innerHTML = `
      <button type="button" class="storage-filter-btn ${!currentStorage ? 'active' : ''}" data-storage="">הכל</button>
    ` + storage.map(s => {
      const isActive = currentStorage === s;
      return `
        <button type="button" class="storage-filter-btn ${isActive ? 'active' : ''}" data-storage="${s}">${s}</button>
      `;
    }).join('');

    brandContainer.querySelectorAll('.brand-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => applyFilter({ brand: btn.dataset.brand || '' }));
    });
    storageContainer.querySelectorAll('.storage-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => applyFilter({ storage: btn.dataset.storage || '' }));
    });
  } catch (e) {
    console.error('Error loading filter options:', e);
  }
}

// פונקציה לתשלום - מעבירה לדף תשלום מאובטח (Stripe-like)
function checkout() {
  if (!currentUser) {
    showAlert('אנא התחבר כדי להשלים את הרכישה', 'error');
    window.location.href = 'login.html?redirect=checkout.html';
    return;
  }
  window.location.href = 'checkout.html';
}

// תפריט מובייל - המבורגר
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');
  if (!btn || !nav) return;
  const toggle = () => {
    nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  };
  btn.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', toggle);
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      nav.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// אתחול בעת טעינת הדף
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  loadUserFromStorage();
  loadCategories();
  
  // טעינת מוצרים אם יש products-grid (לא בדף מוצרים - שם הטעינה מתבצעת בסקריפט הנפרד)
  if (document.querySelector('.products-grid') && !document.getElementById('brandFilters')) {
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {
      category: urlParams.get('category') || '',
      brand: urlParams.get('brand') || '',
      storage: urlParams.get('storage') || ''
    };
    loadProducts(filters);
  }
  
  // טעינת מוצר בודד אם יש product-details
  if (document.querySelector('.product-details')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      loadProduct(id);
    }
  }
  
  // טעינת סל אם יש cart-items
  if (document.querySelector('.cart-items')) {
    // בדיקה אם המשתמש מחובר כבר נמצאת ב-cart.html
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      loadCart();
    }
  }
});
