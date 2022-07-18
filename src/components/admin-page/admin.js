import Mht from '@target-energysolutions/mht'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button } from 'react-md'
import { configs, dummyDataMht, dummyDocs } from './helper'
import { navigate } from '@reach/router'

import DocumentsContainer from 'components/docs-dialog'

const Admin = () => {
  const { t } = useTranslation()
  const [documentsDialog, setDocumentsDialog] = useState(false)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const selectedRow = selectedRowSelector.map((id) => dummyDataMht()?.[id])

  return (
    <div>
      <span>LOGO</span>
      <Button primary>{t('log_out')}</Button>
      <h1>{t('auctions')}</h1>
      <div>
        <Mht
          id={'admin-dashboard'}
          configs={configs}
          tableData={dummyDataMht(setDocumentsDialog)}
          withChecked
          singleSelect
          withSearch
          withFooter
          commonActions
          headerTemplate={
            (selectedRow?.length === 1 && (
              <div>
                {`${selectedRow.length} Row Selected`}
                <Button onClick={() => navigate(`detail/${'1'}`)}>
                  {t('view_details')}
                </Button>
                <Button>{t('approve')}</Button>
                <Button>{t('reject')}</Button>
              </div>
            )) || <div />
          }
        />
      </div>
      {documentsDialog && (
        <DocumentsContainer
          visible={documentsDialog}
          onHide={() => setDocumentsDialog(false)}
          data={dummyDocs}
        />
      )}
    </div>
  )
}
export default Admin
