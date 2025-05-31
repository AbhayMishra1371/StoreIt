import Card from '@/components/Card';
import { getFiles } from '@/lib/actions/file.action';
import { getFileType, getFileTypesParams } from '@/lib/utils';
import { Models } from 'node-appwrite';
import React from 'react'
import { types } from 'util';

const page = async({searchParams,params}:SearchParamProps) => {
    const type = ((await params)?.type as string) || "";
    const types = getFileTypesParams(type) as FileType[];
    const searchText = ((await searchParams)?.query as string) || "";
        const sort = ((await params)?.sort as string) || "";

const files = await getFiles({types,searchText,sort});
  return (
    <div className='page-container'>
        <section className='w-full'>
            <h1 className='h1 capitalize'>{type}</h1>

            <div className='total-size-section'>
                <p className='body-1'>
                    Total: <span className='h5'>0 MB</span>
                </p>
                <div className='sort-container'>
                    <p className='body- hidden sm:block text-light-200'>Sort by:</p>
                </div>
            </div>
             </section>

             {/* Render the file list here */}
             {files.total > 0 ? (
                <section className='file-list'>

                    {files.documents.map((file:Models.Document) => (
                       <Card key={file.$id} file={file}/>
                    ))}
                </section>
             ):<p className='empty-list'>No files uploded</p> }
      
    </div>
  )
}

export default page
