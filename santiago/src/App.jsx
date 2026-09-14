import { useMemo, useState } from 'react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom'

const createProductImage = (title, category) => {
  const colors = {
    Albums: ['#19152d', '#8b5cf6'],
    Lightsticks: ['#111827', '#ec4899'],
    Merchandise: ['#172554', '#3b82f6'],
    Accessories: ['#3f1725', '#f43f5e']
  }

  const [first, second] = colors[category] || ['#171717', '#a855f7']

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${first}"/>
          <stop offset="100%" stop-color="${second}"/>
        </linearGradient>
      </defs>
      <rect width="700" height="700" rx="40" fill="url(#g)"/>
      <circle cx="580" cy="110" r="90" fill="rgba(255,255,255,.12)"/>
      <circle cx="100" cy="600" r="130" fill="rgba(255,255,255,.08)"/>
      <text x="50%" y="45%" text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="62"
        font-weight="700"
        fill="white">SEOULPOP</text>
      <text x="50%" y="56%" text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="30"
        fill="white">${title}</text>
      <text x="50%" y="64%" text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="22"
        fill="rgba(255,255,255,.8)">${category}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const initialProducts = [
  {
    id: 1,
    name: 'IVE - EMPATHY Album',
    price: 1299,
    category: 'Albums',
    stock: 15,
    description:
      'IVE EMPATHY album featuring a stylish photobook, photocards, CD and exclusive album inclusions.'
  },
  {
    id: 2,
    name: 'Stray Kids - ATE Album',
    price: 1399,
    category: 'Albums',
    stock: 12,
    description:
      'Stray Kids ATE album package with collectible photocards, photobook and official album inclusions.'
  },
  {
    id: 3,
    name: 'BLACKPINK Official Lightstick',
    price: 2499,
    category: 'Lightsticks',
    stock: 8,
    description:
      'Official BLACKPINK-inspired lightstick design perfect for concerts, collections and K-pop displays.'
  },
  {
    id: 4,
    name: 'BTS Army Bomb',
    price: 2799,
    category: 'Lightsticks',
    stock: 7,
    description:
      'A collectible BTS lightstick-style item designed for ARMY collections and concert events.'
  },
  {
    id: 5,
    name: 'TWICE Ready To Be Hoodie',
    price: 1899,
    category: 'Merchandise',
    stock: 10,
    description:
      'Comfortable TWICE-inspired hoodie with a clean concert merchandise design and relaxed fit.'
  },
  {
    id: 6,
    name: 'ENHYPEN Logo T-Shirt',
    price: 999,
    category: 'Merchandise',
    stock: 20,
    description:
      'Minimal ENHYPEN-inspired shirt featuring a modern logo design suitable for everyday outfits.'
  },
  {
    id: 7,
    name: 'SEVENTEEN Carat Keychain',
    price: 499,
    category: 'Accessories',
    stock: 25,
    description:
      'Cute SEVENTEEN-inspired keychain accessory for bags, backpacks and personal collections.'
  },
  {
    id: 8,
    name: 'NewJeans Bunny Phone Charm',
    price: 599,
    category: 'Accessories',
    stock: 18,
    description:
      'Playful bunny-themed phone charm inspired by the fresh and youthful K-pop aesthetic.'
  },
  {
    id: 9,
    name: 'aespa Armageddon Album',
    price: 1499,
    category: 'Albums',
    stock: 11,
    description:
      'aespa Armageddon album with collectible packaging, photobook and official inclusions.'
  },
  {
    id: 10,
    name: 'LE SSERAFIM Cap',
    price: 899,
    category: 'Merchandise',
    stock: 14,
    description:
      'Simple LE SSERAFIM-inspired cap that combines a casual style with K-pop merchandise.'
  }
].map((product) => ({
  ...product,
  image: createProductImage(product.name.split(' - ')[0], product.category)
}))

function App() {
  const [products] = useState(initialProducts)
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)

      if (existing) {
        if (existing.quantity >= product.stock) {
          return currentCart
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        const product = products.find((productItem) => productItem.id === id)

        if (!product || item.quantity >= product.stock) {
          return item
        }

        return { ...item, quantity: item.quantity + 1 }
      })
    )
  }

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' || product.category === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const placeOrder = (customer) => {
    const order = {
      id: `SP-${Date.now()}`,
      customer,
      items: cart,
      total: cartTotal,
      date: new Date().toLocaleString()
    }

    setOrders((currentOrders) => [...currentOrders, order])
    setCart([])

    return order.id
  }

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">✦</span>
          Seoul<span>Pop</span>
        </Link>

        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Cart
            <span className="cart-badge">{cartCount}</span>
          </NavLink>

          <NavLink
            to="/checkout"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Checkout
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={filteredProducts}
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                addToCart={addToCart}
              />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetails
                products={products}
                addToCart={addToCart}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                cartTotal={cartTotal}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                cartTotal={cartTotal}
                placeOrder={placeOrder}
                orders={orders}
              />
            }
          />
        </Routes>
      </main>

      <footer>
        <div>
          <strong>SeoulPop</strong>
          <p>Your little corner for K-pop favorites.</p>
        </div>
        <p>© 2026 SeoulPop. Front-end e-commerce project.</p>
      </footer>
    </div>
  )
}

function HomePage({
  products,
  search,
  setSearch,
  category,
  setCategory,
  addToCart
}) {
  const [page, setPage] = useState(1)
  const productsPerPage = 6

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / productsPerPage)
  )

  const currentPage = Math.min(page, totalPages)

  const startIndex = (currentPage - 1) * productsPerPage
  const visibleProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  )

  const categories = ['All', 'Albums', 'Lightsticks', 'Merchandise', 'Accessories']

  const updateSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const updateCategory = (value) => {
    setCategory(value)
    setPage(1)
  }

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">WELCOME TO SEOULPOP</p>
          <h1>
            Your K-pop collection,
            <br />
            <span>starts here.</span>
          </h1>
          <p className="hero-text">
            Discover albums, lightsticks, apparel and accessories made for
            every K-pop fan.
          </p>
          <a href="#products" className="hero-button">
            Shop Collection
          </a>
        </div>

        <div className="hero-card">
          <div className="hero-star">✦</div>
          <p>NEW DROP</p>
          <h2>K-POP<br />FAVORITES</h2>
          <span>ALBUMS • MERCH • MORE</span>
        </div>
      </section>

      <section className="catalog" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Popular Picks</h2>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'filter active' : 'filter'}
              onClick={() => updateCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="empty-search">
            <div>⌕</div>
            <h3>No products found</h3>
            <p>Try another product name or category.</p>
          </div>
        )}

        {products.length > productsPerPage && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  className={currentPage === number ? 'selected' : ''}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              →
            </button>
          </div>
        )}
      </section>
    </>
  )
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {product.stock <= 8 && <span className="stock-tag">Limited</span>}
        </div>
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>

        <p className="description">{product.description}</p>

        <div className="product-bottom">
          <strong>₱{product.price.toLocaleString()}</strong>

          <button
            className="add-button"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}

function ProductDetails({ products, addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <section className="not-found">
        <h1>Product Not Found</h1>
        <p>The product you're looking for does not exist.</p>
        <Link to="/" className="primary-button">
          Back to Shop
        </Link>
      </section>
    )
  }

  return (
    <section className="details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-content">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>

          <div className="rating">★★★★★ <span>Fan favorite</span></div>

          <div className="details-price">
            ₱{product.price.toLocaleString()}
          </div>

          <p className="full-description">{product.description}</p>

          <div className="details-stock">
            <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
              ● {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.stock > 0 && (
              <span>{product.stock} pieces available</span>
            )}
          </div>

          <button
            className="primary-button large"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>

          <div className="product-notes">
            <div>
              <strong>✓ Official-style merchandise</strong>
              <span>Carefully selected K-pop inspired products.</span>
            </div>
            <div>
              <strong>✓ Cash on Delivery</strong>
              <span>Pay conveniently when your order arrives.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CartPage({
  cart,
  cartTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
}) {
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <section className="empty-cart">
        <div className="empty-icon">♡</div>
        <p className="eyebrow">YOUR CART</p>
        <h1>Your cart is empty</h1>
        <p>Add something from our collection and it will appear here.</p>
        <Link to="/" className="primary-button">
          Continue Shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="page-title">
        <p className="eyebrow">YOUR COLLECTION</p>
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <p className="product-category">{item.category}</p>
                <h3>{item.name}</h3>
                <p>₱{item.price.toLocaleString()} each</p>

                <div className="quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>

              <div className="cart-item-right">
                <strong>
                  ₱{(item.price * item.quantity).toLocaleString()}
                </strong>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button className="continue-button" onClick={() => navigate('/')}>
            ← Continue Shopping
          </button>
        </div>

        <div className="summary">
          <p className="eyebrow">ORDER SUMMARY</p>
          <h2>Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₱{cartTotal.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>FREE</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₱{cartTotal.toLocaleString()}</strong>
          </div>

          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  )
}

function CheckoutPage({ cart, cartTotal, placeOrder }) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    payment: 'Cash on Delivery'
  })

  const [errors, setErrors] = useState({})
  const [successOrder, setSuccessOrder] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))

    setErrors((current) => ({
      ...current,
      [name]: ''
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required.'
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your complete name.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    const cleanPhone = form.phone.replace(/[\s-]/g, '')

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.'
    } else if (!/^(09\d{9}|\+639\d{9})$/.test(cleanPhone)) {
      newErrors.phone =
        'Enter a valid Philippine mobile number, e.g. 09171234567.'
    }

    if (!form.address.trim()) {
      newErrors.address = 'Delivery address is required.'
    } else if (form.address.trim().length < 10) {
      newErrors.address = 'Please enter your complete delivery address.'
    }

    return newErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const orderId = placeOrder(form)
    setSuccessOrder(orderId)
  }

  if (successOrder) {
    return (
      <section className="success-page">
        <div className="success-icon">✓</div>
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h1>Thank you for your order!</h1>
        <p>
          Your SeoulPop order has been successfully placed.
        </p>

        <div className="order-number">
          Order Number
          <strong>{successOrder}</strong>
        </div>

        <p className="success-note">
          Payment method: Cash on Delivery
        </p>

        <button className="primary-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="empty-cart">
        <div className="empty-icon">♡</div>
        <p className="eyebrow">CHECKOUT</p>
        <h1>No items to checkout</h1>
        <p>Add products to your cart before proceeding.</p>
        <Link to="/" className="primary-button">
          Shop Now
        </Link>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="page-title">
        <p className="eyebrow">ALMOST THERE</p>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Customer Information</h2>
            <p>Enter your details for delivery.</p>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && (
                <small className="error-message">{errors.fullName}</small>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <small className="error-message">{errors.email}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="09171234567"
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && (
                  <small className="error-message">{errors.phone}</small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House number, street, barangay, city, province"
                rows="4"
                className={errors.address ? 'input-error' : ''}
              />
              {errors.address && (
                <small className="error-message">{errors.address}</small>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={form.payment === 'Cash on Delivery'}
                onChange={handleChange}
              />

              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives.</small>
              </span>
            </label>
          </div>

          <button type="submit" className="checkout-button submit">
            Place Order
          </button>
        </form>

        <div className="checkout-summary">
          <p className="eyebrow">YOUR ORDER</p>
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div className="mini-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.quantity} × ₱{item.price.toLocaleString()}
                </span>
              </div>

              <strong>
                ₱{(item.price * item.quantity).toLocaleString()}
              </strong>
            </div>
          ))}

          <div className="summary-total checkout-total">
            <span>Total</span>
            <strong>₱{cartTotal.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App