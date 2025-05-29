import {
    CrudFilters,
    CrudSorting,
    DataProvider
} from "@refinedev/core";
import axios, { AxiosInstance } from "axios";

// Helper function to create query string for debugging
const createQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

export const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: Record<string, any> = {};

  if (filters) {
    filters.forEach((filter) => {
      if (filter.operator === "eq" && filter.value !== undefined && filter.value !== null) {
        queryFilters[filter.field] = filter.value;
      }

      if (filter.operator === "contains" && filter.value !== undefined && filter.value !== null) {
        queryFilters["search"] = filter.value;
      }
    });
  }

  return queryFilters;
};

export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    return {
      sort: sorters[0].field,
      order: sorters[0].order,
    };
  }

  return {};
};

/**
 * A custom data provider that adapts to our backend API
 * @param apiUrl The base URL of the API
 * @param httpClient The Axios instance to use
 * @returns A DataProvider compatible with Refine
 */
export const dataProvider = (apiUrl: string, httpClient: AxiosInstance = axios): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    // Handle pagination
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;

    // Handle filtering
    const queryFilters = generateFilter(filters);

    // Handle sorting
    const generatedSort = generateSort(sorters);

    // Combine all query parameters
    const query = {
      ...queryFilters,
      ...generatedSort,
      ...(meta?.query || {}),
    };

    // Create query string manually for debugging
    const queryString = createQueryString(query);
    console.log(`[dataProvider] getList ${resource} with query:`, queryString);

    try {
      // Make direct HTTP request to test API
      console.log(`[dataProvider] Fetching: ${url}${queryString ? `?${queryString}` : ''}`);
      const { data } = await httpClient.get(`${url}${queryString ? `?${queryString}` : ''}`);
      console.log(`[dataProvider] getList ${resource} response:`, data);

      return {
        data,
        total: Array.isArray(data) ? data.length : 0,
      };
    } catch (error) {
      console.error(`[dataProvider] Error in getList ${resource}:`, error);
      throw error;
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const url = `${apiUrl}/${resource}`;

    try {
      console.log(`[dataProvider] getMany ${resource} ids:`, ids);

      // Fetch individual resources by ID since our API doesn't support fetching multiple by IDs
      const promises = ids.map((id) => httpClient.get(`${url}/${id}`));
      const responses = await Promise.all(promises);

      console.log(`[dataProvider] getMany ${resource} response count:`, responses.length);

      return {
        data: responses.map((response) => response.data),
      };
    } catch (error) {
      console.error(`[dataProvider] Error in getMany ${resource}:`, error);
      throw error;
    }
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    try {
      console.log(`[dataProvider] create ${resource} variables:`, variables);

      const { data } = await httpClient.post(url, variables);

      console.log(`[dataProvider] create ${resource} response:`, data);

      return {
        data,
      };
    } catch (error) {
      console.error(`[dataProvider] Error in create ${resource}:`, error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    try {
      console.log(`[dataProvider] update ${resource}/${id} variables:`, variables);

      const { data } = await httpClient.put(url, variables);

      console.log(`[dataProvider] update ${resource}/${id} response:`, data);

      return {
        data,
      };
    } catch (error) {
      console.error(`[dataProvider] Error in update ${resource}/${id}:`, error);
      throw error;
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    try {
      console.log(`[dataProvider] getOne ${resource}/${id}`);

      const { data } = await httpClient.get(url);

      console.log(`[dataProvider] getOne ${resource}/${id} response:`, data);

      return {
        data,
      };
    } catch (error) {
      console.error(`[dataProvider] Error in getOne ${resource}/${id}:`, error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    try {
      console.log(`[dataProvider] deleteOne ${resource}/${id}`);

      const { data } = await httpClient.delete(url);

      console.log(`[dataProvider] deleteOne ${resource}/${id} response:`, data);

      return {
        data,
      };
    } catch (error) {
      console.error(`[dataProvider] Error in deleteOne ${resource}/${id}:`, error);
      throw error;
    }
  },

  getApiUrl: () => apiUrl,

  custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
    let requestUrl = `${apiUrl}${url}`;

    if (query) {
      const queryString = createQueryString(query);
      requestUrl = `${requestUrl}?${queryString}`;
    }

    let axiosConfig = {};

    if (headers) {
      axiosConfig = {
        headers,
      };
    }

    try {
      console.log(`[dataProvider] custom ${method} ${requestUrl}`, payload);

      let response;

      switch (method) {
        case "put":
        case "post":
        case "patch":
          response = await httpClient[method](requestUrl, payload, axiosConfig);
          break;
        case "delete":
          response = await httpClient.delete(requestUrl, {
            data: payload,
            ...axiosConfig,
          });
          break;
        default:
          response = await httpClient.get(requestUrl, axiosConfig);
          break;
      }

      console.log(`[dataProvider] custom ${method} ${requestUrl} response:`, response.data);

      return {
        data: response.data,
      };
    } catch (error) {
      console.error(`[dataProvider] Error in custom ${method} ${requestUrl}:`, error);
      throw error;
    }
  },
});
