// import React, {useState} from 'react'
// import {Document, Page} from 'react-pdf/dist/esm/entry.webpack'
// import { useParams } from 'react-router-dom'


// const PDFViewer = () => {
//     const {fileUrl} = useParams(fileUrl)
//     const [numPages, setNumPages] = useState(null)

//     const onDocumentSuccess = ({numPages}) => {
//         setNumPages(numPages)
//     }
//   return (
//     <div style={{display: "flex", justifyContent: "center"}}>
//         <div style={{width: "700px", border: "3px solid gray"}}>
//             <Document file={fileUrl} onLoadSuccess={onDocumentSuccess}>
//                 {
//                     Array(numPages).fill().map((_, i) => (
//                         <Page pageNumber={i+1}></Page>
//                     ))
//                 }
//             </Document>
            

//         </div>

//     </div>
//   )
// }

// export default PDFViewer

import React from 'react'
import { useParams } from 'react-router-dom'

const PDFViewer = () => {
    const { fileUrl } = useParams()
  return (
    <div>PDFViewer</div>
  )
}

export default PDFViewer