import * as React from 'react';
import { useField } from 'formik';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  GridItem,
  MultiSelect,
  MultiSelectOption,
  TextInput,
  Typography,
} from '@strapi/design-system';

import { REDUX_NAMESPACE } from '../../constants';
import { updateWorkflow } from '../../actions';

export function WorkflowAttributes() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [nameField, nameMeta] = useField('name');
  const [mappedContentTypesField, mappedContentTypesMeta] = useField('mappedContentTypes');
  const {
    clientState: { availableContentTypes },
  } = useSelector((state) => state?.[REDUX_NAMESPACE]);

  return (
    <Grid background="neutral0" hasRadius gap={4} padding={6} shadow="tableShadow">
      <GridItem col={6}>
        <TextInput
          {...nameField}
          id={nameField.name}
          label={formatMessage({
            id: 'Settings.review-workflows.workflow.name.label',
            defaultMessage: 'Workflow Name',
          })}
          error={nameMeta.error ?? false}
          onChange={(event) => {
            dispatch(updateWorkflow({ name: event.target.value }));
            nameField.onChange(event);
          }}
          required
        />
      </GridItem>

      <GridItem col={6}>
        <MultiSelect
          {...mappedContentTypesField}
          // eslint-disable-next-line react/no-unstable-nested-components
          customizeContent={() => (
            <Typography>
              {formatMessage(
                {
                  id: 'Settings.review-workflows.workflow.mappedContentTypes.displayValue',
                  defaultMessage:
                    '{count} {count, plural, one {content type} other {content types}} selected',
                },
                { count: mappedContentTypesField.value.length }
              )}
            </Typography>
          )}
          error={mappedContentTypesMeta.error ?? false}
          id={mappedContentTypesField.name}
          label={formatMessage({
            id: 'Settings.review-workflows.workflow.mappedContentTypes.label',
            defaultMessage: 'Associated to',
          })}
          onChange={(values) => {
            dispatch(updateWorkflow({ mappedContentTypes: values }));
            mappedContentTypesField.onChange({ target: { value: values } });
          }}
          required
        >
          {availableContentTypes.map((contentType) => (
            <MultiSelectOption key={`content-type-${contentType.uid}`} value={contentType.uid}>
              {contentType.info.displayName}
            </MultiSelectOption>
          ))}
        </MultiSelect>
      </GridItem>
    </Grid>
  );
}
