import axios from "axios";

export const httpClient = axios.create();

// Add request interceptor for logging
httpClient.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    let errorMessage = "Network error or server unavailable";
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      errorMessage = error.response.data?.error ||
                    error.response.data?.message ||
                    `Server error: ${error.response.status}`;
      console.error("Response error data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      errorMessage = "No response from server";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      errorMessage = "Error sending request";
    }

    const customError = {
      ...error,
      message: errorMessage,
      statusCode: statusCode,
      data: error.response?.data,
    };

    // Display error notification
    // const event = new CustomEvent("notification", {
    //   detail: {
    //     message: "API Error",
    //     description: errorMessage,
    //     type: "error",
    //   },
    // });
    // window.dispatchEvent(event);

    return Promise.reject(customError);
  }
);

export default httpClient;
