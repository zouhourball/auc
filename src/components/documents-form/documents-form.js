import { FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'

import UploadImages from 'components/upload-images'

const DocumentsForm = ({ documentsDetails, setDocumentDetails }) => {
  //  const [images, setImages] = useState({})
  const { t } = useTranslation()

  const images = []

  /* const onFileSelected = (file, key) => {
    const myFileItemReader = new FileReader()

    myFileItemReader.readAsDataURL(file)
    fileManagerUpload([file]).then((res) => {
      if (res?.files?.length > 0) {
        setDocuments({ ...documents, [key]: res?.files?.[0] })
      }
    })
  } */

  const onSetFormDetails = (property, value) => {
    setDocumentDetails({ ...documentsDetails, [property]: value })
  }

  const setListImages = (newImages, keyAction, fileId) => {
    if (keyAction === t('delete')) {
      onSetFormDetails(
        'images',
        images?.filter((el) => el.url !== fileId),
      )
    } else if (keyAction === t('add')) {
      onSetFormDetails('images', [...images, ...newImages])
    } else {
      onSetFormDetails('images', newImages)
    }
  }
  const fileInputCustom = (key) => {
    return (
      <UploadImages
        cover
        multiple={true}
        title={
          <>
            <span className="drop-zone-placeholder">
              {'Drag & Drop Files here or'}
              <b>{' Select File / Image'}</b>
            </span>
          </>
        }
        setListFiles={(files, keyAction, fileId) =>
          setListImages(files, keyAction, fileId)
        }
        listFiles={images}
        iconDelete={true}
        titleContent={' '}
        addTitle={
          <div className="">
            <FontIcon className="">add</FontIcon>
            {'add_images'}
          </div>
        }
        titleUpload={images?.length > 0 ? 'add_images' : ''}
        icon={<FontIcon>add_photo_alternate</FontIcon>}
        // accept="image/jpeg, image/png, image/jpg"
        className="custom"
      />
    )
  }
  return (
    <div div className="auction-details-form md-grid">
      <div className="auction-details-form-title md-cell md-cell--12">
        {t('documents')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">{t('id_passport')}</label>
        {fileInputCustom('ownerId')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('property_document')}
        </label>
        {fileInputCustom('propertyOwnership')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('bidder_agreement')}
        </label>
        {fileInputCustom('bidderAgreement')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          {t('authorization_letter')}
        </label>
        {fileInputCustom('authLetter')}
      </div>
    </div>
  )
}

export default DocumentsForm
