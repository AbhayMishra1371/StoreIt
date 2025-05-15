import React from 'react'


interface Props{
  type:string;
  extension:string; 
  url?:string;
}
const Thumbnail = ({type,extension,url=''}:Props) => {
  return (
   <figure>
    
   </figure>
  )
}

export default Thumbnail
