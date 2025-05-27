import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { formatDateTime } from '@/lib/utils';

const ImageThumbnail = ({file}:{file: Models.Document}) => ( 
<div className='file-details-thumbnail'>
   <Thumbnail type={file.type} extension={file.extension} url={file.url}  />
   <div className='flex flex-col'>
    <p className='subtitle-2 mb-1'>{file.name}</p>
    <FormattedDateTime date={file.$createdAt} className='caption' />
   </div>
  </div>
);

const Detailrow = ({label, value}:{label:string, value:string}) => (
  <div className='flex'>
    <p className='file-details-label'>{label}</p>
    <p className='file-details-value'>{value}</p>
  </div>
)
 
 

export const FileDetails = ({file}:{file: Models.Document}) => {
  return (
    <>
    <ImageThumbnail file={file}/>
    <Detailrow label='Format:' value={file.extension} />
    <Detailrow label='Size:' value={`${(file.size / 1024).toFixed(2)} KB`} />
<Detailrow label='Owner:' value={file.owner.fullName} />
<Detailrow label='Last edit:' value={formatDateTime(file.$updatedAt)} />
    </>
  )
};

