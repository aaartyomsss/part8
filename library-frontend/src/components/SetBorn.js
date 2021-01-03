import React, { useState, useEffect } from 'react'
import { EDIT_BORN, ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'
import Select from 'react-select'


const SetBorn = ({setError, authors}) => {

    const options = authors.map(option => {
        return {
            value: option.name,
            label: option.name
        }
    })

    const [ selectedOption, setSelectedOption ] = useState('')
    const [ newYear, setYear ] = useState('')

    const [ changeNumber, result] = useMutation(EDIT_BORN, {
        refetchQueries: [ { query: ALL_AUTHORS} ] 
    })

    useEffect(() => {
        if(result.data && !result.data.editAuthor){
            setError('Incorrect name of author')
            setTimeout(() => {
                setError(null)
            }, 2000)
        }
    }, [result.data]) // eslint-disable-line

    const handleSubmit = (event) => {
        event.preventDefault()
        const selected = selectedOption.value
        changeNumber({ variables: { name: selected, setBornTo: newYear }})

        setYear('')
    }

    const handleChange = selectedOption => setSelectedOption(selectedOption)
    
    return(
        <form onSubmit={handleSubmit}>
            <Select
                options={options}
                onChange={handleChange}
                value={selectedOption}
            />
            <input
                name='year'
                value={newYear}
                onChange={({target}) => setYear(Number(target.value))}
            />
            <button type='submit'>Edit</button>
        </form>
    )

}

export default SetBorn