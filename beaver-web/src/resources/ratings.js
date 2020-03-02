import { getToken } from 'src/resources/token.js'
import axios from 'axios'

export const loadComments = () => {
  return axios.get('http://localhost:3000/myComments', {
    headers: {
      authorization: getToken()
    }
  })
}
