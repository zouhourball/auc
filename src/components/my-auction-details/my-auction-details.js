import { useState, useEffect } from 'react'
import { useQuery as useQueryApollo, useSubscription } from 'react-apollo'
import {
  TextField,
  Button,
  FontIcon,
  SelectField,
  MenuButton,
  Checkbox,
  DialogContainer,
} from 'react-md'
import { useQuery, useMutation, useInfiniteQuery } from 'react-query'
import moment from 'moment'
import { DatePicker } from '@target-energysolutions/date-picker'
import { useDispatch } from 'react-redux'
import { navigate } from '@reach/router'

import { addToast } from 'modules/app/actions'
import { propertyTypeList } from 'components/helpers'

import { useTranslation, useCurrentLang } from 'libs/langs'
import store from 'libs/store'
import getBids from 'libs/queries/auction/get-bids.gql'
import subscribeNewBid from 'libs/queries/auction/subscription-new-bid.gql'
import subscribeTimeExtension from 'libs/queries/auction/subscription-time-extension.gql'
// import ContactInfoDialogdays from 'components/contact-info-dialog-days'
import {
  getAuction,
  updateAuction,
  updateApprovedAuction,
  updateImgs,
  getCountry,
  getCity,
  deleteAuctionById,
} from 'libs/api/auctions-api'
import {
  disableAppointments,
  enableAppointments,
} from 'libs/api/appointment-api'
// import { dummyData } from './helpers'

import DrawOnMap from 'components/draw-on-map'
import UploadImages from 'components/upload-images'
import { DueDate } from 'components/due-date'
import ToastMsg from 'components/toast-msg'
import UserInfoBySubject from 'components/user-info-by-subject'
import selectImg from 'images/select-img.png'

import './style.scss'

const MyAuctionDetails = ({ auctionId }) => {
  const { t } = useTranslation()
  const lang = useCurrentLang()
  const dispatch = useDispatch()

  const [keyFeature, setKeyFeature] = useState()
  // const [suggestedKeyPanel, setSuggestedKeysPanel] = useState(false)
  // const [propertyDetails, setPropertyDetails] = useState({})
  const [showMore, setShowMore] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [images, setImages] = useState([])
  const [visibleStartTimePicker, setVisibleStartTimePicker] = useState(false)
  const [timing, setTiming] = useState(false)
  const [addressView, setAddressView] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [appointmentType, setAppointmentType] = useState([])
  const [visibleEndTimePicker, setVisibleEndTimePicker] = useState(false)

  const [auctionEditData, setAuctionEditData] = useState({})
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [page, setPage] = useState(0)
  const [size] = useState(4)

  // get auction details api
  const { data: auctionDetails, refetch: refetchAuction } = useQuery(
    ['auctionDetails', auctionId],
    getAuction,
  )

  const {
    data: getCountryList,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery([25, ''], getCountry, {
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

  const { mutate: deleteMutate } = useMutation(deleteAuctionById, {
    onSuccess: (res) => {
      if (res?.success) {
        navigate('/auctions/my-auctions')
        dispatch(
          addToast(
            <ToastMsg text={'Auction deleted successfully'} type="success" />,
          ),
        )
        refetchAuction()
      } else {
        dispatch(
          addToast(<ToastMsg text={'Something is wrong'} type="error" />),
        )
      }
    },
    onError: (error) => {
      dispatch(
        addToast(
          <ToastMsg text={error?.error || 'Something is wrong'} type="error" />,
        ),
      )
    },
  })
  useEffect(() => {
    const appointmentConfig = auctionDetails?.['viewing_appointements_config']

    setAuctionEditData({
      title: auctionDetails?.listing?.title,
      propertyType: auctionDetails?.listing?.property?.['property_type_id'],
      city: auctionDetails?.listing?.property?.city,
      country: auctionDetails?.listing?.property?.country,
      startDate: auctionDetails?.['auction_start_date'],
      endDate: auctionDetails?.['auction_end_date'],
      startingPrice: auctionDetails?.['starting_price'],
      incrementalPrice: auctionDetails?.['incremental_price'],
      description: auctionDetails?.description,
      keyFeatures: auctionDetails?.listing?.features?.map((el) => el?.feature),
      address: {
        meta: { display_name: auctionDetails?.listing?.property?.address },
      },
      allowAppointment: auctionDetails?.['allow_viewing_request'],
      appointmentDetails: {
        selected_days:
          appointmentConfig?.length > 0
            ? appointmentConfig?.[appointmentConfig?.length - 1]?.[
                'selected_days'
              ]?.split(',')
            : [],
        start_at:
          appointmentConfig?.length > 0
            ? appointmentConfig?.[appointmentConfig?.length - 1]?.['start_at']
            : '',
        end_at:
          appointmentConfig?.length > 0
            ? appointmentConfig?.[appointmentConfig?.length - 1]?.['end_at']
            : '',
        type: appointmentConfig?.[appointmentConfig?.length - 1]?.['type'],
        general_location_x:
          appointmentConfig?.length > 0
            ? +appointmentConfig?.[appointmentConfig?.length - 1]?.[
                'general_location_x'
              ]
            : 0,
        general_location_y:
          appointmentConfig?.length > 0
            ? +appointmentConfig?.[appointmentConfig?.length - 1]?.[
                'general_location_y'
              ]
            : 0,
        appointment_address:
          appointmentConfig?.length > 0
            ? appointmentConfig?.[appointmentConfig?.length - 1]?.[
                'appointment_address'
              ]
            : '',
      },
    })
    setImages(auctionDetails?.listing?.images)
    const type =
      appointmentConfig?.length > 0
        ? appointmentConfig?.[appointmentConfig?.length - 1]?.type === 'Both'
          ? ['In-person', 'Online']
          : [appointmentConfig?.[appointmentConfig?.length - 1]?.type]
        : []
    setAppointmentType(type)
  }, [auctionDetails])
  const { data: getCityList } = useQuery(
    ['getCity', auctionEditData?.country?.id],
    getCity,
  )
  const { data: biddersList, refetch: refetchBids } = useQueryApollo(getBids, {
    context: { uri: `${PRODUCT_APP_URL_API}/auction/graphql/query` },
    variables: { auctionUUID: auctionId, page, size },
  })
  const { data: subNewBid } = useSubscription(subscribeNewBid, {
    variables: { auctionID: auctionId },
    // uri: `${appUrl}/auction/graphql/query`,
  })
  const { data: timeExtension } = useSubscription(subscribeTimeExtension, {
    variables: { auctionID: auctionId },
  })
  useEffect(() => {
    refetchBids()
  }, [subNewBid, timeExtension])

  // useEffect(() => {
  //   setPropertyDetails({
  //     ...dummyBiddersData,
  //   })
  // }, [dummyBiddersData])

  const onSetFormDetails = (property, value, subkey) => {
    subkey
      ? setAuctionEditData((prev) => ({
        ...prev,
        [property]: {
          ...prev?.[property],
          [subkey]: value,
        },
      }))
      : setAuctionEditData({ ...auctionEditData, [property]: value })
  }
  const handleRemoveKey = (key) => {
    onSetFormDetails(
      'keyFeatures',
      auctionEditData?.keyFeatures.filter((el) => el?.name !== key?.name),
    )
  }
  const downloadToken = store?.getState()?.app?.dlToken
  const renderCountry = () => {
    let arrayName = []
    if (getCountryList) {
      arrayName = getCountryList?.pages
        ?.flatMap((el) => el?.results)
        ?.map((ac) => {
          return {
            label: lang === 'ar' ? ac?.['name_ar'] : ac?.['name_en'],
            value: `${ac?.id}`,
          }
        })
      if (
        !arrayName?.find((el) => el?.value === auctionEditData?.country?.id)
      ) {
        arrayName = [
          ...arrayName,
          {
            label:
              lang === 'ar'
                ? auctionEditData?.country?.['name_ar']
                : auctionEditData?.country?.['name_en'],
            value: `${auctionEditData?.country?.id}`,
          },
        ]
      }
      return arrayName
    }
  }
  const renderCity = () => {
    let arrayName = []
    if (getCityList) {
      arrayName = getCityList?.results?.map((ac) => {
        return {
          label: lang === 'ar' ? ac?.['name_ar'] : ac?.['name_en'],
          value: `${ac?.id}`,
        }
      })
      if (!arrayName?.find((el) => el?.value === auctionEditData?.city?.id)) {
        arrayName = [
          ...arrayName,
          {
            label:
              lang === 'ar'
                ? auctionEditData?.city?.['name_ar']
                : auctionEditData?.city?.['name_en'],
            value: `${auctionEditData?.city?.id}`,
          },
        ]
      }
      return arrayName
    }
  }

  const ref = document.getElementsByClassName('country-list')
  const [test, setTest] = useState(0)
  useEffect(() => {
    ref[0] && ref[0].addEventListener('scroll', updateOffsetAndRefetch)

    return () =>
      ref[0] && ref[0].removeEventListener('scroll', updateOffsetAndRefetch)
  }, [test])

  const updateOffsetAndRefetch = () => {
    if (ref[0].scrollHeight - ref[0].scrollTop <= ref[0].clientHeight) {
      hasNextPage && fetchNextPage()
    }
  }

  // const renderSuggestedKeys = () => {
  //   return auctionEditData?.keyFeatures?.map((key, i) => (
  //     <Checkbox
  //       key={i}
  //       id={key?.uuid}
  //       checked={
  //         !!auctionEditData?.keyFeatures?.find((el) => el.name === key.name)
  //       }
  //       onChange={(v) =>
  //         v
  //           ? onSetFormDetails('keyFeatures', [
  //             ...auctionEditData?.keyFeatures,
  //             { name: key.name, status: 'new' },
  //           ])
  //           : handleRemoveKey(key)
  //       }
  //       className="md-cell md-cell--3"
  //       label={key?.name}
  //     />
  //   ))
  // }
  const addKeyFeature = () => {
    setKeyFeature('')
    onSetFormDetails('keyFeatures', [
      ...auctionEditData?.keyFeatures,
      { name: keyFeature, status: 'new' },
    ])
  }

  const renderNewKeys = () => {
    return auctionEditData?.keyFeatures?.map((updatedKey, index) => (
      <div key={index} className="chipWrapper-item">
        <span className="label">{updatedKey?.name}</span>
        <FontIcon primary onClick={() => handleRemoveKey(updatedKey)}>
          {t('close')}
        </FontIcon>
      </div>
    ))
  }

  const renderImages = () =>
    images?.map((el, i) => (
      <img
        key={i}
        src={`${el.url}?token=${downloadToken}&view=true`}
        className="auction-details-img"
      />
    ))
  const isClosed = +moment.utc(auctionDetails?.['auction_end_date']) < +moment()
  const renderBidders = () =>
    biddersList?.bids?.items?.map((el, index) => (
      <UserInfoBySubject key={el?.id} subject={el?.sub}>
        {(res) => (
          <div
            key={el?.id}
            className={`auction-details-table-row ${
              page === 0 && index === 0 && isClosed ? 'highlighted' : ''
            }`}
          >
            <div>{res?.fullName}</div>
            <div>{res?.email}</div>
            <div>{res?.phoneMobile}</div>
            <div>{moment(el?.date * 1000).format('DD MMM YYYY')}</div>
            <div>{moment(el?.date * 1000).format('hh:mm')}</div>
            <div>{el?.amount}</div>
          </div>
        )}
      </UserInfoBySubject>
    ))
  const setListImages = (newImages, keyAction, fileId) => {
    if (keyAction === 'delete') {
      setImages((imgs) => imgs?.filter((el) => el.url !== fileId))
    } else if (keyAction === 'add') {
      setImages((imgs) => [...imgs, ...newImages])
    } else {
      setImages(newImages)
    }
  }
  // update auction details
  const disableAppointment = useMutation(
    disableAppointments,
    // {
    //   onSuccess: (res) => {
    //     if (!res.error) {
    //       refetchAuction()
    //       dispatch(
    //         addToast(
    //           <ToastMsg
    //             text={'Appointment feature has been disabled' || 'success'}
    //             type="success"
    //           />,
    //         ),
    //       )
    //     } else {
    //       dispatch(
    //         addToast(
    //           <ToastMsg
    //             text={res.error?.body?.message || 'An Error has occurred'}
    //             type="error"
    //           />,
    //         ),
    //       )
    //     }
    //   },
    // },
  )
  const enableAppointment = useMutation(
    enableAppointments,
    // {
    //   onSuccess: (res) => {
    //     if (!res.error) {
    //       refetchAuction()
    //       dispatch(
    //         addToast(
    //           <ToastMsg
    //             text={'Appointment feature has been enabled' || 'success'}
    //             type="success"
    //           />,
    //         ),
    //       )
    //     } else {
    //       dispatch(
    //         addToast(
    //           <ToastMsg
    //             text={res.error?.body?.message || 'An Error has occurred'}
    //             type="error"
    //           />,
    //         ),
    //       )
    //     }
    //   },
    // },
  )
  const updateAuctionData = useMutation(
    auctionDetails?.status === 'Approved'
      ? updateApprovedAuction
      : updateAuction,
    {
      onSuccess: (res) => {
        if (!res.error) {
          refetchAuction()
          dispatch(
            addToast(
              <ToastMsg
                text={'Auction is updated successfully' || 'success'}
                type="success"
              />,
            ),
          )
          onDisableEdit()
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'error'}
                type="error"
              />,
            ),
          )
        }
      },
    },
  )
  const updateImages = useMutation(updateImgs, {
    onSuccess: (res) => {
      if (!res.error) {
        onDisableEdit()
      }
    },
  })
  const saveChanges = () => {
    // test status
    updateAuctionData.mutate({
      uuid: auctionId,
      body: {
        // ...updateAuctionFormatData(auctionDetails),
        title: auctionEditData?.title,
        auction_start_date: new Date(auctionEditData?.startDate),
        auction_end_date: new Date(auctionEditData?.endDate),
        incremental_price: +auctionEditData?.incrementalPrice,
        starting_price: +auctionEditData?.startingPrice,
        property_type: +auctionEditData?.propertyType,
        property_description: auctionEditData?.description,
        features: auctionEditData?.keyFeatures,
        city_id: +auctionEditData?.city?.id,
        country_id: +auctionEditData?.country?.id,
        address: auctionEditData?.address?.meta?.['display_name'],
        general_location_x: +auctionDetails?.address?.['general_location_x'],
        general_location_y: +auctionDetails?.address?.['general_location_y'],
        // appointment_config: { ...auctionEditData?.appointmentDetails },
      },
    })
    auctionEditData?.allowAppointment
      ? disableAppointment.mutate({
        uuid: auctionId,
      })
      : enableAppointment.mutate({
        uuid: auctionId,
        body: { ...auctionEditData?.appointmentDetails },
      })
    updateImages.mutate({
      uuid: auctionId,
      body: images,
    })
  }
  const onDisableEdit = () => {
    setEditMode(!editMode)
    setShowDatePicker(false)
  }
  const renderPaginationButtons = (indexToShowBtn) => {
    let buttonsArray = []
    let totalPages = Math.ceil(+biddersList?.bids?.total / size)
    for (let index = 0; index < totalPages; index++) {
      if (index < 3) {
        buttonsArray.push(
          <Button
            className={`table-paginator-btn ${index === page ? 'active' : ''}`}
            onClick={() => setPage(index)}
            flat
          >
            {index + 1}
          </Button>,
        )
      } else break
    }
    if (indexToShowBtn && indexToShowBtn < totalPages) {
      buttonsArray.push(
        <span>...</span>,
        <Button
          className={`table-paginator-btn ${
            indexToShowBtn - 1 === page ? 'active' : ''
          }`}
          onClick={() => setPage(indexToShowBtn - 1)}
          flat
        >
          {indexToShowBtn}
        </Button>,
      )
    }
    if (totalPages > 3) {
      buttonsArray.push(
        <span>...</span>,
        <Button
          className={`table-paginator-btn ${
            totalPages - 1 === page ? 'active' : ''
          }`}
          onClick={() => setPage(totalPages - 1)}
          flat
        >
          {totalPages}
        </Button>,
      )
    }
    return buttonsArray
  }
  // const onHandleDate = (date, key) => {
  //   setAuctionEditData({
  //     ...auctionEditData,
  //     [key]: moment(date.timestamp).format('DD MMM YYYY'),
  //   })
  //   setShowDatePicker({ ...showDatePicker, [key]: false })
  // }
  const weekDays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const onDisableAppointment = () => {
    setAuctionEditData((prev) => ({
      ...prev,
      allowAppointment: !prev?.allowAppointment,
    }))
    //  enableAppointment.mutate({
    //   uuid: auctionId,
    // })
  }
  const onSetDate = (start, end) => {
    setAuctionEditData({
      ...auctionEditData,
      startDate: start,
      endDate: end,
    })
  }
  useEffect(() => {
    appointmentType?.length > 0
      ? setAuctionEditData((prev) => {
        return appointmentType?.length === 2
          ? {
            ...prev,
            appointmentDetails: {
              ...prev?.appointmentDetails,
              type: 'Both',
            },
          }
          : (appointmentType?.includes('In-person') && {
            ...prev,
            appointmentDetails: {
              ...prev?.appointmentDetails,
              type: 'In-person',
            },
          }) ||
                (appointmentType?.includes('Online') && {
                  ...prev,
                  appointmentDetails: {
                    ...prev?.appointmentDetails,
                    type: 'Online',
                  },
                })
      })
      : setAuctionEditData((prev) => ({
        ...prev,
        appointmentDetails: {
          ...prev?.appointmentDetails,
          type: '',
        },
      }))
  }, [appointmentType])

  const appointmentsTypeList = [
    <Checkbox
      key={'in-person'}
      id={`in-person`}
      label={'In-person'}
      onChange={() => {
        setAppointmentType((prev) =>
          prev?.includes('In-person')
            ? prev?.filter((el) => el !== 'In-person')
            : [...prev, 'In-person'],
        )
      }}
      checked={appointmentType?.includes('In-person')}
    />,
    <Checkbox
      key={'online'}
      id={`online`}
      label={'Online'}
      onChange={() => {
        setAppointmentType((prev) =>
          prev?.includes('Online')
            ? prev?.filter((el) => el !== 'Online')
            : [...prev, 'Online'],
        )
      }}
      checked={appointmentType?.includes('Online')}
    />,
  ]
  return (
    <div className="auction-list">
      <div className="auction-list-header">
        <div className="title">{t('auctions_details')}</div>
      </div>
      <div className="auction-details-info">
        <div className="auction-details-form">
          <div className="column">
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('title_label')}
              </label>
              <TextField
                id={'title'}
                value={auctionEditData?.title}
                disabled={!editMode}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, title: v })
                }
                className="auction-details-form-textField"
                block
              />
            </div>
            {/* <TextField
                  id={'property-type'}
                  label={t('property_type_label')}
                  value={auctionEditData?.propertyType}
                  onChange={(v) =>
                    setAuctionEditData({ ...auctionEditData, propertyType: v })
                  }
                  disabled={!editMode}
                  className="auction-details-form-textField"
                  block
                /> */}
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('property_type_label')}
              </label>
              <SelectField
                id="select-field-with-elements-country-spinner"
                // label={t('country')}
                disabled={!editMode}
                placeholder={t('property_select')}
                menuItems={propertyTypeList?.map((el) =>
                  el?.props ? (
                    <div>{t(el?.props?.text)}</div>
                  ) : (
                    { label: el?.label, value: el?.value }
                  ),
                )}
                value={auctionEditData?.propertyType}
                onChange={(propertyType) =>
                  onSetFormDetails('propertyType', propertyType)
                }
                fullWidth
                position={SelectField.Positions.BELOW}
                dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
                className="selectField-lined"
              />
            </div>
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('address_label')}
              </label>
              <TextField
                id={'address'}
                value={auctionEditData?.address?.meta?.['display_name']}
                disabled={!editMode}
                className="auction-details-form-textField"
                onClick={() => setAddressView(true)}
                block
              />

              {addressView && (
                <DrawOnMap
                  id={'address'}
                  onClose={() => {
                    setAddressView(false)
                  }}
                  visible={addressView}
                  onSetAddress={(newCoordinates) => {
                    setAuctionEditData({
                      ...auctionEditData,
                      address: {
                        general_location_y: newCoordinates?.['lat'],
                        general_location_x: newCoordinates?.['lon'],
                        meta: newCoordinates,
                      },
                    })
                  }}
                />
              )}
            </div>
          </div>
          {/* <TextField
            id={'city'}
            label={t('city_label')}
            value={auctionEditData?.city}
            onChange={(v) =>
              setAuctionEditData({ ...auctionEditData, city: v })
            }
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          /> */}
          <div className="column">
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('city_select')}:
              </label>
              <SelectField
                id="select-field-with-elements-country-spinner"
                onClick={() => setTest(1)}
                // placeholder={t('city_select')}
                menuItems={renderCity()}
                value={auctionEditData?.city?.id}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, city: { id: v } })
                }
                fullWidth
                disabled={!editMode}
                position={SelectField.Positions.BELOW}
                dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
                className="selectField-lined"
              />
            </div>
            {/* <TextField
            id={'auctionEditData'}
            label={t('coundivy_label')}
            value={auctionEditData?.country}
            disabled={!editMode}
            className="auction-details-form-textField"
            block
          /> */}
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('coundivy_label')}
              </label>
              <SelectField
                id={'auctionEditData'}
                onClick={() => setTest(1)}
                // label={t('coundivy_label')}
                // placeholder={t('select_country')}
                listClassName="country-list"
                menuItems={renderCountry()}
                value={auctionEditData?.country?.id || 1}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, country: { id: v } })
                }
                fullWidth
                disabled={!editMode}
                position={SelectField.Positions.BELOW}
                dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
                className="selectField-lined"
              />
            </div>
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('start_end_dates_label')}
              </label>
              <TextField
                id={'start-end-date'}
                value={`${moment(auctionEditData?.startDate).format(
                  'DD/MM/YYYY',
                )} - ${moment(auctionEditData?.endDate).format('DD/MM/YYYY')}`}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, startDate: v })
                }
                onClick={() => {
                  editMode && setShowDatePicker(true)
                }}
                disabled={!editMode}
                className="auction-details-form-textField"
                block
              />
              {showDatePicker && (
                // <DatePicker
                //   singlePick
                //   translation={{ update: 'select' }}
                //   onUpdate={(date) => onHandleDate(date, 'startDate')}
                //   onCancel={() =>
                //     setShowDatePicker({ ...showDatePicker, startDate: false })
                //   }
                //   minValidDate={{ timestamp: new Date().getTime() }}
                //   startView="year"
                //   endView="day"
                // />
                <div className="date-picker">
                  <DueDate
                    duedate={showDatePicker?.endDate}
                    startDate={showDatePicker?.startDate}
                    applicationStartDate={showDatePicker?.startDate}
                    onDateChange={(start, end) => {
                      let startD = new Date(
                        moment(start)
                          .hour(moment(showDatePicker?.startTime).hour())
                          .minute(moment(showDatePicker?.startTime).minute())
                          .valueOf(),
                      )
                      let endD = new Date(
                        moment(end)
                          .hour(moment(showDatePicker?.endTime).hour())
                          .minute(moment(showDatePicker?.endTime).minute())
                          .valueOf(),
                      )
                      onSetDate(startD, endD)
                      setShowDatePicker(!showDatePicker)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="column">
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('start_end_time_label')}
              </label>
              <TextField
                id={'start-end-time'}
                value={`${moment(auctionEditData?.startDate).format(
                  'HH:mm',
                )} - ${moment(auctionEditData?.endDate).format('HH:mm')}`}
                // onChange={(v) =>
                //   setAuctionEditData({ ...auctionEditData, endDate: v })
                // }
                onClick={() => {
                  editMode && setVisibleStartTimePicker(true)
                }}
                disabled={!editMode}
                className="auction-details-form-textField"
                block
              />
              {visibleStartTimePicker && (
                <div className="date-picker">
                  <DatePicker
                    startView="time"
                    endView="time"
                    singlePick={true}
                    minuteInterval={5}
                    timeFormat={null}
                    onUpdate={({ timestamp }) => {
                      setAuctionEditData({
                        ...auctionEditData,
                        startDate: new Date(
                          moment(auctionEditData?.startDate)
                            .hour(moment(timestamp).hour())
                            .minute(moment(timestamp).minute())
                            .valueOf(),
                        ),
                      })
                      // setVisibleStartTimePicker(false)
                    }}
                    onCancel={() => setVisibleStartTimePicker(false)}
                    translation={{ date: 'Time' }}
                  />
                  <DatePicker
                    startView="time"
                    endView="time"
                    singlePick={true}
                    minuteInterval={5}
                    timeFormat={null}
                    onUpdate={({ timestamp }) => {
                      setAuctionEditData({
                        ...auctionEditData,
                        endDate: new Date(
                          moment(auctionEditData?.endDate)
                            .hour(moment(timestamp).hour())
                            .minute(moment(timestamp).minute())
                            .valueOf(),
                        ),
                      })
                      setVisibleStartTimePicker(false)
                    }}
                    onCancel={() => setVisibleStartTimePicker(false)}
                    translation={{ date: 'Time' }}
                  />
                </div>
              )}
              {/* {showDatePicker.endDate && (
              <DatePicker
                singlePick
                translation={{ update: 'select' }}
                onUpdate={(date) => onHandleDate(date, 'endDate')}
                onCancel={() =>
                  setShowDatePicker({ ...showDatePicker, endDate: false })
                }
                minValidDate={{ timestamp: new Date().getTime() }}
                startView="year"
                endView="day"
              />
            )} */}
            </div>
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                {t('starting_price_label')}
              </label>
              <TextField
                id={'starting-price'}
                value={auctionEditData?.startingPrice + ' OMR'}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, startingPrice: v })
                }
                disabled={!editMode}
                className="auction-details-form-textField"
                block
              />
            </div>
            <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
              <label className="auction-details-form-label">
                <span>{t('incremental_price_label')}</span>
              </label>

              <TextField
                id={'incremental-price'}
                value={auctionEditData?.incrementalPrice + ' OMR'}
                onChange={(v) =>
                  setAuctionEditData({
                    ...auctionEditData,
                    incrementalPrice: v,
                  })
                }
                disabled={!editMode}
                className="auction-details-form-textField"
                block
              />
            </div>
          </div>
        </div>
        {/* <Button onClick={() => onDisableEdit()} icon primary>
          more_vert
        </Button> */}
        <MenuButton
          id="menu-button-2"
          className="top-bar-menu"
          icon
          iconChildren={<FontIcon>more_vert</FontIcon>}
          listClassName={'edit-list'}
          menuItems={
            <div className="top-bar-menu-items">
              <Button onClick={() => onDisableEdit()}>
                {t('edit_details')}
              </Button>
              {+biddersList?.bids?.total > 0 && (
                <Button onClick={() => setConfirmDialog(true)}>
                  {t('delete_auction')}
                </Button>
              )}
            </div>
          }
          centered
          anchor={{
            x: MenuButton.HorizontalAnchors.CENTER,
            y: MenuButton.VerticalAnchors.CENTER,
          }}
          position={MenuButton.Positions.BOTTOM_RIGHT}
        ></MenuButton>
      </div>
      {showMore && (
        <div className="auction-details-details">
          {editMode ? (
            <>
              <TextField
                id={'description'}
                label={t('description_label')}
                value={auctionEditData?.description}
                onChange={(v) =>
                  setAuctionEditData({ ...auctionEditData, description: v })
                }
                className="auction-details-description-textField"
                block
                rows="3"
              />
              <TextField
                id="feature"
                placeholder={t('key_features_placeholder')}
                value={keyFeature}
                onChange={(value) => setKeyFeature(value)}
                className="auction-details-description-textField"
                // onClick={() => {
                //   setSuggestedKeysPanel(true)
                // }}
                block
                rightIcon={
                  <Button
                    flat
                    primary
                    className="add-btn"
                    onClick={addKeyFeature}
                    disabled={!keyFeature}
                    iconChildren="add"
                  >
                    {t('add')}
                  </Button>
                }
              />
              {/* {suggestedKeyPanel && (
                <div className="feature-field-list">
                  {renderSuggestedKeys()}
                </div>
              )} */}
              <div className="chipWrapper">{renderNewKeys()}</div>
              <UploadImages
                cover
                multiple={true}
                title={
                  <>
                    <span className="drop-zone-placeholder">
                      {t('drag_and_drop')}
                      <b>{t('select_file')}</b>
                    </span>
                  </>
                }
                setListFiles={(files, keyAction, fileId) =>
                  setListImages(files, keyAction, fileId)
                }
                listFiles={images}
                iconDelete={true}
                titleContent={t('property_images')}
                addTitle={
                  <>
                    <FontIcon>add</FontIcon>
                    <span>{t('add_images')}</span>
                  </>
                }
                titleUpload={images?.length > 0 ? 'add_images' : ''}
                icon={<img src={selectImg} width="20px" />}
                accept="image/jpeg, image/png, image/jpg"
                className="custom"
              />
            </>
          ) : (
            <>
              <div className="auction-details-description">
                <label>{t('description_label')}</label>
                <span>{auctionEditData?.description}</span>
              </div>
              <div className="auction-details-subTitle">{'key features'}</div>
              <div className="chipWrapper">{renderNewKeys()}</div>
              <div className="auction-details-subTitle">
                {t('property_images')}
              </div>
              <div className="auction-details-imagesWrapper">
                {renderImages()}
              </div>
            </>
          )}
          {/* APPOINTMENT PART */}
          <div className="auction-details-subTitle">{t('appointments')}</div>
          <Checkbox
            id={`request-viewing`}
            name={`request-viewing-checkboxes`}
            label={t('request_viewing')}
            disabled={!editMode}
            checked={auctionEditData?.allowAppointment}
            onChange={() => onDisableAppointment()}
          />
          <div className="auction-details-form">
            <div className="column">
              <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
                <label className="auction-details-form-label">
                  {t('type_of_appointment')}:
                </label>
                <SelectField
                  id={'auctionEditData'}
                  onClick={() => setTest(1)}
                  placeholder={`${
                    appointmentType?.length
                      ? appointmentType?.join(', ')
                      : 'Select appointment type'
                  }`}
                  listClassName="country-list"
                  menuItems={appointmentsTypeList}
                  value={appointmentType?.join(', ')}
                  fullWidth
                  disabled={!editMode}
                  position={SelectField.Positions.BELOW}
                  dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
                  className="selectField-lined"
                />
              </div>
              <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
                <label className="auction-details-form-label">
                  {t('timing')}:
                </label>
                <TextField
                  id="time-start"
                  placeholder={'Select from'}
                  block
                  value={
                    auctionEditData?.appointmentDetails?.['start_at'] &&
                    moment(
                      auctionEditData?.appointmentDetails?.['start_at'],
                    ).format('HH:mm')
                  }
                  disabled={!editMode}
                  onClick={() => editMode && setTiming(true)}
                  className="auction-details-form-textField"
                />
                {timing && (
                  <DatePicker
                    startView="time"
                    endView="time"
                    singlePick={true}
                    minuteInterval={5}
                    timeFormat={null}
                    onUpdate={({ timestamp }) => {
                      onSetFormDetails(
                        'appointmentDetails',
                        moment(timestamp).toISOString(),
                        'start_at',
                      )
                      setTiming(false)
                    }}
                    onCancel={() => setTiming(false)}
                    translation={{ date: 'Time' }}
                    onReset={() => {
                      onSetFormDetails(
                        'appointmentDetails',
                        moment().toISOString(),
                        'start_at',
                      )
                      setTiming(false)
                    }}
                  />
                )}
                <TextField
                  id="time-start"
                  placeholder={'Select from'}
                  block
                  disabled={!editMode}
                  value={
                    auctionEditData?.appointmentDetails?.['end_at'] &&
                    moment(
                      auctionEditData?.appointmentDetails?.['end_at'],
                    ).format('HH:mm')
                  }
                  onClick={() => editMode && setVisibleEndTimePicker(true)}
                  className="auction-details-form-textField"
                />
                {visibleEndTimePicker && (
                  <DatePicker
                    startView="time"
                    endView="time"
                    singlePick={true}
                    minuteInterval={5}
                    timeFormat={null}
                    onUpdate={({ timestamp }) => {
                      onSetFormDetails(
                        'appointmentDetails',

                        moment(auctionEditData?.endDate)
                          .hour(moment(timestamp).hour())
                          .minute(moment(timestamp).minute())
                          .toISOString(),
                        'end_at',
                      )
                      setVisibleEndTimePicker(false)
                    }}
                    onCancel={() => setVisibleEndTimePicker(false)}
                    translation={{ date: 'Time' }}
                    onReset={() => {
                      onSetFormDetails(
                        'appointmentDetails',
                        moment().toISOString(),
                        'end_at',
                      )
                      setVisibleEndTimePicker(false)
                    }}
                  />
                )}
              </div>
            </div>
            <div className="column">
              {appointmentType?.includes('In-person') && (
                <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
                  <label className="auction-details-form-label">
                    {t('location')}:
                  </label>
                  <TextField
                    id="auctionAddress"
                    placeholder={t('auction_position')}
                    value={
                      auctionEditData?.appointmentDetails?.[
                        'appointment_address'
                      ]
                    }
                    disabled={
                      // !auctionEditData?.appointmentDetails?.[
                      //   'appointment_address'
                      // ] ||
                      !editMode
                    }
                    onChange={(value) =>
                      onSetFormDetails(
                        'appointmentDetails',
                        value,
                        'appointment_address',
                      )
                    }
                    className="auction-details-form-textField"
                    block
                  />
                  <Button
                    icon
                    primary
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddressView(!addressView)
                    }}
                  />
                </div>
              )}
              <div className={`row  ${editMode ? 'underlined' : 'outlined'}`}>
                <label className="auction-details-form-label">
                  {t('daysFull')}:
                </label>
                <SelectField
                  id="select-field-with-elements-country-spinner"
                  placeholder={`${
                    auctionEditData?.appointmentDetails?.['selected_days']
                      ?.length
                      ? auctionEditData?.appointmentDetails?.[
                          'selected_days'
                        ]?.join('-')
                      : 'Select Days type'
                  }`}
                  listClassName="country-list"
                  menuItems={weekDays?.map((day) => (
                    <Checkbox
                      key={day}
                      id={`day-${day}`}
                      label={day}
                      onChange={() => {
                        onSetFormDetails(
                          'appointmentDetails',
                          auctionEditData?.appointmentDetails?.[
                            'selected_days'
                          ]?.includes(day)
                            ? auctionEditData?.appointmentDetails?.[
                                'selected_days'
                              ]?.filter((el) => el !== day)
                            : [
                              ...auctionEditData?.appointmentDetails?.[
                                  'selected_days'
                                ],
                              day,
                            ],
                          'selected_days',
                        )
                      }}
                      checked={auctionEditData?.appointmentDetails?.[
                        'selected_days'
                      ]?.includes(day)}
                    />
                  ))}
                  value={auctionEditData?.appointmentDetails?.[
                    'selected_days'
                  ]?.join('-')}
                  fullWidth
                  position={SelectField.Positions.BELOW}
                  dropdownIcon={<FontIcon>keyboard_arrow_down</FontIcon>}
                  className="selectField-lined"
                  disabled={!editMode}
                />
              </div>
            </div>
          </div>

          {/* <TextField
              id="days"
              placeholder={'Select days'}
              block
              inlineIndicator={<FontIcon primary>schedule</FontIcon>}
              value={auctionEditData?.appointmentDetails?.[
                'selected_days'
              ]?.join('-')}
              onClick={() => editMode && setVisibleDaysPicker(true)}
              className="textField-withShadow"
              disabled={!editMode}
            />
            {visibleDaysPicker && (
              <ContactInfoDialogdays
                visible={visibleDaysPicker}
                onHide={() => setVisibleDaysPicker(false)}
                onConfirm={(days) =>
                  onSetFormDetails('appointmentDetails', days, 'selected_days')
                }
                checkedDays={
                  auctionEditData?.appointmentDetails?.['selected_days'] || []
                }
              />
            )} */}
        </div>
      )}
      <div className="auction-details-buttonWrapper">
        <Button
          iconChildren={showMore ? 'expand_less' : 'expand_more'}
          iconBefore={showMore}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Less' : 'More'}
        </Button>
      </div>
      {editMode && (
        <div className="actions">
          <Button className="cancelBtn" onClick={() => onDisableEdit()}>
            Cancel
          </Button>
          <Button
            className="saveBtn"
            onClick={() => {
              saveChanges()
              onDisableEdit()
            }}
          >
            Save
          </Button>
        </div>
      )}
      {renderBidders()?.length > 0 && (
        <div className="auction-details-bidderWrapper">
          <div className="auction-details-subTitle">{t('bidders_list')}</div>
          <div className="auction-details-table">
            <div className="auction-details-table-header">
              <div>{t('bidder_name')}</div>
              <div>{t('email')}</div>
              <div>{t('phone_number')}</div>
              <div>{t('bid_date')}</div>
              <div>{t('bid_time')}</div>
              <div>{t('bid_amount')}</div>
            </div>
            {renderBidders()}
          </div>
          {+biddersList?.bids?.total > size && (
            <div className="table-paginator">
              <Button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 0}
                icon
                className="table-paginator-arrowBtn"
              >
                {lang === 'ar' ? 'arrow_right' : 'arrow_left'}
              </Button>
              {page < 3
                ? renderPaginationButtons()
                : renderPaginationButtons(page + 1)}
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                icon
                className="table-paginator-arrowBtn"
                disabled={!(+biddersList?.bids?.total - (page + 1) * size > 0)}
              >
                {lang === 'ar' ? 'arrow_left' : 'arrow_right'}
              </Button>
            </div>
          )}
        </div>
      )}
      <DialogContainer
        className="confirm-dialog"
        visible={confirmDialog}
        onHide={() => setConfirmDialog(false)}
        id="confirm-dialog"
        focusOnMount={false}
        actions={[
          <Button key={'cancel-btn'} onClick={() => setConfirmDialog(false)}>
            {t('cancel')}
          </Button>,
          <Button
            key={'delete-btn'}
            onClick={() => deleteMutate({ auctionId })}
          >
            {t('delete')}
          </Button>,
        ]}
      >
        <div>{t('are_you_sure_you_want_to_delete_this_auction')}</div>
      </DialogContainer>
    </div>
  )
}
export default MyAuctionDetails
