import { Button, DialogContainer, FontIcon } from 'react-md'
import { useTranslation } from 'libs/langs'
import store from 'libs/store'

import './style.scss'

const DocumentsContainer = ({ data, visible, onHide }) => {
  const { t } = useTranslation()
  const downloadToken = store?.getState()?.app?.dlToken

  const renderFileName = (key) => {
    switch (key) {
      case 'ownerId':
        return t('id_passport')
      case 'propertyOwnership':
        return t('property_document')
      case 'bidderAgreement':
        return t('bidder_agreement')
      case 'authLetter':
        return t('authorization_letter')
      default:
        break
    }
  }

  const renderDocs = () =>
    data?.map((el, i) => (
      <li key={el?.uuid}>
        <div className="file-name">
          {i + 1} -{' '}
          {renderFileName(
            el?.['file_name'].slice(
              el?.['file_name'].lastIndexOf('-', el?.['file_name'].length) + 1,
              el?.['file_name'].length,
            ),
          ) || 'file'}
        </div>
        <Button
          className="viewBtn"
          onClick={() => {
            window.open(`${el?.url}?token=${downloadToken}&view=true`)
          }}
        >
          {t('view')}
        </Button>
        <Button
          className="downloadBtn"
          onClick={() => {
            window.open(`${el?.url}?token=${downloadToken}`)
          }}
        >
          {t('download')}
        </Button>
      </li>
    ))
  return (
    <DialogContainer
      visible={visible}
      dialogClassName="documents-dialog"
      focusOnMount={false}
    >
      <div className="documents-dialog-header">
        <div className="documents-dialog-header-title">{t('documents')}</div>
        <FontIcon className="documents-dialog-header-icon" onClick={onHide}>
          highlight_off
        </FontIcon>
      </div>
      <ol className="documents-dialog-list">{renderDocs()}</ol>
    </DialogContainer>
  )
}
export default DocumentsContainer
