import React, { createContext, useState } from 'react'
export const domainContext=createContext();
const DomainContextProvider = ({children}) => {
     let [domain,setDomain]=useState("none")
  return (
    <domainContext.Provider value={[domain,setDomain]}>
        {children}
    </domainContext.Provider>
  )
}

export default DomainContextProvider
