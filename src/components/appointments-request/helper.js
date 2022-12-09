import { Button } from 'react-md'

export const configs = (
  onApprove,
  onReject,
  setNotesVisible,
  setLocationVisible,
  setLinkVisible,
  t,
) => [
  {
    label: t('title_label'),
    key: 'title',
    width: '200',
    // icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('name'),
    key: 'name',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('type_of_appointment'),
    key: 'appointmentTypeKey',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('location'),
    key: 'location',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return row?.appointmentType === 'In-person' ? (
        <Button
          flat
          primary
          onClick={() =>
            setLocationVisible({
              x: row?.xLocation,
              y: row?.yLocation,
              id: row?.id,
            })
          }
        >
          {t('Edit_location')}
        </Button>
      ) : (
        <Button
          flat
          primary
          onClick={() =>
            setLinkVisible({ link: row?.link, id: row?.id } || true)
          }
        >
          {row?.link ? t('View_link') : t('Add_link')}
        </Button>
      )
    },
  },
  {
    label: t('date'),
    key: 'date',
    width: '150',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('time'),
    key: 'time',
    width: '150',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('notes'),
    key: 'status',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return row?.note ? (
        <Button flat primary onClick={() => setNotesVisible(row?.note)}>
          {t('view')}
        </Button>
      ) : (
        <></>
      )
    },
  },
  {
    label: t('action'),
    key: 'action',
    width: '220',
    type: 'text',
    render: (row) => {
      return row?.status === 'Pending' ? (
        <>
          <Button
            flat
            onClick={() => onApprove(row?.id, row?.auctionId)}
            className="status Approved"
          >
            {t('approve')}
          </Button>
          <Button
            flat
            onClick={() => onReject(row?.id, row?.auctionId)}
            className="status Rejected"
          >
            {t('reject')}
          </Button>
        </>
      ) : (
        <div className="status">{t(row?.status)}</div>
      )
    },
  },
]
export const dummyDataMht = [
  {
    id: '1',
    status: 'approved',
    title: 'test',
    name: 'test',
    appointmentType: 'In-person',
    data: '',
    time: '',
    note: 'test',
    link: 'link here',
    xLocation: 1,
    yLocation: 1.1,
  },
  {
    id: '1',
    status: 'Pending',
    title: 'test',
    name: 'test',
    appointmentType: 'Online',
    data: '',
    time: '',
    link: '',
  },
]
