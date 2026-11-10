import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "./hooks/useCart";
import { useFavorites } from "./hooks/useFavorites";
import { Routes, Route,Navigate , useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSideBar";
import WishlistSidebar from "./components/WishlistSideBar";
import ProductSkeletonGrid from "./components/ProductSkeletonGrid";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import { CompareProvider } from "./context/CompareContext";
import ConfirmModal from "./components/ConfirmModal";
import AdvancedProductFilters, {
  DEFAULT_ADVANCED_FILTERS,
  type AdvancedFilters,
} from "./components/AdvancedProductFilters";
import {
  getProducts,
  getCategories,
  addProductToCart,
  updateCartQuantity,
  removeProductFromCart,
  addToFavorites,
  removeFromFavorites,
  checkout,
} from "./services/api";

import { isAuthenticated, logout } from "./services/auth";
import type { Product } from "./types/product";
import type { CartItem } from "./types/cart";
import Toast from "./components/Toast";
import type { ToastData, ToastType } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
// LAZY LOADED PAGES
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const CompareProducts = lazy(() => import("./pages/CompareProducts"));
const NotFound = lazy(() => import("./pages/NotFound"));
type HomePageProps = {
  isLoggedIn: boolean;
  onLogout: () => void;
};
function HomePage({ isLoggedIn, onLogout }: HomePageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmClear, setConfirmClear] = useState<"cart" | "wishlist" | null>(
    null,
  );
  // REACT QUERY - PRODUCTS
  const {
    data: products = [],
    isPending: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  // REACT QUERY - CATEGORIES
  const {
    data: categories = [],
    isPending: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const loading = productsLoading || categoriesLoading;
  const queryError = productsError ?? categoriesError;
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? "Failed to load store data."
        : "";
  // CART - REACT QUERY
  const {
    data: cartResponse,
    isPending: cartPending,
    error: cartQueryError,
  } = useCart(isLoggedIn);
  const cartItems = useMemo(
    () => cartResponse?.data.items ?? [],
    [cartResponse],
  );
  const cartLoading = isLoggedIn && cartPending;
  const cartLoadError =
    cartQueryError instanceof Error
      ? cartQueryError.message
      : cartQueryError
        ? "Failed to load cart."
        : "";
  // WISHLIST - REACT QUERY
  const {
    data: favorites = [],
    isPending: favoritesPending,
    error: favoritesQueryError,
  } = useFavorites(isLoggedIn);
  const wishlistLoading = isLoggedIn && favoritesPending;
  const wishlistLoadError =
    favoritesQueryError instanceof Error
      ? favoritesQueryError.message
      : favoritesQueryError
        ? "Failed to load wishlist."
        : "";
  // SEARCH AND FILTERS
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    ...DEFAULT_ADVANCED_FILTERS,
  });
  // CART STATE
  const [cartOpen, setCartOpen] = useState(false);
  const [cartError, setCartError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [clearingWishlist, setClearingWishlist] = useState(false);
  // WISHLIST STATE
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<number | null>(
    null,
  );
  // CHECKOUT
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const cartBusy = useRef(false);
  const favoriteBusy = useRef(false);
  const checkoutBusy = useRef(false);
  // PAGINATION
  const [visibleCount, setVisibleCount] = useState(12);
  // TOAST
  const [toast, setToast] = useState<ToastData | null>(null);
  const closeToast = useCallback(() => {
    setToast(null);
  }, []);
  const showToast = useCallback(
    (type: ToastType, title: string, message: string) => {
      setToast({
        id: Date.now(),
        type,
        title,
        message,
      });
    },
    [],
  );
  // RESET LOCAL UI STATE AFTER LOGOUT
  useEffect(() => {
    if (!isLoggedIn) {
      setCartOpen(false);
      setWishlistOpen(false);
      setCartError("");
      setWishlistError("");
      setCheckoutSuccess("");
    }
  }, [isLoggedIn]);
  // CART MUTATIONS
  const addCartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => addProductToCart(productId, quantity),

    networkMode: "always",
    retry: false,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const { mutateAsync: addCartAsync } = addCartMutation;

  const quantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartQuantity(itemId, quantity),

    networkMode: "always",
    retry: false,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: (productId: number) => removeProductFromCart(productId),

    networkMode: "always",
    retry: false,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const checkoutMutation = useMutation({
    mutationFn: checkout,

    networkMode: "always",
    retry: false,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["product"] }),
      ]);
    },
  });
  // WISHLIST MUTATION

  const favoriteMutation = useMutation({
    mutationFn: async ({
      productId,
      remove,
    }: {
      productId: number;
      remove: boolean;
    }) => {
      if (remove) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    },

    networkMode: "always",
    retry: false,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const { mutateAsync: toggleFavoriteAsync } = favoriteMutation;

  async function clearCart() {
    if (
      cartBusy.current ||
      checkoutBusy.current ||
      clearingCart ||
      !cartItems.length
    )
      return;
    cartBusy.current = true;
    setClearingCart(true);
    setCartError("");
    setCheckoutSuccess("");
    try {
      const results = await Promise.allSettled(
        cartItems.map((item) => removeProductFromCart(item.id)),
      );
      const failed = results.filter(
        (result) => result.status === "rejected",
      ).length;
      if (failed) {
        setCartError(
          `${failed} product(s) could not be removed. Please try again.`,
        );
        showToast(
          "error",
          "Clear Cart Incomplete",
          `${failed} product(s) could not be removed.`,
        );
      } else {
        showToast(
          "success",
          "Cart Cleared",
          "All products were removed from your cart.",
        );
      }
    } finally {
      try {
        await queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      } catch {
        setCartError(
          "Cart changed, but refreshing it failed. Please reload the page.",
        );
      }
      setClearingCart(false);
      cartBusy.current = false;
    }
  }
  async function clearWishlist() {
    if (favoriteBusy.current || clearingWishlist || !favorites.length) return;
    favoriteBusy.current = true;
    setClearingWishlist(true);
    setWishlistError("");
    try {
      const results = await Promise.allSettled(
        favorites.map((product) => removeFromFavorites(product.id)),
      );
      const failed = results.filter(
        (result) => result.status === "rejected",
      ).length;
      if (failed) {
        setWishlistError(
          `${failed} product(s) could not be removed. Please try again.`,
        );
        showToast(
          "error",
          "Clear Wishlist Incomplete",
          `${failed} product(s) could not be removed.`,
        );
      } else {
        showToast(
          "success",
          "Wishlist Cleared",
          "All products were removed from your wishlist.",
        );
      }
    } finally {
      try {
        await queryClient.invalidateQueries({
          queryKey: ["favorites"],
        });
      } catch {
        setWishlistError(
          "Wishlist changed, but refreshing it failed. Please reload the page.",
        );
      }
      setClearingWishlist(false);
      favoriteBusy.current = false;
    }
  }
  // OPEN CART
  function openCart() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setWishlistOpen(false);
    setCartOpen(true);
  }
  // OPEN WISHLIST
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
  const addToCart = useCallback(
    async (product: Product) => {
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
        await addCartAsync({
          productId: product.id,
          quantity: 1,
        });
        showToast(
          "success",
          "Added to Cart!",
          `${product.name} was added to your cart.`,
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add product to cart.";
        setCartError(errorMessage);
        showToast("error", "Cart Error", errorMessage);
        setWishlistOpen(false);
        setCartOpen(true);
      } finally {
        setUpdatingId(null);
        setAddingToCartId(null);
        cartBusy.current = false;
      }
    },
    [isLoggedIn, navigate, cartItems, addCartMutation],
  );
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
      await quantityMutation.mutateAsync({ itemId: item.id, quantity });
      showToast(
        "success",
        "Cart Updated",
        "Product quantity updated successfully.",
      );
    } catch (err) {
      const errorMessage =
        err instanceof TypeError
          ? "Network error. Please check your internet connection and try again."
          : err instanceof Error
            ? err.message
            : "Failed to update quantity.";

      setCartError(errorMessage);
    } finally {
      setUpdatingId(null);
      cartBusy.current = false;
    }
  }
  // REMOVE FROM CART
  async function removeFromCart(itemId: number) {
    if (cartBusy.current || checkoutBusy.current) return;
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) return;
    cartBusy.current = true;
    setUpdatingId(itemId);
    setCartError("");
    setCheckoutSuccess("");
    try {
      await removeCartMutation.mutateAsync(itemId);
      showToast(
        "success",
        "Product Removed",
        "Product was removed from your cart.",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to remove product from cart.";
      setCartError(errorMessage);
      showToast("error", "Cart Error", errorMessage);
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
      const result = await checkoutMutation.mutateAsync();
      showToast(
        "success",
        "Checkout Successful!",
        `${result.itemCount} items checked out successfully.`,
      );
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

  const toggleFavorite = useCallback(
    async (product: Product) => {
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
        await toggleFavoriteAsync({
          productId: product.id,
          remove: alreadyFavorite,
        });

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
        showToast("error", "Wishlist Error", errorMessage);
        setCartOpen(false);
        setWishlistOpen(true);
      } finally {
        setUpdatingFavoriteId(null);
        favoriteBusy.current = false;
      }
    },
    [isLoggedIn, navigate, favorites, toggleFavoriteAsync, showToast],
  );

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
  // VISIBLE PRODUCTS
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
  // HEADER COUNTERS
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteIds = useMemo(
    () => favorites.map((product) => product.id),
    [favorites],
  );
  return (
    <div className="min-h-screen w-full min-w-0 bg-[#090d16] text-white">
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

      <main className="w-full min-w-0">
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
          <div id="products" className="scroll-mt-24">
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
        error={cartError || cartLoadError}
        updatingId={updatingId}
        onIncrease={(item) => changeQuantity(item, item.quantity + 1)}
        onDecrease={(item) => changeQuantity(item, item.quantity - 1)}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        checkoutSuccess={checkoutSuccess}
        onClearAll={() => setConfirmClear("cart")}
        clearingAll={clearingCart}
      />
      <WishlistSidebar
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        products={favorites}
        loading={wishlistLoading}
        error={wishlistError || wishlistLoadError}
        updatingFavoriteId={updatingFavoriteId}
        addingToCartId={addingToCartId}
        onRemove={toggleFavorite}
        onAddToCart={addToCart}
        onClearAll={() => setConfirmClear("wishlist")}
        clearingAll={clearingWishlist}
      />
      <ConfirmModal
        isOpen={confirmClear !== null}
        loading={clearingCart || clearingWishlist}
        onClose={() => setConfirmClear(null)}
        onConfirm={() => {
          if (clearingCart || clearingWishlist) return;
          if (confirmClear === "cart") {
            void clearCart().finally(() => {
              setConfirmClear(null);
            });
          } else if (confirmClear === "wishlist") {
            void clearWishlist().finally(() => {
              setConfirmClear(null);
            });
          }
        }}
        title={
          confirmClear === "cart" ? "Clear Shopping Cart?" : "Clear Wishlist?"
        }
        message={
          confirmClear === "cart"
            ? `Are you sure you want to remove all ${cartItems.length} cart products? This action cannot be undone.`
            : `Are you sure you want to remove all ${favorites.length} favorite products? This action cannot be undone.`
        }
        confirmText="Yes, Clear All"
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
// ROUTE LOADING
function RouteLoading() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 text-white"
    >
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />
        Loading page...
      </div>
    </div>
  );
}
// MAIN APP
export default function App() {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const handleLogin = useCallback(() => {
    // Clear data cached under the previous session.
    queryClient.clear();
    setIsLoggedIn(true);
  }, [queryClient]);
  const handleLogout = useCallback(() => {
    logout();
    setIsLoggedIn(false);
    // Clear all cached queries and mutations, including private user data.
    queryClient.clear();
  }, [queryClient]);
  useEffect(() => {
    function handleUnauthorized() {
      handleLogout();
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [handleLogout]);
  return (
    <CompareProvider>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            }
          />
          {/* ADMIN AUTH */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/register"
            element={<Navigate to="/admin/login" replace />}
          />
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
          {/* PROTECTED USER ROUTES */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route
              path="/profile"
              element={<Profile onLogout={handleLogout} />}
            />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
          {/* PASSWORD RECOVERY */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* NOT FOUND */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </CompareProvider>
  );
}
