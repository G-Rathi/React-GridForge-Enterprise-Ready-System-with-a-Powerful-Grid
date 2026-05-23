import { baseApi } from '../../store/api/baseApi';

const injected = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({ url: '/user', method: 'GET' }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({ url: '/user', method: 'PUT', body: userData }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useLoginMutation,
  useLogoutMutation,
} = injected;
