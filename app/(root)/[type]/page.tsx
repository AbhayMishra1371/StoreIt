import { getFiles } from '@/lib/actions/file.action';
import React from 'react'

const page = async({params}:SearchParamProps) => {
    const type = ((await params)?.type as string) || "";

const files = await getFiles();
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
             {files.length > 0 ? (
                <section></section>
             ):<p>No files uploded</p> }
      
    </div>
  )
}

export default page
