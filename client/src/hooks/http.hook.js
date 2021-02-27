import {useState, useCallback} from 'react'

export const useHttp = () =>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const request = useCallback (async(url, method='GET', body = null, headers = {})=>{
        try {
           const response = await fetch(url, {method, body, headers })
           const data = await response.json()

           if(!response.ok){
               throw new Error(data.message || 'Something is getting wrong.')
           }
        } catch (e) {
            
        }
    }, [])

    return {loading, request, error}
}