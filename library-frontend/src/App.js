import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

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

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

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
        <button onClick={() => setPage('add')}>add book</button>
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
      />

    </div>
  )
}

export default App