import { baseApi } from '../../store/api/baseApi';

const injected = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMenu: builder.query({
      query: () => ({ url: '/mainMenu', method: 'GET' }),
      providesTags: (result) =>
        result ? [...result.map((m) => ({ type: 'Menu', id: m.id })), { type: 'Menu', id: 'LIST' }] : [{ type: 'Menu', id: 'LIST' }],
    }),
    getMenuItem: builder.query({
      query: (id) => ({ url: `/mainMenu/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Menu', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMenuQuery, useGetMenuItemQuery } = injected;
