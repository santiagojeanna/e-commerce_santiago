import { useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import iveImage from "./assets/empathyalbum.avif";
import strayKidsImage from "./assets/straykids.jpg";
import blackpinkImage from "./assets/black_lightsick.jpg";
import btsImage from "./assets/bts_lightstick.jpg";
import twiceImage from "./assets/twice_hoodie.jpg";
import enhypenImage from "./assets/enhypen_shirt.webp";
import seventeenImage from "./assets/seventeen_keychain.jpg";
import newjeansImage from "./assets/newjeans_phonecharm.webp";
import aespaImage from "./assets/aespa_album.jpg";
import lesserafimImage from "./assets/lesserafim_cap.png";

const initialProducts = [
  {
    id: 1,
    name: "IVE - EMPATHY Album",
    price: 1299,
    category: "Albums",
    stock: 15,
    image: iveImage,
    description:
      "IVE EMPATHY album featuring official packaging, photocards, CD, and exclusive album inclusions.",
  },
  {
    id: 2,
    name: "Stray Kids - ATE Album",
    price: 1399,
    category: "Albums",
    stock: 12,
    image: strayKidsImage,
    description:
      "Official Stray Kids ATE album package with collectible photocards, photobook, and official album inclusions.",
  },
  {
    id: 3,
    name: "BLACKPINK Official Lightstick",
    price: 2499,
    category: "Lightsticks",
    stock: 8,
    image: blackpinkImage,
    description:
      "Official BLACKPINK lightstick designed for concerts, fan events, and K-Pop collections.",
  },
  {
    id: 4,
    name: "BTS Army Bomb",
    price: 2799,
    category: "Lightsticks",
    stock: 7,
    image: btsImage,
    description:
      "Official BTS ARMY Bomb lightstick made for concerts and dedicated fan collections.",
  },
  {
    id: 5,
    name: "TWICE Ready To Be Hoodie",
    price: 1899,
    category: "Merchandise",
    stock: 10,
    image: twiceImage,
    description:
      "Comfortable TWICE Ready To Be hoodie with a stylish design for everyday wear.",
  },
  {
    id: 6,
    name: "ENHYPEN Logo T-Shirt",
    price: 999,
    category: "Merchandise",
    stock: 20,
    image: enhypenImage,
    description:
      "Casual ENHYPEN logo T-shirt designed for everyday use by K-Pop fans.",
  },
  {
    id: 7,
    name: "SEVENTEEN Carat Keychain",
    price: 499,
    category: "Accessories",
    stock: 25,
    image: seventeenImage,
    description:
      "SEVENTEEN-inspired Carat keychain perfect for bags, pouches, keys, and everyday accessories.",
  },
  {
    id: 8,
    name: "NewJeans Bunny Phone Charm",
    price: 599,
    category: "Accessories",
    stock: 18,
    image: newjeansImage,
    description:
      "Cute bunny-inspired phone charm that adds a fun K-Pop touch to your everyday phone.",
  },
  {
    id: 9,
    name: "aespa Armageddon Album",
    price: 1499,
    category: "Albums",
    stock: 11,
    image: aespaImage,
    description:
      "Official aespa Armageddon album featuring collectible packaging and album contents.",
  },
  {
    id: 10,
    name: "LE SSERAFIM Cap",
    price: 899,
    category: "Merchandise",
    stock: 14,
    image: lesserafimImage,
    description:
      "Stylish LE SSERAFIM-inspired cap designed for casual everyday outfits.",
  },
];

function App() {
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        const product = products.find(
          (product) => product.id === id
        );

        if (
          item.id === id &&
          product &&
          item.quantity < product.stock
        ) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const registerAccount = (account) => {
    const existingAccount = accounts.find(
      (item) =>
        item.email.toLowerCase() ===
        account.email.toLowerCase()
    );

    if (existingAccount) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    setAccounts((currentAccounts) => [
      ...currentAccounts,
      account,
    ]);

    return {
      success: true,
    };
  };

  const loginAccount = (email, password) => {
    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() ===
        email.toLowerCase() &&
        item.password === password
    );

    if (!account) {
      return {
        success: false,
        message: "Incorrect email or password.",
      };
    }

    setCurrentUser(account);

    return {
      success: true,
    };
  };

  const logoutAccount = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const placeOrder = (customer) => {
    const orderId = `SP-${Date.now()
      .toString()
      .slice(-6)}`;

    const newOrder = {
      id: orderId,
      customer,
      items: cart,
      total: cartTotal,
      date: new Date().toLocaleString(),
    };

    setOrders((currentOrders) => [
      ...currentOrders,
      newOrder,
    ]);

    setCart([]);

    return orderId;
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="brand">
            <span className="brand-star">✦</span>
            Seoul<span>Pop</span>
          </Link>

          {currentUser && (
            <nav className="nav-links">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Cart
                <span className="cart-count">
                  {cartCount}
                </span>
              </NavLink>

              <NavLink
                to="/checkout"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Checkout
              </NavLink>

              <span className="welcome-user">
                Hi,{" "}
                {currentUser.fullName.split(" ")[0]}
              </span>

              <button
                className="logout-button"
                onClick={logoutAccount}
              >
                Logout
              </button>
            </nav>
          )}

          {!currentUser && (
            <div className="guest-nav">
              <Link
                to="/login"
                className="login-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-button"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <HomePage
                  products={filteredProducts}
                  search={search}
                  setSearch={setSearch}
                  category={category}
                  setCategory={setCategory}
                  addToCart={addToCart}
                />
              ) : (
                <WelcomePage />
              )
            }
          />

          <Route
            path="/product/:id"
            element={
              currentUser ? (
                <ProductDetails
                  products={products}
                  addToCart={addToCart}
                />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/cart"
            element={
              currentUser ? (
                <CartPage
                  cart={cart}
                  cartTotal={cartTotal}
                  increaseQuantity={
                    increaseQuantity
                  }
                  decreaseQuantity={
                    decreaseQuantity
                  }
                  removeFromCart={
                    removeFromCart
                  }
                />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/checkout"
            element={
              currentUser ? (
                <CheckoutPage
                  cart={cart}
                  cartTotal={cartTotal}
                  currentUser={currentUser}
                  placeOrder={placeOrder}
                />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage
                  loginAccount={loginAccount}
                />
              )
            }
          />

          <Route
            path="/register"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterPage
                  registerAccount={
                    registerAccount
                  }
                />
              )
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <span>✦</span> SeoulPop
            </div>

            <p>
              Your little corner for K-Pop
              favorites.
            </p>
          </div>

          <p className="copyright">
            © 2026 SeoulPop
          </p>
        </div>
      </footer>
    </div>
  );
}

function WelcomePage() {
  return (
    <div className="welcome-page">
      <section className="welcome-hero">
        <div className="welcome-content">
          <p className="eyebrow">
            WELCOME TO SEOULPOP
          </p>

          <h1>
            Your K-Pop collection
            <span> starts here.</span>
          </h1>

          <p className="welcome-description">
            Create your SeoulPop account first to
            explore albums, lightsticks, apparel,
            and accessories from your favorite
            K-Pop artists.
          </p>

          <div className="welcome-actions">
            <Link
              to="/register"
              className="primary-button"
            >
              Create an Account
            </Link>

            <Link
              to="/login"
              className="secondary-dark-button"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>

        <div className="welcome-side">
          <div className="side-star">✦</div>

          <p>NEW DROP</p>

          <h3>
            K-POP
            <br />
            FAVORITES
          </h3>

          <span>
            ALBUMS · MERCH · MORE
          </span>
        </div>
      </section>

      <section className="welcome-info">
        <div>
          <span>01</span>
          <h3>CREATE</h3>
          <p>
            Register your SeoulPop account.
          </p>
        </div>

        <div>
          <span>02</span>
          <h3>EXPLORE</h3>
          <p>
            Browse your favorite K-Pop products.
          </p>
        </div>

        <div>
          <span>03</span>
          <h3>SHOP</h3>
          <p>
            Add items to your cart and checkout.
          </p>
        </div>
      </section>
    </div>
  );
}

function HomePage({
  products,
  search,
  setSearch,
  category,
  setCategory,
  addToCart,
}) {
  const categories = [
    "All",
    "Albums",
    "Lightsticks",
    "Merchandise",
    "Accessories",
  ];

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div>
          <p className="eyebrow">
            YOUR K-POP COLLECTION
          </p>

          <h1>
            Find your next
            <span> favorite.</span>
          </h1>

          <p>
            Official-inspired albums, lightsticks,
            merchandise, and accessories for
            K-Pop fans.
          </p>
        </div>

        <div className="shop-hero-mark">
          <span>SEOUL</span>
          <strong>POP</strong>
        </div>
      </section>

      <section className="products-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">
              OUR COLLECTION
            </p>

            <h2>Popular Picks</h2>
          </div>

          <span className="result-count">
            {products.length} products
          </span>
        </div>

        <div className="filter-area">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="category-buttons">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-button selected"
                    : "category-button"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No products found</h3>
            <p>
              Try another search or category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-image"
      >
        <img
          src={product.image}
          alt={product.name}
        />

        <span className="category-tag">
          {product.category}
        </span>
      </Link>

      <div className="product-info">
        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <p>{product.description}</p>

        <div className="product-footer">
          <strong>
            ₱{product.price.toLocaleString()}
          </strong>

          <button
            className="add-cart-button"
            onClick={() => addToCart(product)}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductDetails({
  products,
  addToCart,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="content-page">
        <div className="not-found">
          <h2>Product not found</h2>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to collection
      </button>

      <section className="details-card">
        <div className="details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="details-content">
          <p className="eyebrow">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-price">
            ₱{product.price.toLocaleString()}
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="stock-status">
            <span></span>
            {product.stock} items available
          </div>

          <button
            className="primary-button full-width"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>

          <Link
            to="/cart"
            className="outline-button full-width"
          >
            View Cart
          </Link>
        </div>
      </section>
    </div>
  );
}

function CartPage({
  cart,
  cartTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  return (
    <div className="content-page">
      <div className="page-title">
        <p className="eyebrow">
          YOUR SHOPPING BAG
        </p>

        <h1>Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-symbol">♡</div>

          <h2>Your cart is empty</h2>

          <p>
            Add something from the collection to
            get started.
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-details">
                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>

                  <span>{item.category}</span>

                  <strong>
                    ₱{item.price.toLocaleString()}
                  </strong>
                </div>

                <div className="quantity">
                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>
                </div>

                <strong className="item-total">
                  ₱
                  {(
                    item.price * item.quantity
                  ).toLocaleString()}
                </strong>

                <button
                  className="remove-item"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <aside className="order-summary">
            <h2>Order Summary</h2>

            <div>
              <span>Items</span>

              <span>
                {cart.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div>
              <span>Subtotal</span>

              <span>
                ₱{cartTotal.toLocaleString()}
              </span>
            </div>

            <div>
              <span>Delivery</span>

              <span>Free</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₱{cartTotal.toLocaleString()}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="primary-button full-width"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function CheckoutPage({
  cart,
  cartTotal,
  currentUser,
  placeOrder,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: "",
    address: "",
    payment: "Cash on Delivery",
  });

  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    const cleanPhone = form.phone.replace(
      /[\s-]/g,
      ""
    );

    if (!cleanPhone) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^(09\d{9}|\+639\d{9})$/.test(
        cleanPhone
      )
    ) {
      newErrors.phone =
        "Enter a valid Philippine phone number.";
    }

    if (!form.address.trim()) {
      newErrors.address =
        "Delivery address is required.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const newOrderId = placeOrder(form);
    setOrderId(newOrderId);
  };

  if (orderId) {
    return (
      <div className="content-page">
        <div className="success-state">
          <div className="success-symbol">
            ✓
          </div>

          <p className="eyebrow">
            ORDER CONFIRMED
          </p>

          <h1>Thank You!</h1>

          <p>
            Your SeoulPop order has been placed
            successfully.
          </p>

          <div className="order-number">
            <span>Order Number</span>

            <strong>{orderId}</strong>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="content-page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>

          <Link
            to="/"
            className="primary-button"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <div className="page-title">
        <p className="eyebrow">
          COMPLETE YOUR ORDER
        </p>

        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <h2>Delivery Information</h2>

            <FormInput
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.fullName}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
              error={errors.phone}
            />

            <div className="form-group">
              <label htmlFor="address">
                Delivery Address
              </label>

              <textarea
                id="address"
                name="address"
                rows="4"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
              />

              {errors.address && (
                <span className="error">
                  {errors.address}
                </span>
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
                checked={
                  form.payment ===
                  "Cash on Delivery"
                }
                onChange={handleChange}
              />

              <div>
                <strong>
                  Cash on Delivery
                </strong>

                <span>
                  Pay when your order arrives.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="primary-button full-width"
          >
            Place Order
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Your Order</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <strong>{item.name}</strong>

                <span>
                  Qty: {item.quantity}
                </span>
              </div>

              <strong>
                ₱
                {(
                  item.price * item.quantity
                ).toLocaleString()}
              </strong>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₱{cartTotal.toLocaleString()}
            </strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <span className="error">{error}</span>
      )}
    </div>
  );
}

function LoginPage({ loginAccount }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    const result = loginAccount(
      form.email,
      form.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>✦</span> SeoulPop
        </div>

        <p className="eyebrow">
          WELCOME BACK
        </p>

        <h1>Login</h1>

        <p className="auth-description">
          Sign in to access your SeoulPop
          collection.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button full-width"
          >
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({
  registerAccount,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password =
        "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const result = registerAccount({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    });

    if (!result.success) {
      setErrors({
        email: result.message,
      });
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <span>✦</span> SeoulPop
        </div>

        <p className="eyebrow">
          JOIN SEOULPOP
        </p>

        <h1>Create Account</h1>

        <p className="auth-description">
          Register first to explore our K-Pop
          collection.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.fullName}
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            error={errors.password}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            className="primary-button full-width"
          >
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default App;