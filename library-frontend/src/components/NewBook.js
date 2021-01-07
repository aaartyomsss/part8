import React, { useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, FIND_BOOK_GENRE } from '../queries'
import { useMutation } from '@apollo/client'


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [ born, setBorn ] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
      setTimeout(() => {
        props.setError(null)
      }, 3000)
    },
    // update: (store, res) => {
    //   const currentRecommendations = store.readQuery({ query: FIND_BOOK_GENRE, 
    //     variables: {genre: props.user.favoriteGenre}
    //   })
    //   console.log(props.user.favoriteGenre)
    //   console.log(res.data.addBook.genres)
    //   if (res.data.addBook.genres.includes(props.user.favoriteGenre)){
    //     store.writeQuery({
    //       query: FIND_BOOK_GENRE,
    //       variables: { genre: props.user.favoriteGenre },
    //       data: {
    //         ...currentRecommendations,
    //         allBooks: [...currentRecommendations.allBooks, res.data.addBook]
    //       }
    //     })
    //   }
    // },
    refetchQueries: [
      { query: ALL_AUTHORS }, 
      { query: ALL_BOOKS },
      { 
        query: FIND_BOOK_GENRE,
        variables: { genreToSearch: props.user.favoriteGenre}
      }, 
    ]
    
   })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    addBook({
      variables: { title, name: author, born, published, genres }
    })

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
    setBorn('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author's name
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          author's bron year
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook