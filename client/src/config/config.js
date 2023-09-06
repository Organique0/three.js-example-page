const environment = import.meta.env.VITE_NODE_ENV;
const config = {
  development: {
    backendUrl: "http://localhost:8080/api/v1/dalle"
  },
  production: {
    backendUrl: "https://three-js-example.onrender.com/api/v1/dalle"
  }
};

const selectedConfig = config[environment];

export default selectedConfig.backendUrl;
