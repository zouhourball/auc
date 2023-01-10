export const configs = (t) => [
  {
    label: t('Status'),
    key: 'status',
    width: '150',
    type: 'text',
    displayInCsv: true,
    render: (row) => {
      return <div className={`status ${row.status}`}>{row.status}</div>
    },
  },
  {
    label: 'Date/Time',
    key: 'createdDate',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Amount',
    key: 'amount',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
  {
    label: 'Track Id',
    key: 'trackId',
    width: '200',
    type: 'text',
    displayInCsv: true,
  },
]

// amount
// :
// "20"
// createdDate
// :
// "10/01/2023 11:29"
// id
// :
// "3b288b3f-7d27-4eeb-8e13-010397b5d5f0"
// status
// :
// "Success"
