import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Snackbar from 'material-ui/Snackbar';
import TitleBar from 'lib/components/TitleBar';
import SurveysEmpty from '../components/SurveysEmpty';
import SurveysTable from '../components/SurveysTable';
import NewSurvey from '../containers/NewSurvey';
import translations from '../translations';

const propTypes = {
  surveys: PropTypes.array.isRequired,
  notification: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const Surveys = ({ intl, surveys, notification }) => {
  surveys.sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

  return (
    <div>
      <TitleBar
        title={intl.formatMessage(translations.surveys)}
      />
      { surveys.length > 0 ? <SurveysTable {...{ surveys }} /> : <SurveysEmpty /> }
      <NewSurvey />
      <Snackbar
        open={notification !== ''}
        message={notification}
      />
    </div>
  );
};

Surveys.propTypes = propTypes;

export default connect(state => state)(injectIntl(Surveys));
