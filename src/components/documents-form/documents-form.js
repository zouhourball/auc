import { useState } from 'react'

import { getPublicUrl } from 'libs/utils/custom-function'
import { fileManagerUpload } from 'libs/api'

import { FileInput, FontIcon } from 'react-md'

const DocumentsForm = () => {
  const [documents, setDocuments] = useState({})

  const onFileSelected = (file, key) => {
    const myFileItemReader = new FileReader()

    myFileItemReader.readAsDataURL(file)
    fileManagerUpload([file]).then((res) => {
      if (res?.files?.length > 0) {
        setDocuments({ ...documents, [key]: res?.files?.[0] })
      }
    })
  }
  const fileInputCustom = (key) => {
    return (
      <FileInput
        id={key}
        className="org-signup-image"
        // accept="image/jpeg, image/png"
        icon={
          documents[key] ? (
            <img src={getPublicUrl(documents[key]?.id)} width="120px" />
          ) : (
            <FontIcon>add</FontIcon>
          )
        }
        onChange={(file) => onFileSelected(file, key)}
      />
    )
  }
  return (
    <div>
      <h1>Documents</h1>
      <span>National ID/Passport of Owner *</span>
      {fileInputCustom('ownerId')}

      <span>Property Ownership Document *</span>
      {fileInputCustom('propertyOwnership')}

      <span>Universal Bidder Agreement *</span>
      {fileInputCustom('bidderAgreement')}

      <span>Letter of Authorization *</span>
      {fileInputCustom('authLetter')}
    </div>
  )
}

export default DocumentsForm
