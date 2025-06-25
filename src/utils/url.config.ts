export const URL_CONFIG = {
  API: {
    COMPOSITE_SEARCH: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/action/composite/v3/search`,
    CHANNEL_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/channel/v1/create`,
    FRAMEWORK_READ: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/read`,
    FRAMEWORK_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/create`,
    MASTER_CATEGORY_SEARCH: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/action/composite/v3/search`,
    MASTER_CATEGORY_CREATE: `${process.env.NEXT_PUBLIC_INTERFACE_URL}/api/framework/v1/category/master/create`,
    // Add more API endpoints here as needed
  },
};
