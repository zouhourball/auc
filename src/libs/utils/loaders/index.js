import ContentLoader from 'react-content-loader'
import './styles.scss'

export function MeetingLoader () {
  return (
    <div className="meeting-contentloader-wrap">
      <ContentLoader
        height={106}
        width={500}
        speed={1}
        className="meeting-contentloader"
      >
        <rect x="0" y="0" rx="5" ry="5" width="156" height="106" />
        <rect x="166" y="0" rx="5" ry="5" width="156" height="106" />
        <rect x="332" y="0" rx="5" ry="5" width="156" height="106" />
      </ContentLoader>
    </div>
  )
}

export function WsLoader () {
  return (
    <ContentLoader
      height={240}
      width={420}
      speed={1}
      className="ws-contentloader"
    >
      <rect x="0" y="0" width="100" height="140" />
      <rect x="0" y="155" width="50" height="18" />
      <rect x="0" y="180" width="80" height="13" />
      <rect x="0" y="202" width="60" height="13" />

      <rect x="105" y="0" width="100" height="140" />
      <rect x="105" y="155" width="50" height="18" />
      <rect x="105" y="180" width="80" height="13" />
      <rect x="105" y="202" width="60" height="13" />

      <rect x="210" y="0" width="100" height="140" />
      <rect x="210" y="155" width="50" height="18" />
      <rect x="210" y="180" width="80" height="13" />
      <rect x="210" y="202" width="60" height="13" />

      <rect x="315" y="0" width="100" height="140" />
      <rect x="315" y="155" width="50" height="18" />
      <rect x="315" y="180" width="80" height="13" />
      <rect x="315" y="202" width="60" height="13" />
    </ContentLoader>
  )
}
