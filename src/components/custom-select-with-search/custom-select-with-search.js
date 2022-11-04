import React, { Component } from 'react'
import { TextField, Avatar, FontIcon, Button } from 'react-md'
import onClickOutside from 'react-onclickoutside'
import { get } from 'lodash-es'
import { cls } from 'reactutils'
import arrowDown from './Arrow.svg'

// import avatar from 'images/avatar.png'
import { getPublicUrl, validateEmail } from 'libs/utils/custom-function'

import './styles.scss'

@onClickOutside
export default class CustomSelectWithSearch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      listVisible: false,
      search: '',
      selectedItem: null,
      inputError: false,
      selectedItemsArray: [],
      currentSection:
        props.sections && props.sections.length > 0
          ? props.sections[0].key
          : null,
      styleV: {
        top: '0',
        bottom: 'unset',
      },
      styleH: {
        left: '0',
        right: 'unset',
      },
    }
    this.myRef = React.createRef()
    this.containerRef = React.createRef()
  }

  handleClickOutside = (e) => {
    const { search, targetId } = this.state
    const {
      onTextChange,
      setListVisibility,
      keepData,
      onClickItem,
      searchValue,
      selectedItem,
      required,
      id,
    } = this.props

    setListVisibility
      ? setListVisibility(false)
      : this.setState({ listVisible: false })
    if (search !== '' && !keepData) {
      this.setState({
        search: '',
      })
      if (onTextChange) {
        onTextChange('')
      }
    }
    if (keepData && validateEmail(searchValue)) {
      onClickItem({ label: searchValue })
    }

    !selectedItem &&
      required &&
      targetId === id &&
      this.setState({ inputError: true })
  }

  renderItems = () => {
    const {
      items,
      itemWrapper,
      searchItem,
      setListVisibility,
      onClickItem,
      selectedItem,
      withOutCheckIcon,
      mentor,
      searchValue,
      keepData,
      // errorTextProp,
    } = this.props

    const { currentSection, search } = this.state

    const dataToSearch = keepData ? searchValue : search

    let filteredData = items

    filteredData = currentSection
      ? filteredData?.filter((item) => item.type === currentSection)
      : filteredData

    filteredData = searchItem
      ? filteredData?.filter((item) =>
          item.label?.toLowerCase().includes(searchItem?.toLowerCase()),
        )
      : filteredData
    filteredData = dataToSearch
      ? mentor
        ? filteredData.filter((item) =>
            item.name?.toLowerCase().includes(dataToSearch?.toLowerCase()),
        )
        : filteredData.filter((item) =>
            item.label?.toLowerCase().includes(dataToSearch?.toLowerCase()),
        )
      : filteredData
    // if (selectedItemsArray.length > 0) {
    //   filteredData = filteredData.filter(item2 => selectedItemsArray.includes(item2.id))
    // }
    const Wrapper = itemWrapper ? itemWrapper.component : null
    return filteredData?.map((elem) => {
      return Wrapper ? (
        <Wrapper
          key={elem.id}
          {...itemWrapper.props
            .map(({ key, value }) => ({ [key]: elem[value] }))
            .reduce(
              (prevElem, nextElem) => Object.assign(prevElem, nextElem),
              {},
            )}
        >
          {(result) => {
            const element = {
              ...elem,
              ...itemWrapper.result
                .map(({ key, value, defaultValue }) => ({
                  [key]: get(result, value, defaultValue),
                }))
                .reduce(
                  (prevElem, nextElem) => Object.assign(prevElem, nextElem),
                  {},
                ),
            }
            return this.renderItem(element)
          }}
        </Wrapper>
      ) : (
        <div
          className={`elemWrapper ${
            selectedItem === elem.label ? 'selected' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onClickItem(elem)
            setListVisibility && this.setState({ inputError: false })
            setListVisibility
              ? setListVisibility(false)
              : this.setState({ listVisible: false })
          }}
        >
          <div>
            <div className="elemWrapper-label">{elem.label}</div>
            {elem.secondaryLabel && (
              <div className="elemWrapper-secondaryLabel">
                {elem.secondaryLabel}
              </div>
            )}
          </div>
          {selectedItem === elem.label && !withOutCheckIcon && (
            <FontIcon className="elemWrapper-icon">check</FontIcon>
          )}
        </div>
      )
    })
  }
  renderItem = (elem) => {
    const {
      selectedItemsArray,
      onClickItem,
      singleSelect,
      hideAvatar,
      hideSecondaryLabel,
      setListVisibility,
    } = this.props
    return (
      <div
        key={elem.id}
        className="itemMultiPick"
        onClick={(e) => {
          e.stopPropagation()
          if (!singleSelect) {
            const selected = selectedItemsArray.find(
              (item) => item.id === elem.id,
            )
            if (selected) {
              onClickItem(
                selectedItemsArray.filter((item) => selected.id !== item.id),
              )
            } else {
              onClickItem([...selectedItemsArray, elem])
            }
          } else {
            onClickItem(elem)
            setListVisibility
              ? setListVisibility(false)
              : this.setState({ listVisible: false })
          }
        }}
      >
        {!singleSelect && (
          <FontIcon
            primary={selectedItemsArray.find((item) => item.id === elem.id)}
          >
            {selectedItemsArray.find((item) => item.id === elem.id)
              ? 'check_box'
              : 'check_box_outline_blank'}
          </FontIcon>
        )}
        {!hideAvatar && (
          <div className="customSelect_wrapper_list_items_image">
            {elem.img ? (
              <Avatar src={getPublicUrl(elem.img)} />
            ) : (
              <Avatar>{elem.label.charAt(0).toUpperCase()}</Avatar>
            )}
          </div>
        )}
        <div className="labelWrapper">
          <div className="customSelect_wrapper_list_items_label">
            {elem.label}
          </div>
          {!hideSecondaryLabel && (
            <div className="customSelect_wrapper_list_items_position">
              {elem.secondaryLabel}
            </div>
          )}
        </div>
      </div>
    )
  }

  render () {
    const {
      searchPlaceholder,
      textFieldClassName,
      className,
      onTextChange,
      // fetchMore,
      // listInvoker,
      // listVisibility,
      listVisibility,
      // hideSearch,
      singleSelect,
      // selectAllButton,
      loading,
      // sections,
      // label,
      setListVisibility,
      withHeader,
      searchItem,
      setSearchItem,
      handleAddItem,
      searchItemPlaceHolder,
      addItemBtnLabel,
      selectedItem,
      rightIcon,
      onClickItem,
      required,
      // error,
      // errorText,
      helpText,
      withHelp,
      keepData,
      searchValue,
      setSearchValue,
      id,
      errorTextProp,
    } = this.props
    const {
      // listVisible,
      search,
      // currentSection,
      styleH,
      styleV,
      inputError,
    } = this.state

    const dataToSearch = keepData ? searchValue : search

    return (
      <div className={`customSelect_wrapper ${className || ''}`}>
        <div
          ref={this.containerRef}
          style={{ ...styleH, ...styleV, zIndex: !listVisibility ? 0 : 99 }}
          className="customSelect_wrapper_list md-paper--1"
        >
          <div className="customSelect_wrapper_list_items" ref={this.myRef}>
            <TextField
              placeholder={searchPlaceholder}
              id={id}
              // label={label}
              disabled
              className={`customSelect_wrapper_textField ${
                textFieldClassName || ''
              }`}
              required={required}
              // error={error}
              error={inputError}
              errorText={errorTextProp || ''}
              value={
                !(singleSelect && selectedItem) ? dataToSearch : selectedItem
              }
              rightIcon={
                <>
                  {withHelp && (
                    <div className="helpText-wrapper">
                      <FontIcon
                        onClick={() => {}}
                        icon
                        className="helpText-btn"
                      >
                        help
                      </FontIcon>
                      <div className="helpText-text">{helpText}</div>
                    </div>
                  )}
                  {!rightIcon ? (
                    !listVisibility ? (
                      <img
                        onClick={(e) => {
                          e.stopPropagation()
                          setListVisibility(true)
                        }}
                        src={arrowDown}
                        height={10}
                      />
                    ) : (
                      <img
                        onClick={(e) => {
                          e.stopPropagation()
                          setListVisibility(false)
                        }}
                        src={arrowDown}
                        height={10}
                      />
                    )
                  ) : (
                    rightIcon
                  )}
                </>
              }
              onChange={(val) => {
                onClickItem({ label: '' })
                keepData ? setSearchValue(val) : this.setState({ search: val })
                if (onTextChange) {
                  onTextChange(val)
                }
              }}
              onClick={() => {
                setListVisibility(!listVisibility)
                required && this.setState({ targetId: id })
              }}
              block
              // disabled={withHeader && !singleSelect}
            />
            {loading ? (
              <FontIcon primary iconClassName="mdi mdi-spin mdi-loading" />
            ) : (
              <div
                className={cls(
                  'list-itemMultiPick',
                  !listVisibility ? 'hidden' : '',
                )}
              >
                {withHeader && (
                  <div className={cls('list-itemMultiPick-header')}>
                    <TextField
                      id="search"
                      className="list-itemMultiPick-header-textField"
                      rightIcon={<FontIcon>search</FontIcon>}
                      value={searchItem}
                      onChange={setSearchItem}
                      placeholder={searchItemPlaceHolder}
                      block
                    />
                    <div className="list-itemMultiPick-header-container">
                      {typeof addItemBtnLabel === 'string' ? (
                        <Button
                          flat
                          className="list-itemMultiPick-header-container-btn"
                          onClick={handleAddItem}
                        >
                          {addItemBtnLabel}
                        </Button>
                      ) : (
                        addItemBtnLabel
                      )}
                    </div>
                  </div>
                )}
                {this.renderItems()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
