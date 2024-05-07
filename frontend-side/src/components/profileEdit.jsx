import { useState, useEffect } from 'react'
import CustomDataList from './CustomDatalist'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
const ProfileForm = ({ gender_get, plataforms_get }) => {
  const [genders, setGenders] = useState()
  const [plataforms, setPlataforms] = useState()

  const [displayName, setDisplayName] = useState('')
  const [plataformsSelected, setPlataformsSelected] = useState([])
  const [genderSelected, setGendersSelected] = useState()
  const [birthday, setBirthday] = useState(null)

  const handleChange = (event) => {
    setDisplayName(event.target.value)
  }

  const setOptions = () => {
    gender_get()
      .then(response => setGenders(response))
    plataforms_get()
      .then(response => setPlataforms(response))
  }

  useEffect(setOptions, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const body = {
      displayName,
      gender: genderSelected,
      plataforms: plataformsSelected,
      birthday
    }
    console.log(body)
  }

  const handleGender = (value) => {
    setGendersSelected(value)
  }

  const handlePlataforms = (value) => {
    if (plataformsSelected.includes(value)) { setPlataformsSelected([...plataformsSelected].filter((plataform) => plataform !== value)) } else { setPlataformsSelected([...plataformsSelected].concat(value)) }
  }

  if (genders === undefined) return

  if (plataforms === undefined) return

  return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Display name" onChange={handleChange} value={displayName}/>
            <CustomDataList options={genders} onChange={handleGender} summary="Gender" optionsLimit={2}/>
            <CustomDataList options={plataforms} onChange={handlePlataforms} summary="Plataforms" optionsLimit={3}/>
            <DatePicker selected={birthday} onChange={(date) => setBirthday(date)} showIcon/>
            <button type="submit">Sub</button>
        </form>
  )
}

export default ProfileForm
