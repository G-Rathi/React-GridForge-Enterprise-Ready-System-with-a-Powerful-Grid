import { createApi } from '@reduxjs/toolkit/query/react';
import { serviceClient } from '../../../services/http/serviceClient';

/**
 * Custom baseQuery for RTK Query that uses serviceClient
 */
const serviceClientBaseQuery = async (args, api, extraOptions) => {
  try {
    const { url, method = 'GET', body, params, ...restOptions } = args;
    
    let result;
    switch (method.toUpperCase()) {
      case 'GET':
        result = await serviceClient.get(url, { params, ...restOptions });
        break;
      case 'POST':
        result = await serviceClient.post(url, body, restOptions);
        break;
      case 'PUT':
        result = await serviceClient.put(url, body, restOptions);
        break;
      case 'PATCH':
        result = await serviceClient.patch(url, body, restOptions);
        break;
      case 'DELETE':
        result = await serviceClient.delete(url, restOptions);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    return { data: result };
  } catch (error) {
    // Handle axios errors (has error.response)
    if (error.response) {
      return {
        error: {
          status: error.response.status,
          data: error.response.data || error.message,
        },
      };
    }
    
    // Handle connection errors from fetch client
    if (error.isConnectionError || error.status === 'CONNECTION_ERROR') {
      return {
        error: {
          status: 'CONNECTION_ERROR',
          data: error.data || {
            message: error.message || 'Unable to connect to the server. Please check if the API server is running.',
          },
        },
      };
    }
    
    // Handle fetch/client errors (has error.status and error.data from our fetch client)
    if (error.status) {
      return {
        error: {
          status: error.status,
          data: error.data || error.message || 'Unknown error',
        },
      };
    }
    
    // Handle network/connection errors (check error message)
    if (error.message && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Network request failed')
    )) {
      return {
        error: {
          status: 'CONNECTION_ERROR',
          data: {
            message: 'Unable to connect to the server. The API server may not be running.',
            originalError: error.message,
          },
        },
      };
    }
    
    // Handle other errors
    return {
      error: {
        status: 'FETCH_ERROR',
        data: error.message || 'Unknown error',
      },
    };
  }
};

export const baseApi = createApi({
  baseQuery: serviceClientBaseQuery,
  endpoints: () => ({}),
  tagTypes: ['User', 'Settings', 'Menu'],
});

export default baseApi;
