import { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = `${action.payload.productId}-${action.payload.size}-${action.payload.color}`;
      const existing = state.items.find((item) => item.key === key);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + action.payload.quantity } : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, key }]
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.key !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === action.payload.key ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const value = useMemo(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: state.items,
      itemCount,
      subtotal,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (key) => dispatch({ type: "REMOVE_ITEM", payload: key }),
      updateQuantity: (key, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { key, quantity: Math.max(1, quantity) } }),
      clearCart: () => dispatch({ type: "CLEAR" })
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
