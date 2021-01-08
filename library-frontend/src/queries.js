import { gql  } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author{
            name
            born
        }
        genres
        id
    }
`

export const ALL_AUTHORS = gql`
    query{
        allAuthors{
            name
            born
            books {
                title
            }
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query{
        allBooks{
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const FIND_BOOK_GENRE = gql`
    query findBookByGenre($genreToSearch: String){
        allBooks(genre: $genreToSearch){
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const FIND_USER = gql`
    query findUserByToken($token: String!){
        findUser(token: $token){
            username
            favoriteGenre
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $name: String!, $born: Int!, $published: Int!, $genres: [String!]!){
        addBook(
            title: $title
            name: $name
            born: $born
            published: $published
            genres: $genres
        ){
            title
            author{
                name
                born
            }
            published
            genres
        }
    }
`

export const EDIT_BORN = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!){
        editAuthor(
            name: $name
            setBornTo: $setBornTo
        ){
            name
            born
            bookCount
        }
    }
`

export const CURRENT_USER = gql`
    query{
        me{
            username
            favoriteGenre
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            value
        }
    }
`

export const ADDED_BOOK = gql`
    subscription{
        bookAdded{
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`