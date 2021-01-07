import { useQuery, useApolloClient, useLazyQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, CURRENT_USER, FIND_BOOK_GENRE } from './queries'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

const Notification = ({message}) => {

  if(!message){
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {message}
    </div>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [ errorMessage, setError ] = useState(null)
  const [ token, setToken ] = useState(null)
  const [ user, setUser ] = useState(null) //eslint-disable-line
  const client = useApolloClient()
  const [ getUser, result ]= useLazyQuery(CURRENT_USER)
  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const [ books, setBooks ] = useState([])
  const [ getBooks, recommendedBooks ] = useLazyQuery(FIND_BOOK_GENRE)

  useEffect(() => {
    const t = localStorage.getItem('loggedInUser')
    console.log(t)
    if (t) {
      setToken(t)
      getUser()
    }
  }, [getUser])

  useEffect(() => {
    if(result.data){
      setUser(result.data.me)
      getBooks({ variables: { genreToSearch: result.data.me.favoriteGenre}})
    }
  }, [result, getBooks])

  useEffect(() => {
    if(recommendedBooks.data) {
      console.log(recommendedBooks.data.allBooks)
      setBooks(recommendedBooks.data)
    }
  }, [recommendedBooks])
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if(resultAuthors.loading){
    return <div>Loading</div>
  }

  if(resultBooks.loading){
    return <div>Loading...</div>
  }

  return (

    <div>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <div>
          <button onClick={() => setPage('recommended')}>recommended</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => logout()}>Logout</button>
          </div>
          : <LoginForm setToken={setToken} setError={setError} />
        }
      </div>

      <Authors
        show={page === 'authors'}
        authors={resultAuthors.data.allAuthors}
        setError={setError}
      />

      <Books
        show={page === 'books'}
        books={resultBooks.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
        setError={setError}
        user={user}
      />

      <Recommended
        show={page === 'recommended'}
        books={books}
      />

    </div>
  )
}

export default App