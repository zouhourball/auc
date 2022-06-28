import { FontIcon } from 'react-md'
import UploadImages from 'components/upload-images'

const DocumentsForm = ({ propertyDetails, setPropertyDetails }) => {
  //  const [images, setImages] = useState({})

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
    setPropertyDetails({ ...propertyDetails, [property]: value })
  }

  const setListImages = (newImages, keyAction, fileId) => {
    if (keyAction === 'delete') {
      onSetFormDetails(
        'images',
        images?.filter((el) => el.url !== fileId),
      )
    } else if (keyAction === 'add') {
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
        accept="image/jpeg, image/png, image/jpg"
        className="custom"
      />
    )
  }
  return (
    <div div className="auction-details-form md-grid">
      <div className="auction-details-form-title md-cell md-cell--12">
        Documents
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          National ID/Passport of Owner *
        </label>
        {fileInputCustom('ownerId')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          Property Ownership Document *
        </label>
        {fileInputCustom('propertyOwnership')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          Universal Bidder Agreement *
        </label>
        {fileInputCustom('bidderAgreement')}
      </div>
      <div className="md-cell md-cell--6">
        <label className="auction-details-form-label">
          Letter of Authorization *
        </label>
        {fileInputCustom('authLetter')}
      </div>
    </div>
  )
}

export default DocumentsForm
