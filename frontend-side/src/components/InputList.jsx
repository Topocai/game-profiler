import PropTypes from 'prop-types'

import './styles/input-list.css'

const InputList = ({ inputs, fieldsetName, onChangeHandler = () => {} }) => {
  /**
     * inputs: [
     * {
     *   id: 'on_hold',
     *   name: 'On Hold',
     *   isRadio: true,
     *   isChecked: false,
     *   onChangeHandler: () => {}
     * }]
     */

  return (
        <fieldset name={fieldsetName} className="input-list">
            {
              inputs.map((input) => {
                return (
                <div key={input.id} className={`list-input-container ${input.isRadio ? 'list-input-radio' : ''}`}>
                    <input
                      type={input.isRadio ? 'radio' : 'checkbox'}
                      id={input.id}
                      name={input.isRadio ? fieldsetName + '-input' : null}
                      value={input.id}
                      checked={input.isChecked}
                      onChange={input.onChangeHandler ? input.onChangeHandler : onChangeHandler}
                    />
                    <label htmlFor={input.id} className="input-label">{input.name}</label>
                </div>
                )
              })
            }
        </fieldset>
  )
}

InputList.propTypes = {
  inputs: PropTypes.array.isRequired,
  fieldsetName: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func
}

export default InputList
