export const ENV = {
  dev: {
    BASE_URL: "https://frontend-dev.zoma.ai"
  },
  // qa: {
  //   BASE_URL: "https://qa.yourapp.com"
  // },
  // prod: {
  //   BASE_URL: "https://yourapp.com"
  // }
};

export const CURRENT_ENV =
  ENV[process.env.TEST_ENV as keyof typeof ENV] || ENV.dev;
