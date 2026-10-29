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

type ApiOptionType = {
  url: string
  data?: unknown
  headersOption?: HeadersOption
}

export const postAPI = async (option: ApiOptionType)=>{
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

export const getAPI = async (option: ApiOptionType)=>{
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

export const putAPI = async (option: ApiOptionType)=>{
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
      method: "PUT",
      body: JSON.stringify(option.data)
    })

  if(!res.ok){
    throw new Error(res.statusText)
  }
    
  return await res.json()
}

export const deleteAPI = async (option: ApiOptionType)=>{
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
      method: "Delete",
    })

  if(!res.ok){
    throw new Error(res.statusText)
  }

  return res
}