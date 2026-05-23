import fetchClient from '../../http/fetchConfig';
import axiosInstance from '../../http/axiosConfig';
/**
 * Service client that can switch between Axios and Fetch implementations
 */
class ServiceClient {
  constructor(options = {}) {
    const {
      client = 'axios', // 'axios' or 'fetch'
      baseURL,
      timeout = 10000,
    } = options;

    this.clientType = client;
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Get the current HTTP client instance
   * @returns {Object} HTTP client (axios or fetch)
   */
  getClient() {
    return this.clientType === 'axios' ? axiosInstance : fetchClient;
  }

  /**
   * Switch between HTTP clients
   * @param {string} clientType - 'axios' or 'fetch'
   */
  setClient(clientType) {
    if (!['axios', 'fetch'].includes(clientType)) {
      throw new Error('Invalid client type. Use "axios" or "fetch".');
    }
    this.clientType = clientType;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async get(endpoint, options = {}) {
    const requestOptions = this.baseURL ? { ...options, baseURL: this.baseURL } : options;
    const response = await this.getClient().get(endpoint, requestOptions);
    return response.data;
  }

  async post(endpoint, data, options = {}) {
    const requestOptions = this.baseURL ? { ...options, baseURL: this.baseURL } : options;
    const response = await this.getClient().post(endpoint, data, requestOptions);
    return response.data;
  }

  async put(endpoint, data, options = {}) {
    const requestOptions = this.baseURL ? { ...options, baseURL: this.baseURL } : options;
    const response = await this.getClient().put(endpoint, data, requestOptions);
    return response.data;
  }

  async patch(endpoint, data, options = {}) {
    const requestOptions = this.baseURL ? { ...options, baseURL: this.baseURL } : options;
    const response = await this.getClient().patch(endpoint, data, requestOptions);
    return response.data;
  }

  async delete(endpoint, options = {}) {
    const requestOptions = this.baseURL ? { ...options, baseURL: this.baseURL } : options;
    const response = await this.getClient().delete(endpoint, requestOptions);
    return response.data;
  }

  async uploadFile(endpoint, formData, options = {}) {
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.post(endpoint, formData, requestOptions);
  }

  async downloadFile(endpoint, options = {}) {
    const requestOptions = {
      ...options,
      responseType: 'blob',
    };
    return this.get(endpoint, requestOptions);
  }
}

const serviceClientInstance = new ServiceClient();

const serviceClient = (endpoint, options = {}) => {
  const { method = 'GET', body, ...restOptions } = options;

  switch (method.toUpperCase()) {
    case 'GET':
      return serviceClientInstance.get(endpoint, restOptions);
    case 'POST':
      return serviceClientInstance.post(endpoint, body, restOptions);
    case 'PUT':
      return serviceClientInstance.put(endpoint, body, restOptions);
    case 'PATCH':
      return serviceClientInstance.patch(endpoint, body, restOptions);
    case 'DELETE':
      return serviceClientInstance.delete(endpoint, restOptions);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

serviceClient.get = (endpoint, options) => serviceClientInstance.get(endpoint, options);
serviceClient.post = (endpoint, data, options) => serviceClientInstance.post(endpoint, data, options);
serviceClient.put = (endpoint, data, options) => serviceClientInstance.put(endpoint, data, options);
serviceClient.patch = (endpoint, data, options) => serviceClientInstance.patch(endpoint, data, options);
serviceClient.delete = (endpoint, options) => serviceClientInstance.delete(endpoint, options);

export { serviceClient };
export default ServiceClient;
