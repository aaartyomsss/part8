import React, { useState } from 'react'

const Books = (props) => {
  const [ filter, setFilter ] = useState(null)
  if (!props.show) {
    return null
  }

  
  const books = props.books || []
  let g = []

  for(let i = 0; i < books.length; i++){
    for(let j = 0; j < books[i].genres.length; j++){
      g.push(books[i].genres[j])
    }
  }

  const tableContent = filter ? 
    books.filter(b => b.genres.includes(filter))
      .map(a =>
        <tr key={a.title}>
          <td>{a.title}</td>
          <td>{a.author.name}</td>
          <td>{a.published}</td>
        </tr>
      )
    : books.map(a =>
      <tr key={a.title}>
        <td>{a.title}</td>
        <td>{a.author.name}</td>
        <td>{a.published}</td>
      </tr>
    )
    
  

  const genres = [...new Set(g)]
  
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {tableContent}
        </tbody>
      </table>
      <div>
        {genres.map(genre => {
          return <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
        })}
        <button onClick={() => setFilter(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books