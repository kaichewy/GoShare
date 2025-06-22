import { useReducer } from "react";
import { toast } from "react-toastify";

const initialState = {
  products: [],
  cart: [],
  cartTotal: 0,
  cartQuantity: 0,
  order: [],
};

const actions = Object.freeze({
  ADD_TO_CART: "ADD_TO_CART",
  GET_PRODUCTS: "GET_PRODUCTS",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  ADD_QUANTITY: "ADD_QUANTITY",
  REDUCE_QUANTITY: "REDUCE_QUANTITY",
});

const reducer = (state, action) => {
  if (action.type == actions.GET_PRODUCTS) {
    const backed_up_cart = action.backed_up_cart || [];

    const cartTotal = backed_up_cart.reduce((acc, item) => acc + item.price, 0);
    const cartQuantity = backed_up_cart.reduce((acc, item) => acc + item.quantity, 0);

    const updatedProducts = action.products.map((product) => {
      const cartItem = backed_up_cart.find((item) => item._id === product._id);
      return cartItem ? { ...cartItem, addedToCart: true } : product;
    });

    return {
      ...state,
      products: updatedProducts,
      cart: backed_up_cart,
      cartQuantity,
      cartTotal,
    };
  }

  if (action.type == actions.ADD_TO_CART) {
    const product = state.products.find((p) => p._id == action.product);
    product.addedToCart = true;
    product.quantity = 1;

    return {
      ...state,
      cart: [...state.cart, product],
      cartQuantity: state.cartQuantity + 1,
      cartTotal: state.cartTotal + product.price,
    };
  }

  if (action.type == actions.REMOVE_FROM_CART) {
    const product = state.products.find((p) => p._id == action.product);
    const newCart = state.cart.filter((p) => p._id != action.product);
    const updatedProduct = { ...product, addedToCart: false };

    const newCartTotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
      ...state,
      products: state.products.map((p) =>
        p._id === product._id ? updatedProduct : p
      ),
      cart: newCart,
      cartQuantity: state.cartQuantity - 1,
      cartTotal: newCartTotal,
    };
  }

  if (action.type == actions.ADD_QUANTITY) {
    const product = state.cart.find((p) => p._id == action.product);
    product.quantity += 1;

    return {
      ...state,
      cartTotal: state.cartTotal + product.price,
    };
  }

  if (action.type == actions.REDUCE_QUANTITY) {
    const product = state.cart.find((p) => p._id == action.product);
    if (product.quantity === 1) return state;
    product.quantity -= 1;

    return {
      ...state,
      cartTotal: state.cartTotal - product.price,
    };
  }

  if (action.type == actions.CLEAR_CART) {
    return {
      ...state,
      cart: [],
      order: [],
      cartTotal: 0,
      cartQuantity: 0,
    };
  }

  return state;
};

const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = (product) => dispatch({ type: actions.ADD_TO_CART, product });

  const removeFromCart = (product) => dispatch({ type: actions.REMOVE_FROM_CART, product });

  const clearCart = () => dispatch({ type: actions.CLEAR_CART });

  const getProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/get-products`)
      .then(async (response) => {
        const data = await response.json();
        const modifiedData = data.map((product) => ({
          ...product,
          addedToCart: false,
        }));
        const cart = []; 
        dispatch({
          type: actions.GET_PRODUCTS,
          products: modifiedData,
          backed_up_cart: cart,
        });
      })
      .catch(() => {
        toast.error(
          "There was a problem fetching products, check your internet connection and try again"
        );
      });
  };

  const addQuantity = (product) => dispatch({ type: actions.ADD_QUANTITY, product });

  const reduceQuantity = (product) => dispatch({ type: actions.REDUCE_QUANTITY, product });

  const confirmOrder = async (order) => {
    const payload = {
      items: state.cart,
      totalItemCount: state.cartQuantity,
      delivery_type: order.DeliveryType,
      delivery_type_cost: order.DeliveryTypeCost,
      cost_before_delivery_rate: state.cartTotal,
      cost_after_delivery_rate: order.costAfterDelieveryRate,
      promo_code: order.promo_code || "",
      contact_number: order.phoneNumber,
      user_id: order.user_id,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/place-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error) {
      toast.error("You must be logged in to place an order");
      return { showRegisterLogin: true };
    }
    toast.success(data.message);
    clearCart();
    return true;
  };

  return {
    state,
    addToCart,
    removeFromCart,
    clearCart,
    getProducts,
    addQuantity,
    reduceQuantity,
    confirmOrder,
  };
};

export default useStore;
