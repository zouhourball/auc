import { Button } from 'react-md'

export const configs = (t) => [
  {
    label: t('title_label'),
    key: 'title',
    width: '200',
    // icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('location'),
    key: 'location',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Company_Broker'),
    key: 'owner',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Bid_Open_Date'),
    key: 'bidOpenDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Bid_Close_Date'),
    key: 'bidCloseDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Submission_Date'),
    key: 'submissionDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Status'),
    key: 'status',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return <div className={`status ${row.status}`}>{t(row.status)}</div>
    },
  },
  {
    label: t('documents_admin'),
    key: 'documents',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
]
export const newBrokersConfigs = (t) => [
  {
    label: t('Logo'),
    key: 'logo',
    width: '100',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Company_Name'),
    key: 'companyName',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Country'),
    key: 'country',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Address'),
    key: 'address',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Email'),
    key: 'email',
    width: '350',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Phone_No'),
    key: 'phone',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: t('Status'),
    key: 'status',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return <div className={`status ${row.status}`}>{t(row.status)}</div>
    },
  },
]
export const dummyDataMht = (setDocDialog) => [
  {
    title: 'Villa',
    location: 'Muscat',
    owner: 'Mohamed',
    bidOpenDate: '14 Apr 2022',
    bidCloseDate: '14 Apr 2022',
    submissionDate: '14 Apr 2022',
    status: 'New Request',
    documents: (
      <Button flat onClick={() => setDocDialog(true)}>
        View
      </Button>
    ),
  },
  {
    title: 'Villa',
    location: 'Muscat',
    owner: 'Mohamed',
    bidOpenDate: '14 Apr 2022',
    bidCloseDate: '14 Apr 2022',
    submissionDate: '14 Apr 2022',
    status: 'Approved',
    documents: (
      <Button flat onClick={() => setDocDialog(true)}>
        View
      </Button>
    ),
  },
  {
    title: 'Villa',
    location: 'Muscat',
    owner: 'Mohamed',
    bidOpenDate: '14 Apr 2022',
    bidCloseDate: '14 Apr 2022',
    submissionDate: '14 Apr 2022',
    status: 'Rejected',
    documents: (
      <Button flat onClick={() => setDocDialog(true)}>
        View
      </Button>
    ),
  },
]
export const dummyDocs = [
  {
    fileName: 'file 1',
  },
  {
    fileName: 'file 2',
  },
]
