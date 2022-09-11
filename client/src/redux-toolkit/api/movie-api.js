import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const MovieSearchApi = createApi({

    reducerPath: "MovieSearchApi",

    baseQuery: fetchBaseQuery({ baseUrl: "https://www.omdbapi.com/" }),

    endpoints: (builder) => ({

        MovieSearch: builder.query({
            query: (movieName) => `/?s=${movieName}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`

        }),

        movieInfo:  builder.query({
            query:(imdbID)=> `/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
        
        }),
    })

})


export const { useMovieSearchQuery, useMovieInfoQuery } = MovieSearchApi

