import { useEffect, useMemo, useRef, useState } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/Header";

import Hero from "./components/Hero";

import Categories from "./components/Categories";

import ProductGrid from "./components/ProductGrid";

import Footer from "./components/Footer";

import CartSidebar from "./components/CartSideBar";

import WishlistSidebar from "./components/WishlistSideBar";

import ProductSkeletonGrid from "./components/ProductSkeletonGrid";

import Login from "./pages/Login";

import Register from "./pages/Register";

import VerifyEmail from "./pages/VerifyEmail";

import Profile from "./pages/Profile";

import ChangePassword from "./pages/ChangePassword";

import ForgotPassword from "./pages/ForgotPassword";

import ResetPassword from "./pages/ResetPassword";

import ProductDetails from "./pages/ProductDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminCategories from "./pages/admin/AdminCategories";

import AdminProducts from "./pages/admin/AdminProducts";

import AdminLogin from "./pages/admin/AdminLogin";

import AdminRegister from "./pages/admin/AdminRegister";

import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

import AdminInventory from "./pages/admin/AdminInventory";

import CompareProducts from "./pages/CompareProducts";

import { CompareProvider } from "./context/CompareContext";
import AdvancedProductFilters, {
  DEFAULT_ADVANCED_FILTERS,
  type AdvancedFilters,
} from "./components/AdvancedProductFilters";

import {
  getProducts,
  getCategories,
  getCart,
  addProductToCart,
  updateCartQuantity,
  removeProductFromCart,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkout,
} from "./services/api";

import { isAuthenticated, logout } from "./services/auth";

import type { Product } from "./types/product";

import type { Category } from "./types/category";

import type { CartItem } from "./types/cart";

import { useCallback } from "react";

import Toast from "./components/Toast";

import type { ToastData, ToastType } from "./components/Toast";

type HomePageProps = {
  isLoggedIn: boolean;

  onLogout: () => void;
};

function HomePage({ isLoggedIn, onLogout }: HomePageProps) {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [favorites, setFavorites] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    ...DEFAULT_ADVANCED_FILTERS,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cartOpen, setCartOpen] = useState(false);

  const [cartLoading, setCartLoading] = useState(false);

  const [cartError, setCartError] = useState("");

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  const [wishlistOpen, setWishlistOpen] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [wishlistError, setWishlistError] = useState("");

  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<number | null>(
    null,
  );

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [checkoutSuccess, setCheckoutSuccess] = useState("");

  const cartBusy = useRef(false);

  const favoriteBusy = useRef(false);

  const checkoutBusy = useRef(false);

  const [visibleCount, setVisibleCount] = useState(12);

  const [toast, setToast] = useState<ToastData | null>(null);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  function showToast(type: ToastType, title: string, message: string) {
    setToast({
      id: Date.now(),

      type,

      title,

      message,
    });
  }

  // LOAD PRODUCTS AND CATEGORIES

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        setError("");

        const [productsData, categoriesData] = await Promise.all([
          getProducts(),

          getCategories(),
        ]);

        if (cancelled) return;

        setProducts(productsData);

        setCategories(categoriesData);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Failed to load store data.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // LOAD CART AND FAVORITES AFTER LOGIN

  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);

      setFavorites([]);

      setCartOpen(false);

      setWishlistOpen(false);

      setCartError("");

      setWishlistError("");

      setCheckoutSuccess("");

      return;
    }

    let cancelled = false;

    async function loadUserData() {
      setCartLoading(true);

      setWishlistLoading(true);

      const [cartResult, favoritesResult] = await Promise.allSettled([
        getCart(),

        getFavorites(),
      ]);

      if (cancelled) return;

      if (cartResult.status === "fulfilled") {
        setCartItems(cartResult.value.data.items);

        setCartError("");
      } else {
        setCartError(
          cartResult.reason instanceof Error
            ? cartResult.reason.message
            : "Failed to load cart.",
        );
      }

      if (favoritesResult.status === "fulfilled") {
        setFavorites(favoritesResult.value);

        setWishlistError("");
      } else {
        setWishlistError(
          favoritesResult.reason instanceof Error
            ? favoritesResult.reason.message
            : "Failed to load wishlist.",
        );
      }

      setCartLoading(false);

      setWishlistLoading(false);
    }

    loadUserData();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  async function refreshCart() {
    const result = await getCart();

    setCartItems(result.data.items);
  }

  async function refreshFavorites() {
    const result = await getFavorites();

    setFavorites(result);
  }

  function openCart() {
    if (!isLoggedIn) {
      navigate("/login");

      return;
    }

    setWishlistOpen(false);

    setCartOpen(true);
  }

  function openWishlist() {
    if (!isLoggedIn) {
      navigate("/login");

      return;
    }

    setCartOpen(false);

    setWishlistOpen(true);
  }

  // VIEW ALL PRODUCTS

  function handleViewAllProducts() {
    setSelectedCategory("All");

    setSearchQuery("");

    requestAnimationFrame(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",

        block: "start",
      });
    });
  }

  // ADD TO CART

  async function addToCart(product: Product) {
    if (!isLoggedIn) {
      navigate("/login");

      return;
    }

    if (product.stock <= 0 || cartBusy.current || checkoutBusy.current) {
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem && existingItem.quantity >= product.stock) {
      showToast(
        "info",

        "Stock Limit Reached",

        "You cannot add more than the available stock.",
      );

      return;
    }

    cartBusy.current = true;

    setUpdatingId(existingItem?.id ?? -1);

    setAddingToCartId(product.id);

    setCartError("");

    setCheckoutSuccess("");

    try {
      await addProductToCart(product.id, 1);

      await refreshCart();

      // SUCCESS TOAST

      showToast(
        "success",

        "Added to Cart!",

        `${product.name} was added to your cart.`,
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add product to cart.";

      setCartError(errorMessage);

      // ERROR TOAST

      showToast("error", "Cart Error", errorMessage);

      setWishlistOpen(false);

      setCartOpen(true);
    } finally {
      setUpdatingId(null);

      setAddingToCartId(null);

      cartBusy.current = false;
    }
  }

  // CHANGE CART QUANTITY

  async function changeQuantity(item: CartItem, quantity: number) {
    if (cartBusy.current || checkoutBusy.current) return;

    if (quantity < 1 || quantity > item.product.stock) {
      return;
    }

    cartBusy.current = true;

    setUpdatingId(item.id);

    setCartError("");

    setCheckoutSuccess("");

    try {
      await updateCartQuantity(item.id, quantity);

      showToast(
        "success",

        "Cart Updated",

        "Product quantity updated successfully.",
      );

      await refreshCart();
    } catch (err) {
      setCartError(
        err instanceof Error ? err.message : "Failed to update quantity.",
      );
    } finally {
      setUpdatingId(null);

      cartBusy.current = false;
    }
  }

  // REMOVE FROM CART

  async function removeFromCart(productId: number) {
    if (cartBusy.current || checkoutBusy.current) return;

    const item = cartItems.find(
      (cartItem) => cartItem.product.id === productId,
    );

    cartBusy.current = true;

    setUpdatingId(item?.id ?? -1);

    setCartError("");

    setCheckoutSuccess("");

    try {
      await removeProductFromCart(productId);

      showToast(
        "info",

        "Product Removed",

        "Product was removed from your cart.",
      );

      await refreshCart();
    } catch (err) {
      setCartError(
        err instanceof Error
          ? err.message
          : "Failed to remove product from cart.",
      );
    } finally {
      setUpdatingId(null);

      cartBusy.current = false;
    }
  }

  // CHECKOUT

  async function handleCheckout() {
    if (!isLoggedIn) {
      navigate("/login");

      return;
    }

    if (checkoutBusy.current || cartBusy.current || cartItems.length === 0) {
      return;
    }

    checkoutBusy.current = true;

    setCheckoutLoading(true);

    setCartError("");

    setCheckoutSuccess("");

    try {
      const result = await checkout();

      showToast(
        "success",

        "Checkout Successful!",

        `${result.itemCount} items checked out successfully.`,
      );

      try {
        await refreshCart();
      } catch {
        setCartError(
          "Checkout succeeded, but the cart could not be refreshed.",
        );
      }
    } catch (err) {
      setCartError(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setCheckoutLoading(false);

      checkoutBusy.current = false;
    }
  }

  // TOGGLE FAVORITE

  async function toggleFavorite(product: Product) {
    if (!isLoggedIn) {
      navigate("/login");

      return;
    }

    if (favoriteBusy.current) return;

    const alreadyFavorite = favorites.some((item) => item.id === product.id);

    favoriteBusy.current = true;

    setUpdatingFavoriteId(product.id);

    setWishlistError("");

    try {
      if (alreadyFavorite) {
        // REMOVE FROM WISHLIST

        await removeFromFavorites(product.id);
      } else {
        // ADD TO WISHLIST

        await addToFavorites(product.id);
      }

      await refreshFavorites();

      if (alreadyFavorite) {
        showToast(
          "info",

          "Removed from Wishlist",

          `${product.name} was removed from your wishlist.`,
        );
      } else {
        showToast(
          "success",

          "Added to Wishlist!",

          `${product.name} was added to your wishlist.`,
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update wishlist.";

      setWishlistError(errorMessage);

      // ERROR TOAST

      showToast("error", "Wishlist Error", errorMessage);

      setCartOpen(false);

      setWishlistOpen(true);
    } finally {
      setUpdatingFavoriteId(null);

      favoriteBusy.current = false;
    }
  }

  // FILTER PRODUCTS

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const selected = categories.find(
      (category) => category.name === selectedCategory,
    );

    const minPrice =
      advancedFilters.minPrice.trim() === ""
        ? null
        : Number(advancedFilters.minPrice);

    const maxPrice =
      advancedFilters.maxPrice.trim() === ""
        ? null
        : Number(advancedFilters.maxPrice);

    const result = products.filter((product) => {
      // SEARCH

      const matchesSearch = [product.name, product.brand, product.model].some(
        (value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
      );

      // CATEGORY

      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.name?.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase() ||
        (selected !== undefined && product.category?.id === selected.id);

      // BRAND

      const matchesBrand =
        advancedFilters.brand === "All" ||
        product.brand === advancedFilters.brand;

      // PRICE

      const matchesMinPrice =
        minPrice === null ||
        (!Number.isNaN(minPrice) && product.price >= minPrice);

      const matchesMaxPrice =
        maxPrice === null ||
        (!Number.isNaN(maxPrice) && product.price <= maxPrice);

      // RATING

      const matchesRating = product.rating >= advancedFilters.minRating;

      // STOCK

      const matchesStock = !advancedFilters.inStockOnly || product.stock > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating &&
        matchesStock
      );
    });

    // SORTING

    switch (advancedFilters.sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);

      case "price-desc":
        return result.sort((a, b) => b.price - a.price);

      case "rating-desc":
        return result.sort((a, b) => b.rating - a.rating);

      case "name-asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));

      default:
        return result;
    }
  }, [products, categories, searchQuery, selectedCategory, advancedFilters]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMoreProducts = visibleCount < filteredProducts.length;

  function handleShowMore() {
    setVisibleCount((prev) => prev + 12);
  }

  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedCategory, advancedFilters]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const favoriteIds = favorites.map((product) => product.id);

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        cartCount={cartCount}
        onCartClick={openCart}
        wishlistCount={favorites.length}
        onWishlistClick={openWishlist}
      />

      <main>
        <Hero onViewAllProducts={handleViewAllProducts} />

        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {!loading && !error && (
          <AdvancedProductFilters
            products={products}
            filters={advancedFilters}
            onChange={setAdvancedFilters}
            resultCount={filteredProducts.length}
          />
        )}

        {loading ? (
          <ProductSkeletonGrid />
        ) : error ? (
          <p className="py-16 text-center text-red-400">{error}</p>
        ) : (
          <div id="products">
            <ProductGrid
              products={visibleProducts}
              onAddToCart={addToCart}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              updatingFavoriteId={updatingFavoriteId}
            />

            {filteredProducts.length > 0 && (
              <div className="flex flex-col items-center gap-4 px-4 pb-14 pt-6">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {visibleProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>

                {hasMoreProducts && (
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-10 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500 hover:text-white"
                  >
                    Show More ↓
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        loading={cartLoading}
        error={cartError}
        updatingId={updatingId}
        onIncrease={(item) => changeQuantity(item, item.quantity + 1)}
        onDecrease={(item) => changeQuantity(item, item.quantity - 1)}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        checkoutSuccess={checkoutSuccess}
      />

      <WishlistSidebar
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        products={favorites}
        loading={wishlistLoading}
        error={wishlistError}
        updatingFavoriteId={updatingFavoriteId}
        addingToCartId={addingToCartId}
        onRemove={toggleFavorite}
        onAddToCart={addToCart}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    logout();

    setIsLoggedIn(false);
  }

  return (
    <CompareProvider>
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />

        {/* ADMIN AUTH */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/register" element={<AdminRegister />} />

        {/* PROTECTED ADMIN ROUTES */}

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/products" element={<AdminProducts />} />

          <Route path="/admin/categories" element={<AdminCategories />} />

          <Route path="/admin/inventory" element={<AdminInventory />} />
        </Route>

        {/* STORE */}

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/compare" element={<CompareProducts />} />

        {/* AUTH */}

        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Profile onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/change-password"
          element={
            isLoggedIn ? <ChangePassword /> : <Navigate to="/login" replace />
          }
        />

        {/* PASSWORD RECOVERY */}

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* NOT FOUND */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CompareProvider>
  );
}
