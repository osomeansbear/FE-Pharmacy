const apiEndpoints = {
  // auth: {
  //   register: "/auth/register",
  //   login: "/auth/login",
  //   logout: "/auth/logout",
  // },
  // customer: {
  //   getAllCustomers: "/customer",
  //   getById: (id: string) => `/customer/${id}`,
  //   update: (id: string) => `/customer/${id}`,
  //   search: "/customer/search",
  //   getCustomerGift: (id: string) => `/customer/${id}/gifts`,
  //   claimGift: "/customer/claim-gift",
  //   getByIdWithVouchers: (id: string) => `/customer/${id}/vouchers`,
  // },
  category: {
    getAllCategories: "categories",
  },
  user: {
    getAllUsers: "users",
  },
  auth: {
    login: "auth/login",
    register: "auth/register",
  },
  product: {
    getAllProducts: "products",
  },
};

export default apiEndpoints;
