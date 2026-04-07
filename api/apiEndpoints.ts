const apiEndpoints = {
  category: {
    getAllCategories: "categories",
    getCategoryById: (id: number) => `categories/${id}`,
    createCategory: "categories",
    updateCategory: (id: number) => `categories/${id}`,
    deleteCategory: (id: number) => `categories/${id}`,
  },
  user: {
    getMe: "users/profile",
    getAllUsers: "users",
    getUserById: (id: number) => `users/detail/${id}`,
    updateUserById: (id: number) => `users/update/${id}`,
    updateUserStatus: (id: number) => `users/${id}/status`,
    updateUserRole: (id: number) => `users/${id}/role`,
    deleteUser: (id: number) => `users/delete/${id}`,
    createAddress: "users/profile/addresses",
    getAddresses: "users/profile/addresses",
    updateAddress: (id: number) => `users/profile/addresses/${id}`,
    deleteAddress: (id: number) => `users/profile/addresses/${id}`,
    healthProfile: "users/profile/health",
    changePassword: "users/profile/password",
  },
  auth: {
    login: "auth/login",
    register: "auth/register",
  },
  product: {
    getAllProducts: "products",
    getProductBySlug: (slug: string) => `products/${slug}`,
    createProduct: "products",
    updateProduct: (id: number) => `products/${id}`,
    deleteProduct: (id: number) => `products/${id}`,
  },
  cart: {
    getMyCart: "cart",
    addItem: "cart/items",
    updateItem: (id: number) => `cart/items/${id}`,
    removeItem: (id: number) => `cart/items/${id}`,
  },
  brands: {
    getAllBrands: "brands",
    getBrandById: (id: number) => `brands/${id}`,
    createBrand: "brands",
    updateBrand: (id: number) => `brands/${id}`,
    deleteBrand: (id: number) => `brands/${id}`,
  },
  order: {
    getAllOrders: "orders",
    getMyOrders: "orders/me",
    getMyOrderById: (id: number) => `orders/${id}`,
    createOrder: "orders",
    adminCreateOrder: "orders/admin-create",
    payOrder: (id: number) => `orders/${id}/pay`,
    cancelOrder: (id: number) => `orders/${id}/cancel`,
    updateOrderStatus: (id: number) => `orders/${id}/status`,
  },
  chat: {
    sendMessage: "chat",
  },
};

export default apiEndpoints;
