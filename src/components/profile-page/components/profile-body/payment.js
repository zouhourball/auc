import { useTranslation } from 'libs/langs'
import { useState } from 'react'
import { Button } from 'react-md'
import moment from 'moment'
import pdfIcon from './pdf.svg'

import { getPaymentList, downloadInvoice } from 'libs/api/auctions-api'
import { useInfiniteQuery, useMutation } from 'react-query'

const Payment = () => {
  const { t } = useTranslation()

  const [edit, setEdit] = useState(true)
  const downloadInvoiceMutation = useMutation(downloadInvoice)

  const {
    data: payments,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery([4], getPaymentList, {
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (
        pages.length <=
        Math.ceil(+lastPage?.pagination?.total / +lastPage?.pagination?.limit)
      ) {
        return pages.length
      }
    },
  })
  const onDownloadInvoice = (trackID) => {
    downloadInvoiceMutation.mutate({
      trackID,
    })
  }
  return (
    <div className="personal-information md-cell md-cell--8 md-grid">
      <div className="personal-information-header md-cell md-cell--12">
        <h2>{t('payment')}</h2>
        <Button icon primary={!edit} onClick={() => setEdit((prev) => !prev)}>
          more_vert
        </Button>
      </div>
      {payments?.pages?.flatMap((payment) =>
        payment?.results?.map((el) => (
          <div
            key={el?.['track_id']}
            className="payment-row md-cell md-cell--8"
          >
            <div>{el?.['lot_number']}</div>
            <div>{moment(el?.date).format('DD/MM/YYYY HH:mm')}</div>
            <div>{el?.amount} OMR</div>
            <Button
              flat
              primary
              iconBefore
              iconEl={<img src={pdfIcon} />}
              onClick={() => onDownloadInvoice(el?.['track_id'])}
            >
              {t('download')}
            </Button>
          </div>
        )),
      )}
      {hasNextPage && (
        <Button
          onClick={() => {
            fetchNextPage()
          }}
        >
          Load More
        </Button>
      )}
    </div>
  )
}

export default Payment
