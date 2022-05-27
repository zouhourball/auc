import cadreLogo from 'images/meera_cadre_logo_m.svg'
import reachLogo from 'images/meera_reach_logo_m.svg'
import amsLogo from 'images/meera_ams_logo_m.svg'
import ldrLogo from 'images/meera_ldr_logo_m.svg'
import mdrLogo from 'images/meera_mdr_logo_m.svg'
import insightLogo from 'images/meera_insight_logo_m.svg'

export const dayUnit = 1000 * 60 * 60 * 24

export const MonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const costrecoveryFilters = [
  {
    type: 'check',
    label: 'Year',
    field: 'year',
  },
  {
    type: 'check',
    label: 'Month',
    field: 'month',
    validForReportType: ['PRODUCTION'],
  },
]

export const flaringFilters = [
  {
    type: 'check',
    label: 'year',
    field: 'year',
    validForReportType: [
      'MONTHLY STATION',
      'DAILY',
      'MONTHLY',
      'ANNUAL FORECAST',
    ],
  },
  {
    type: 'check',
    label: 'month',
    field: 'month',
    validForReportType: ['MONTHLY STATION', 'MONTHLY'],
  },
]

export const downstreamFilters = [
  {
    type: 'check',
    label: 'year',
    field: 'year',
  },
  {
    type: 'check',
    label: 'Month',
    field: 'month',
  },
]

export const inventoryFilters = [
  {
    type: 'check',
    label: 'year',
    field: 'year',
    validForReportType: ['BASE', 'DISPOSAL', 'TRANSFER'],
  },
]

export const planningFilters = [
  {
    type: 'check',
    label: 'year',
    field: 'year',
  },
  {
    type: 'check',
    label: 'category',
    field: 'category',
  },
]

export const productionFilters = [
  {
    type: 'check',
    label: 'year',
    field: 'year',
    validForReportType: ['monthly', 'tracking'],
  },
  {
    type: 'check',
    label: 'month',
    field: 'month',
    validForReportType: ['monthly', 'tracking'],
  },
]

export const reservesFilters = [
  {
    type: 'check',
    label: 'year',
    field: 'year',
  },
  {
    type: 'check',
    label: 'Hydrocarbon Type',
    field: 'hydrocarbonType',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Cluster',
    field: 'cluster',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Field',
    field: 'field',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Group',
    field: 'group',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Formation',
    field: 'formation',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
  {
    type: 'check',
    label: 'Member',
    field: 'member',
    filterBy: 'block',
    validForReportType: ['annual-resource'],
  },
]

export const processDetail = {
  costRecovery: {
    PRODUCTION: 'costProdLiftingView',
    AFFILIATE: 'costAffiliateView',
    CONTRACTS: 'costContractsView',
    FINANCIALS: 'costView',
  },
  inventoryManagment: {
    BASE: 'inventoryBaseView',
    CONSUMPTION: 'consumptionTransactionView',
    SURPLUS: 'surplusTransactionView',
    TRANSFER: 'assetTransferView',
    DISPOSAL: 'assetDisposalView',
  },
  downstream: {
    LPG: 'downstreamLpgView',
    NG: 'downstreamNgView',
    PP: 'downstreamRsView',
  },
  planning: {
    wpb: 'wpbView',
    fyp: 'fypView',
  },
  production: {
    daily: 'dailyProductionView',
    monthly: 'monthlyProductionView',
  },
  permit: {
    // there is no reportType in planning moudle, so the key is undefined
    undefined: 'permitsView',
  },
  Reserves: {
    'annual-resource': 'annualResourceReserveView',
    reserves: 'reservesView',
    'H & F': 'fiveYearForecastReserveView',
  },
  flaring: {
    'MONTHLY STATION': 'monthlyStationFlaringView',
    DAILY: 'dailyFlaringReportView',
    MONTHLY: 'monthlyGasFlaringPerformanceReportView',
    'ANNUAL FORECAST': 'annualGasFlaringForecastView',
  },
}
export const MonthNameLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const YearNames = ['01', '02', '03', '04', '05']

export const YearNameLabels = ['Year1', 'Year2', 'Year3', 'Year4', 'Year5']

export const apps = [
  { img: cadreLogo, path: '/' },
  { img: reachLogo, path: '/' },
  { img: amsLogo, path: '/' },
  { img: ldrLogo, path: '/' },
  { img: mdrLogo, path: '/' },
  { img: insightLogo, path: '/' },
]

export const AMS_PLAN_BI_FILTER_KEY = 'ams-bi-filter-saves'
export const AMS_BI_CHART_THEME = 'ams_bi_chart_theme'
export const AMS_BI_CUSTOM_SAVES = 'AMS-BI-Custom-Saves'
export const AMS_CUSOM_CHART_ID_PREFIX = 'my_chart_'
export const AMS_CUSOM_FILTER_ID_PREFIX = 'my_filter_'

export const COLOR_MAP = {
  ag: 'red',
  nag: 'red',
  oil: 'green',
  water: 'blue',
  condensate: 'brown',
}

export const dateRangeModules = ['production', 'flaring', 'permit']
export const hideDateRangeRePortType = [
  'MONTHLY STATION',
  'MONTHLY',
  'ANNUAL FORECAST',
]
