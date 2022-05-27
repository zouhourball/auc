import { FontIcon } from 'react-md'

import cls from 'classnames'

export const iconManager = (icon, width = '20px', className) => {
  if (typeof icon === 'string') {
    if (icon.includes('/')) {
      return (
        <img
          className={cls('iconManger', className)}
          src={icon}
          width={width}
          alt="icon with icon manager"
        />
      )
    } else if (icon.includes(' ')) {
      return (
        <FontIcon
          className={cls('iconManger', className)}
          iconClassName={icon}
        />
      )
    } else {
      return (
        <FontIcon className={cls('iconManger', className)}>{icon}</FontIcon>
      )
    }
  } else {
    return {
      ...icon,
      props: {
        ...icon.props,
        className: cls(icon.props.className, 'iconManger', className),
      },
    }
  }
}
