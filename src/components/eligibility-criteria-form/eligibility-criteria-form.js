import { useEffect } from 'react'
import { SelectionControlGroup, TextField } from 'react-md'
import { useTranslation } from 'libs/langs'

const { t } = useTranslation()
const EligibilityCriteriaForm = ({
  eligibilityCriteria,
  setEligibilityCriteria,
}) => {
  useEffect(() => {
    setEligibilityCriteria({ type: 'organization' })
  }, [])
  return (
    <div className="auction-details-form md-grid">
      <div className="auction-details-form-title md-cell md-cell--12">
        {'Eligibility Criteria'}
      </div>
      <div className="md-cell md-cell--12">
        <SelectionControlGroup
          id="selection-control-group-radios"
          className="bidder-type-selection"
          name="radio-example"
          type="radio"
          inline
          value={eligibilityCriteria?.type}
          onChange={(checked) => {
            setEligibilityCriteria({
              type: checked,
              /*  criteria: {
              orgCriteria: checked !== 'Individual' ? 'Above' : '',
              individualCriteria: checked !== 'Organization' ? 'Above' : '',
            },
            age: 0,
            gcc_percentage: 0, */
            })
          }}
          defaultValue={eligibilityCriteria?.type}
          controls={[
            {
              label: t('organization'),
              value: 'organization',
            },
            {
              label: t('individual'),
              value: 'individual',
            },
            {
              label: t('both'),
              value: 'both',
            },
          ]}
        />
      </div>
      {eligibilityCriteria?.type === 'individual' && (
        <div className="md-cell md-cell--12">
          <label className="auction-details-form-label">
            {t('minimum_age')}
          </label>
          <TextField
            id="age-requirement"
            placeholder={'Enter number of bedrooms'}
            value={eligibilityCriteria?.ageRequirement}
            onChange={(value) =>
              setEligibilityCriteria({
                ...eligibilityCriteria,
                ageRequirement: value,
              })
            }
            className="textField-withShadow"
            block
          />
        </div>
      )}
      {/* eligibilityCriteria?.type !== 'Organization' && (
        <>
          <span>{t('age_range')}</span>
          <SelectionControlGroup
            id="selection-control-group-radios-criteria"
            className="bidder-type-selection"
            name="radio-example"
            type="radio"
            inline
            value={eligibilityCriteria?.criteria?.individualCriteria}
            onChange={checked =>
              setEligibilityCriteria({
                ...eligibilityCriteria,
                criteria: {
                  orgCriteria: eligibilityCriteria?.criteria?.orgCriteria,
                  individualCriteria: checked,
                },
              })
            }
            defaultValue={'Above'}
            controls={[
              {
                label: (
                  <div className="bidder-type-criteria">
                    <span>{t('above')}</span>
                    {eligibilityCriteria?.criteria?.individualCriteria === 'Above' && (
                      <div className="bidder-type-criteria-input">
                        <TextField
                          type="number"
                          id="range"
                          value={eligibilityCriteria?.age}
                          onChange={(v, e) => {
                            e.stopPropagation()
                            onSetFormDetails('age', v)
                          }}
                          className=""
                          required
                          min={0}
                        />
                      </div>
                    )}
                  </div>
                ),
                value: 'Above',
              },
              {
                label: (
                  <div className="bidder-type-criteria">
                    <span>{t('below')}</span>
                    {eligibilityCriteria?.criteria?.individualCriteria === 'Below' && (
                      <div className="bidder-type-criteria-input">
                        <TextField
                          type="number"
                          id="below"
                          value={eligibilityCriteria?.age}
                          onChange={(v, e) => {
                            e.stopPropagation()
                            onSetFormDetails('age', v)
                          }}
                          className=""
                          required
                          min={0}
                        />
                      </div>
                    )}
                  </div>
                ),
                value: 'Below',
              },
              {
                label: (
                  <div className="bidder-type-criteria">
                    <span>{t('exact')}</span>
                    {eligibilityCriteria?.criteria?.individualCriteria === 'Exact' && (
                      <div className="bidder-type-criteria-input">
                        <TextField
                          type="number"
                          id="exact"
                          value={eligibilityCriteria?.age}
                          onChange={(v, e) => {
                            e.stopPropagation()
                            onSetFormDetails('age', v)
                          }}
                          className=""
                          required
                          min={0}
                        />
                      </div>
                    )}
                  </div>
                ),
                value: 'Exact',
              },
            ]}
          />
        </>
      ) */}
      {/* eligibilityCriteria?.type !== 'Individual' && (
        <>
          <span>{t('omani_gcc_percentage')}</span>
          <SelectionControlGroup
            id="selection-control-group-radios-criteria-1"
            className="bidder-type-selection"
            name="radio-example"
            type="radio"
            inline
            value={eligibilityCriteria?.criteria?.orgCriteria}
            onChange={checked =>
              setEligibilityCriteria({
                ...eligibilityCriteria,
                criteria: {
                  orgCriteria: checked,
                  individualCriteria: eligibilityCriteria?.criteria?.individualCriteria,
                },
              })
            }
            defaultValue={'Above'}
            controls={[
              {
                label: (
                  <div className="bidder-type-criteria">
                    <span>{t('above')}</span>
                    {eligibilityCriteria?.criteria?.orgCriteria === 'Above' && (
                      <div className="bidder-type-criteria-input">
                        <TextField
                          type="number"
                          id="range"
                          value={eligibilityCriteria?.['gcc_percentage']}
                          onChange={(v, e) => {
                            e.stopPropagation()
                            onSetFormDetails('gcc_percentage', v)
                          }}
                          className=""
                          required
                          min={0}
                        />
                      </div>
                    )}
                  </div>
                ),
                value: 'Above',
              },
              {
                label: (
                  <div className="bidder-type-criteria">
                    <span>{t('below')}</span>
                    {eligibilityCriteria?.criteria?.orgCriteria === 'Below' && (
                      <div className="bidder-type-criteria-input">
                        <TextField
                          type="number"
                          id="below"
                          value={eligibilityCriteria?.['gcc_percentage']}
                          onChange={(v, e) => {
                            e.stopPropagation()
                            onSetFormDetails('gcc_percentage', v)
                          }}
                          className=""
                          required
                          min={0}
                        />
                      </div>
                    )}
                  </div>
                ),
                value: 'Below',
              },
              {
                label: (
                  <div className="bidder-type-criteria">
                    <span>{t('exact')}</span>
                    {eligibilityCriteria?.criteria?.orgCriteria === 'Exact' && (
                      <div className="bidder-type-criteria-input">
                        <TextField
                          type="number"
                          id="exact"
                          value={eligibilityCriteria?.['gcc_percentage']}
                          onChange={(v, e) => {
                            e.stopPropagation()
                            onSetFormDetails('gcc_percentage', v)
                          }}
                          className=""
                          required
                          min={0}
                        />
                      </div>
                    )}
                  </div>
                ),
                value: 'Exact',
              },
            ]}
          />
        </>
      ) */}
    </div>
  )
}

export default EligibilityCriteriaForm
