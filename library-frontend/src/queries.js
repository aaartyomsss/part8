import { gql  } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query{
        allAuthors{
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query{
        allBooks{
            title
            published
            author{
                name
                born
            }
            genres
        }
    }
`

export const FIND_BOOK_GENRE = gql`
    query findBookByGenre($genreToSearch: String){
        allBooks(genre: $genreToSearch){
            title
            published
            author{
                name
                born
            }
            genres
        }
    }
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