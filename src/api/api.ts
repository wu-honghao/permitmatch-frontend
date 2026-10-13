import { BASEAPIURL, USERTOKEN } from "../constant"

export type Job = {
  _id: string
  title: string
  company: string
  location: string
  salary: number
  permitSupported: boolean
  skills: string[]
}

type HeadersOption = {
  isAuthorization?: boolean,
}

type headers = {
  authorization?: string
}
export const postAPI = async (option: GetAPI)=>{
  const token = localStorage.getItem(USERTOKEN)
  const headers: headers = {}

  if(option.headersOption?.isAuthorization){
    headers.authorization = 'Bearer ' + token
  }

  const res = await fetch(BASEAPIURL + option.url ,{ 
      headers: {
          "Content-Type": "application/json",
          ...headers
      },
      method: "POST",
      body: JSON.stringify(option.data)
    })

  if(!res.ok){
    throw new Error(res.statusText)
  }
    
  return await res.json()
}

type GetAPI = {
  url: string
  data?: unknown
  headersOption?: HeadersOption
}
export const getAPI = async (option: GetAPI)=>{
  const token = localStorage.getItem(USERTOKEN)
  const headers: headers = {}

  if(option.headersOption?.isAuthorization){
    headers.authorization = 'Bearer ' + token
  }
  
  const res = await fetch(BASEAPIURL + option.url ,{ 
      headers: {
          "Content-Type": "application/json",
          ...headers
      },
      method: "GET",
    })

  if(!res.ok){
    throw new Error(res.statusText)
  }
  
  return await res.json()
}