export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://ecommerce.routemisr.com";

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/v1/products`,
  categories: `${API_BASE_URL}/api/v1/categories`,
  productById: (id: string) => `${API_BASE_URL}/api/v1/products/${id}`,
  categoryById: (id: string) => `${API_BASE_URL}/api/v1/categories/${id}`,
  categorySubcategories: (id: string) =>
    `${API_BASE_URL}/api/v1/categories/${id}/subcategories`,
  subcategories: `${API_BASE_URL}/api/v1/subcategories`,
  subcategoryById: (id: string) => `${API_BASE_URL}/api/v1/subcategories/${id}`,
  auth: {
    signin: `${API_BASE_URL}/api/v1/auth/signin`,
    signup: `${API_BASE_URL}/api/v1/auth/signup`,
    forgotPasswords: `${API_BASE_URL}/api/v1/auth/forgotPasswords`,
    verifyResetCode: `${API_BASE_URL}/api/v1/auth/verifyResetCode`,
    resetPassword: `${API_BASE_URL}/api/v1/auth/resetPassword`,
    verifyToken: `${API_BASE_URL}/api/v1/auth/verifyToken`,
  },
  users: {
    updateMe: `${API_BASE_URL}/api/v1/users/updateMe/`,
    changeMyPassword: `${API_BASE_URL}/api/v1/users/changeMyPassword`,
  },
  cart: {
    base: `${API_BASE_URL}/api/v1/cart`,
    clear: `${API_BASE_URL}/api/v1/cart`,
  },
  orders: {
    cashOrder: (cartId: string) => `${API_BASE_URL}/api/v1/orders/${cartId}`,
    checkoutSession: (cartId: string, url: string) =>
      `${API_BASE_URL}/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(url)}`,
    allOrders: `${API_BASE_URL}/api/v1/orders/`,
    userOrders: (userId: string) => `${API_BASE_URL}/api/v1/orders/user/${userId}`,
  },
  reviews: {
    productReviews: (productId: string) =>
      `${API_BASE_URL}/api/v1/products/${productId}/reviews`,
    base: `${API_BASE_URL}/api/v1/reviews`,
    byId: (reviewId: string) => `${API_BASE_URL}/api/v1/reviews/${reviewId}`,
  },
  brands: {
    base: `${API_BASE_URL}/api/v1/brands`,
    byId: (brandId: string) => `${API_BASE_URL}/api/v1/brands/${brandId}`,
  },
} as const;
