/* eslint-disable react/prop-types */
import './App.css'
import services from './services/requests'

const CustomDataList = ({ options, summary }) => {
  return (
    <details>
      <summary>{summary}</summary>
      <div className='datalist-options-container'>
        {options.map((option) => <button key={option[0]} onClick={() => console.log(option[1])}>{option[1]}</button>)}
      </div>
      
    </details>
  )
}

const App = () => {

  return (
    <>
      <CustomDataList options={Object.entries(genders)} summary="Genders" />
    </>
  )
}

export default App
