/* eslint-disable react/prop-types */

import { useState } from 'react'

const CustomDataList = ({ options, summary, onChange, optionsLimit }) => {
  /**
   * options: [{
   *  display: string required
   *  color: string
   *  icon: string
   * }]
   */
  const [valuesSelected, setValuesSelected] = useState(0)
  const onClickHandler = (option, event, optionsLimit) => {
    event.preventDefault()
    onChange(option)
    if (event.target.classList.contains('selected')) {
      event.target.classList.remove('selected')
      setValuesSelected(valuesSelected - 1)

      const allButtons = event.target.parentElement.childNodes
      if (valuesSelected >= optionsLimit) {
        allButtons.forEach((button) => {
          if (button.disabled) { button.disabled = false }
        })
      }
      return
    }

    if (valuesSelected < optionsLimit) {
      setValuesSelected(valuesSelected + 1)
      event.target.classList.add('selected')

      if ((valuesSelected + 1) >= optionsLimit) {
        const allButtons = event.target.parentElement.childNodes
        allButtons.forEach((button) => {
          if (button.classList.contains('selected')) return
          button.disabled = true
        })
      }
    }
  }

  return (
      <details>
        <summary>{summary}</summary>
        <div className='datalist-options-container'>
          {options.map((option) => {
            const optionObject = Object.values(option)[0]
            return (<button type="button" key={optionObject.display} onClick={(event) => onClickHandler(option, event, optionsLimit)}>
            {optionObject.display}
            </button>)
          })
          }
        </div>

      </details>
  )
}

export default CustomDataList
