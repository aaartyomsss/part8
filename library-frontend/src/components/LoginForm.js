import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken, setUser }) => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ login, result] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
            setTimeout(() => {
                setError(null)
            }, 2000)
        }
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('loggedInUser', token)
        }
    }, [result.data]) // eslint-disable-line

    const submit = async (event) => {
        event.preventDefault()

        login({variables: { username, password }})
    }

    return (
        <div>
            <form onSubmit={submit}>
                Username:
                <input
                    name='username'
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
                Password:
                <input
                    type='password'
                    name='password'
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    )

}

export default LoginForm