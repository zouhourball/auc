import { Button } from 'react-md'

export const configs = [
  {
    label: 'Title',
    key: 'title',
    width: '200',
    // icon: 'mdi mdi-spellcheck',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Location',
    key: 'location',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Company Broker',
    key: 'owner',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Bid Open Date',
    key: 'bidOpenDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Bid Close Date',
    key: 'bidCloseDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Submission Date',
    key: 'submissionDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'status',
    width: '200',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return <div className={`status ${row.status}`}>{row.status}</div>
    },
  },
  {
    label: 'Documents',
    key: 'documents',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
]
export const newBrokersConfigs = [
  {
    label: 'Logo',
    key: 'logo',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Company Name',
    key: 'companyName',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Country',
    key: 'country',
    width: '300',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Address',
    key: 'address',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Email',
    key: 'email',
    width: '300',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Phone No',
    key: 'phone',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Status',
    key: 'status',
    width: '200',
    type: 'text',
    displayInCsv: true,
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
