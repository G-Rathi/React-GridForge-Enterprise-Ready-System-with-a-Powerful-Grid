import { baseApi } from '../../store/api/baseApi';

const injected = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: (params = {}) => ({ url: '/todos', method: 'GET', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Todo', id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),
    getTodo: builder.query({
      query: (id) => ({ url: `/todos/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
    createTodo: builder.mutation({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: {
          ...todo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({ url: `/todos/${id}`, method: 'PUT', body: { ...todo, updatedAt: new Date().toISOString() } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }, { type: 'Todo', id: 'LIST' }],
    }),
    patchTodo: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/todos/${id}`, method: 'PATCH', body: { ...patch, updatedAt: new Date().toISOString() } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }, { type: 'Todo', id: 'LIST' }],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({ url: `/todos/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Todo', id }, { type: 'Todo', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  usePatchTodoMutation,
  useDeleteTodoMutation,
} = injected;

