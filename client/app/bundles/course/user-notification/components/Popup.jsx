import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import translations from 'lib/translations/form';

const styles = {
  dialog: {
    width: 400,
  },
  centralise: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const Popup = (props) => {
  const { title, children, actionButtons, onDismiss } = props;
  const dismissButton = (
    <FlatButton
      primary
      label={<FormattedMessage {...translations.dismiss} />}
      onClick={onDismiss}
    />
  );

  return (
    <Dialog
      open
      title={title}
      actions={[...actionButtons, dismissButton]}
      contentStyle={styles.dialog}
      titleStyle={styles.centralise}
      bodyStyle={styles.centralise}
      onRequestClose={props.onDismiss}
    >
      {children}
    </Dialog>
  );
};

Popup.propTypes = {
  title: PropTypes.string,
  onDismiss: PropTypes.func,
  children: PropTypes.node,
  actionButtons: PropTypes.arrayOf(PropTypes.node),
};

Popup.defaultProps = {
  actionButtons: [],
};

export default Popup;
