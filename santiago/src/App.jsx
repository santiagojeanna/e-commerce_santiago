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
      "IVE's EMPATHY album featuring official album inclusions and collectible photocards.",
  },
  {
    id: 2,
    name: "Stray Kids - ATE Album",
    price: 1399,
    category: "Albums",
    stock: 12,
    image: strayKidsImage,
    description:
      "Official Stray Kids ATE album with collectible inclusions for STAY fans.",
  },
  {
    id: 3,
    name: "BLACKPINK Official Lightstick",
    price: 2499,
    category: "Lightsticks",
    stock: 8,
    image: blackpinkImage,
    description:
      "Official BLACKPINK lightstick designed for concerts, collections, and BLINKs.",
  },
  {
    id: 4,
    name: "BTS Army Bomb",
    price: 2799,
    category: "Lightsticks",
    stock: 7,
    image: btsImage,
    description:
      "Official BTS Army Bomb lightstick for concerts and ARMY collections.",
  },
  {
    id: 5,
    name: "TWICE Ready To Be Hoodie",
    price: 1899,
    category: "Merchandise",
    stock: 10,
    image: twiceImage,
    description:
      "Comfortable TWICE Ready To Be hoodie made for ONCE fans and everyday wear.",
  },
  {
    id: 6,
    name: "ENHYPEN Logo T-Shirt",
    price: 999,
    category: "Merchandise",
    stock: 20,
    image: enhypenImage,
    description:
      "Official-style ENHYPEN logo shirt perfect for casual outfits and ENGENEs.",
  },
  {
    id: 7,
    name: "SEVENTEEN Carat Keychain",
    price: 499,
    category: "Accessories",
    stock: 25,
    image: seventeenImage,
    description:
      "Cute SEVENTEEN Carat keychain accessory for bags, keys, and collections.",
  },
  {
    id: 8,
    name: "NewJeans Bunny Phone Charm",
    price: 599,
    category: "Accessories",
    stock: 18,
    image: newjeansImage,
    description:
      "NewJeans-inspired bunny phone charm for adding a K-pop touch to your phone.",
  },
  {
    id: 9,
    name: "aespa Armageddon Album",
    price: 1499,
    category: "Albums",
    stock: 11,
    image: aespaImage,
    description:
      "aespa Armageddon album featuring official album inclusions and collectibles.",
  },
  {
    id: 10,
    name: "LE SSERAFIM Cap",
    price: 899,
    category: "Merchandise",
    stock: 14,
    image: lesserafimImage,
    description:
      "Stylish LE SSERAFIM cap designed for everyday outfits and FEARNOT fans.",
  },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const addToCart = (product) => {
    if (product.stock <= 0) {
      return;
    }

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
    (total, item) => total + item.price * item.quantity,
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

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

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
      message: "Account created successfully.",
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
        message: "Invalid email or password.",
      };
    }

    setCurrentUser(account);

    return {
      success: true,
      message: "Login successful.",
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

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const cartItem = cart.find(
          (item) => item.id === product.id
        );

        if (!cartItem) {
          return product;
        }

        return {
          ...product,
          stock:
            product.stock - cartItem.quantity,
        };
      })
    );

    setCart([]);

    return orderId;
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        cartCount={cartCount}
        logoutAccount={logoutAccount}
      />

      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <HomePage
                products={currentProducts}
                search={search}
                setSearch={handleSearchChange}
                category={category}
                setCategory={handleCategoryChange}
                addToCart={addToCart}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
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
              <Navigate to="/login" replace />
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
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
              />
            ) : (
              <Navigate to="/login" replace />
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
              <Navigate to="/login" replace />
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
                registerAccount={registerAccount}
              />
            )
          }
        />
      </Routes>
    </>
  );
}

function Header({
  currentUser,
  cartCount,
  logoutAccount,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAccount();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          SeoulPop
        </Link>

        <nav className="main-nav">
          {currentUser ? (
            <>
              <NavLink to="/">Home</NavLink>

              <NavLink to="/cart">
                Cart ({cartCount})
              </NavLink>

              <NavLink to="/checkout">
                Checkout
              </NavLink>

              <span className="welcome-user">
                Hi, {currentUser.fullName}
              </span>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                Login
              </NavLink>

              <NavLink to="/register">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function WelcomePage() {
  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <p className="eyebrow">K-POP COLLECTION</p>

        <h1>Welcome to SeoulPop</h1>

        <p>
          Discover albums, lightsticks, merchandise,
          and accessories from your favorite K-pop
          artists.
        </p>

        <div className="welcome-actions">
          <Link
            to="/register"
            className="primary-button"
          >
            Create Account
          </Link>

          <Link
            to="/login"
            className="secondary-button"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}

function HomePage({
  products,
  search,
  setSearch,
  category,
  setCategory,
  addToCart,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const categories = [
    "All",
    "Albums",
    "Lightsticks",
    "Merchandise",
    "Accessories",
  ];

  return (
    <main className="home-page">
      <section className="hero-section">
        <div>
          <p className="eyebrow">SEOULPOP STORE</p>

          <h1>
            Your K-pop collection starts here.
          </h1>

          <p>
            Shop albums, official-style merchandise,
            accessories, and lightsticks.
          </p>
        </div>
      </section>

      <section className="shop-section">
        <div className="shop-header">
          <div>
            <p className="eyebrow">SHOP</p>
            <h2>Featured Collection</h2>
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-input"
          />
        </div>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category-button active"
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

        {products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1
                    )
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => (
                    <button
                      key={index + 1}
                      className={
                        currentPage ===
                          index + 1
                          ? "active-page"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(
                          index + 1
                        )
                      }
                    >
                      {index + 1}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-products">
            <h3>No products found</h3>

            <p>
              Try another search term or category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function ProductCard({
  product,
  addToCart,
}) {
  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-image-link"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="product-bottom">
          <strong>
            ₱{product.price.toLocaleString()}
          </strong>

          <button
            onClick={() =>
              addToCart(product)
            }
            disabled={product.stock === 0}
            className="add-button"
          >
            {product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
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

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="simple-page">
        <h2>Product not found</h2>

        <Link to="/">
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <Link
        to="/"
        className="back-link"
      >
        ← Back to Shop
      </Link>

      <section className="product-details">
        <div className="details-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="details-image"
          />
        </div>

        <div className="details-content">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="details-price">
            ₱{product.price.toLocaleString()}
          </p>

          <p className="details-description">
            {product.description}
          </p>

          <p className="stock-text">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          <button
            className="primary-button"
            onClick={() =>
              addToCart(product)
            }
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          <Link
            to="/cart"
            className="secondary-button details-cart-button"
          >
            View Cart
          </Link>
        </div>
      </section>
    </main>
  );
}

function CartPage({
  cart,
  cartTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  if (cart.length === 0) {
    return (
      <main className="simple-page">
        <p className="eyebrow">YOUR CART</p>

        <h1>Your cart is empty.</h1>

        <p>
          Add some K-pop items to continue.
        </p>

        <Link
          to="/"
          className="primary-button"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR CART</p>

        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <span className="product-category">
                  {item.category}
                </span>

                <h3>{item.name}</h3>

                <p>
                  ₱
                  {item.price.toLocaleString()}
                </p>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    decreaseQuantity(
                      item.id
                    )
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseQuantity(
                      item.id
                    )
                  }
                >
                  +
                </button>
              </div>

              <strong className="cart-item-total">
                ₱
                {(
                  item.price *
                  item.quantity
                ).toLocaleString()}
              </strong>

              <button
                className="remove-button"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <p className="eyebrow">SUMMARY</p>

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>

            <span>
              {cart.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </span>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>

            <strong>
              ₱{cartTotal.toLocaleString()}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="primary-button full-button"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}

function CheckoutPage({
  cart,
  cartTotal,
  currentUser,
  placeOrder,
}) {
  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: "",
    address: "",
    payment: "Cash on Delivery",
  });

  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^09\d{9}$/.test(form.phone) &&
      !/^\+639\d{9}$/.test(form.phone)
    ) {
      newErrors.phone =
        "Enter a valid Philippine phone number.";
    }

    if (!form.address.trim()) {
      newErrors.address =
        "Delivery address is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newOrderId =
      placeOrder(form);

    setOrderId(newOrderId);
  };

  if (orderId) {
    return (
      <main className="confirmation-page">
        <section className="confirmation-card">
          <div className="success-icon">
            ✓
          </div>

          <p className="eyebrow">
            ORDER CONFIRMED
          </p>

          <h1>
            Thank you for your order!
          </h1>

          <p>
            Your SeoulPop order has been
            successfully placed.
          </p>

          <div className="order-number">
            Order ID:{" "}
            <strong>{orderId}</strong>
          </div>

          <p className="confirmation-note">
            Your order will be processed using
            Cash on Delivery.
          </p>

          <Link
            to="/"
            className="primary-button"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="simple-page">
        <h1>Your cart is empty.</h1>

        <p>
          Add products before proceeding to
          checkout.
        </p>

        <Link
          to="/"
          className="primary-button"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="page-heading">
        <p className="eyebrow">CHECKOUT</p>

        <h1>Complete Your Order</h1>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <h2>Delivery Information</h2>

          <FormInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormInput
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="09XXXXXXXXX"
            error={errors.phone}
          />

          <FormInput
            label="Delivery Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
          />

          <div className="form-group">
            <label>
              Payment Method
            </label>

            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              <option value="Cash on Delivery">
                Cash on Delivery
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button full-button"
          >
            Place Order
          </button>
        </form>

        <aside className="checkout-summary">
          <p className="eyebrow">
            ORDER SUMMARY
          </p>

          <h2>Your Items</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >
              <div>
                <strong>
                  {item.name}
                </strong>

                <span>
                  Qty: {item.quantity}
                </span>
              </div>

              <strong>
                ₱
                {(
                  item.price *
                  item.quantity
                ).toLocaleString()}
              </strong>
            </div>
          ))}

          <div className="summary-row total-row">
            <span>Total</span>

            <strong>
              ₱
              {cartTotal.toLocaleString()}
            </strong>
          </div>
        </aside>
      </div>
    </main>
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
      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <small className="error-text">
          {error}
        </small>
      )}
    </div>
  );
}

function LoginPage({
  loginAccount,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
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
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">
          WELCOME BACK
        </p>

        <h1>Login</h1>

        <p>
          Sign in to continue shopping at
          SeoulPop.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button full-button"
          >
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(
        "Please complete all fields."
      );

      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    const result =
      registerAccount({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

    if (!result.success) {
      setError(result.message);

      return;
    }

    navigate("/login");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">
          SEOULPOP ACCOUNT
        </p>

        <h1>Create Account</h1>

        <p>
          Register first before you start
          shopping.
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button full-button"
          >
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default App;