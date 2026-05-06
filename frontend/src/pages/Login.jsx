import React, { useState } from 'react'
const Login = () => {

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

  return (
    <div>
      <form>
        <label>
            Email:
            <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label>
           Password:
            <input type="password" name="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
         </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default Login
