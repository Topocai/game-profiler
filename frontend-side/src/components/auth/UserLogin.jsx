import PropTypes from 'prop-types'
const UserLogin = ({ onLogin }) => {
  return (
        <form onSubmit={(e) => onLogin(e)} className="user-login">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
            <button type="submit">Login</button>
        </form>
  )
}

UserLogin.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default UserLogin
