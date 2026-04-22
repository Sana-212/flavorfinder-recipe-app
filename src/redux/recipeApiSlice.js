import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const recipeApi = createApi({
  reducerPath: 'recipeApi',

  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),

  endpoints: (builder) => ({

   
    getRandomRecipes: builder.query({
      queryFn: async (count = 6) => {
        try {
          const promises = Array.from({ length: count }, () =>
            fetch(`${BASE_URL}/random.php`).then((r) => r.json())
          );
          const results = await Promise.all(promises);
          const meals = results
            .map((d) => d.meals?.[0])
            .filter(Boolean);
          return { data: meals };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),

getCategories: builder.query({
  query: () => '/categories.php',
  transformResponse: (response) => {
    const all = response.categories || [];
    return [
      { idCategory: '0', strCategory: '🍔 All', key: 'all' },
      ...all
        .sort(() => Math.random() - 0.5)
        .slice(0, 7)
        .map((item) => ({        
          ...item,
          key: item.strCategory, 
        })),
    ];
  },
}),

    getRecipesByCategory: builder.query({
      query: (category) => `/filter.php?c=${category}`,
      transformResponse: (response) => {
        const all = response.meals || [];
        return all.sort(() => Math.random() - 0.5).slice(0, 10);
      },
    }),

    getRecipeById: builder.query({
      query: (id) => `/lookup.php?i=${id}`,
      transformResponse: (response) => response.meals?.[0] || null,
    }),

    searchRecipes: builder.query({
      query: (searchQuery) => `/search.php?s=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response) => response.meals || [],
    }),

  }),
});

export const {
  useGetRandomRecipesQuery,
  useGetCategoriesQuery,
  useGetRecipesByCategoryQuery,
  useGetRecipeByIdQuery,
  useSearchRecipesQuery,
} = recipeApi;