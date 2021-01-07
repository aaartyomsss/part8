import React from 'react'



const Recommended = ({ show, books }) => {

    if (!show){
        return null
    }

    if (books.length === 0) {
        return <div>Nothing to display!</div>
    } 

    console.log(books)

    const tableContnet = books.allBooks.map(b => 
        <tr key={b.title}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
        </tr>
    )

    return (
        <div>
            <h2>Recommended books</h2>

            <p>Based on you favorite genre</p>

            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <td>Published</td>
                    </tr>
                    {tableContnet}
                </tbody>
            </table>
        </div>
    )

}

export default Recommended