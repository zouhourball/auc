import { Subheader } from 'react-md'
import { useTranslation } from 'libs/langs'

export const propertyTypeList = () => {
  const { t } = useTranslation()
  // type PropertyCategory uint
  // const (
  // NoCategory             PropertyCategory = 0
  // Residential                             = 1
  // Commercial                              = 2
  // Residential_Commercial                  = 3
  // Industrial                              = 4
  // Agricultural                            = 5
  // Tourism                                 = 6
  // Government                              = 7
  // )
  // type PropertyTypes uint
  // const (
  // NoType        PropertyTypes = 0
  // Home                        = 1
  // Villa                       = 2
  // Apartment                   = 3
  // Hostel                      = 4
  // Land                        = 5
  // Building                    = 6
  // Shop                        = 7
  // Office                      = 8
  // Plot                        = 9
  // Unit                        = 10
  // Farm_House                  = 11
  // Townhouse                   = 12
  // Clinic                      = 13
  // Showroom                    = 14
  // Warehouse                   = 15
  // Complex                     = 16
  // Restaurant                  = 17
  // Cafe                        = 18
  // Full_Floor                  = 19
  // Supermarket                 = 20
  // Hotel                       = 21
  // Staff_Housing               = 22
  // Mixed_Use                   = 23
  // Factory                     = 24
  // Resort                      = 26
  // Park                        = 27
  // )
  return [
    <Subheader
      key={t('resident')}
      primaryText={t('resident')}
      className="md-divider-border md-divider-border--bottom"
    />,
    {
      label: 'Villa',
      value: 2,
    },
    {
      label: 'Apartment',
      value: 3,
    },
    {
      label: 'Farm House',
      value: 11,
    },
    {
      label: 'Townhouse',
      value: 12,
    },
    {
      label: 'Building',
      value: 6,
    },
    <Subheader
      key={t('commercial')}
      primaryText={t('commercial')}
      className="md-divider-border md-divider-border--bottom"
    />,
    {
      label: 'Office',
      value: 8,
    },
    {
      label: 'Shop',
      value: 7,
    },
    {
      label: 'Clinic',
      value: 13,
    },
    {
      label: 'Showroom',
      value: 14,
    },
    {
      label: 'Warehouse',
      value: 15,
    },
    {
      label: 'Complex',
      value: 16,
    },
    {
      label: 'Restaurant',
      value: 17,
    },
    {
      label: 'Cafe',
      value: 18,
    },
    {
      label: 'Hotel',
      value: 21,
    },
    {
      label: 'Full Floor',
      value: 19,
    },
    {
      label: 'Factory',
      value: 24,
    },
    {
      label: 'Staff Housing',
      value: 22,
    },
    {
      label: 'Supermarket',
      value: 20,
    },

    <Subheader
      key={t('land')}
      primaryText={t('land')}
      className="md-divider-border md-divider-border--bottom"
    />,
    {
      label: 'Residential',
      value: 1,
    },
    {
      label: 'Commercial',
      value: 2,
    },
    {
      label: 'Residential Commercial',
      value: 3,
    },

    {
      label: 'Industrial',
      value: 4,
    },
    {
      label: 'Farm',
      value: 5,
    },

    {
      label: 'Mixed Use',
      value: 23,
    },
  ]
}

export const brokerCompanyList = [
  { label: 'broker Company1', value: 1 },
  { label: 'broker Company2', value: 2 },
]
