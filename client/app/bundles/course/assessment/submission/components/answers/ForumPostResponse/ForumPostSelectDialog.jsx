import { Component } from 'react';
import { Dialog, FlatButton } from 'material-ui';
import { cyan500 } from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  forumTopicPostPackShape,
  postPackShape,
} from 'course/assessment/submission/propTypes';

import ForumCard from './ForumCard';

const translations = defineMessages({
  maxPostsSelected: {
    id: 'course.assessment.submission.answer.forumPostResponse.maxPostsSelected',
    defaultMessage:
      'You have already selected the max number of posts allowed.',
  },
  dialogTitle: {
    id: 'course.assessment.submission.answer.forumPostResponse.dialogTitle',
    defaultMessage:
      'You have selected {numPosts}/{maxPosts} {maxPosts, plural, one {post} other {posts}}.',
  },
  dialogSubtitle: {
    id: 'course.assessment.submission.answer.forumPostResponse.dialogSubtitle',
    defaultMessage: 'Click on the post to include it for submission.',
  },
  noPosts: {
    id: 'course.assessment.submission.answer.forumPostResponse.noPosts',
    defaultMessage:
      'You currently do not have any posts. Create one on the forums now!',
  },
  cancelButton: {
    id: 'course.assessment.submission.answer.forumPostResponse.cancelButton',
    defaultMessage: 'Cancel',
  },
  selectButton: {
    id: 'course.assessment.submission.answer.forumPostResponse.selectButton',
    defaultMessage:
      'Select {numPosts} {numPosts, plural, one {Post} other {Posts}}',
  },
});

const styles = {
  dialogTitle: {
    color: 'white',
    background: cyan500,
    lineHeight: '85%',
  },
  dialogTitleText: {
    fontSize: 22,
    marginTop: 0,
    marginBottom: 4,
  },
  dialogSubtitleText: {
    fontSize: 14,
    marginBottom: 0,
    opacity: 0.9,
  },
  dialog: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  noPostsText: {
    marginTop: 16,
    fontSize: 14,
  },
  dialogContent: {
    marginTop: 16,
  },
  nonLastForumCard: {
    marginBottom: 16,
  },
};

export default class ForumPostSelectDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // We will store the selected posts here until the user confirms
      // their selection, which is when we will persist it via the
      // parent component.
      selectedPostPacks: this.props.selectedPostPacks,
    };
  }

  // This helps to handle deletions via SelectedPostCard, i.e. not via this dialog.
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedPostPacks.length !== this.props.selectedPostPacks.length
    ) {
      // Safe and suggested by React documentation
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedPostPacks: this.props.selectedPostPacks });
    }
  }

  onSelectPostPack(postPack, isSelected) {
    const postPacks = this.state.selectedPostPacks;
    if (!isSelected) {
      if (postPacks.length >= this.props.maxPosts) {
        // Error if max posts have already been selected
        this.props.handleNotificationMessage(
          <FormattedMessage {...translations.maxPostsSelected} />,
        );
      } else {
        this.setState((oldState) => ({
          selectedPostPacks: [...oldState.selectedPostPacks, postPack],
        }));
      }
    } else {
      const selectedPostPacks = postPacks.filter(
        (p) => p.corePost.id !== postPack.corePost.id,
      );
      this.setState({ selectedPostPacks });
    }
  }

  // Only useful on initial load
  isForumExpandedOnFirstLoad(forumTopicPostPack) {
    const postPackIds = new Set(
      this.props.selectedPostPacks.map((pack) => pack.corePost.id),
    );
    return forumTopicPostPack.topicPostPacks.some((topicPostPack) =>
      topicPostPack.postPacks.some((postPack) =>
        postPackIds.has(postPack.corePost.id),
      ),
    );
  }

  saveChanges() {
    this.props.updateSelectedPostPacks(this.state.selectedPostPacks);
    this.props.setIsVisible(false);
  }

  renderDialogTitle() {
    const { maxPosts } = this.props;
    const numPostsSelected = this.state.selectedPostPacks.length;

    return (
      <div style={styles.dialogTitle}>
        <h2 style={styles.dialogTitleText}>
          <strong>
            <FormattedMessage
              values={{ maxPosts, numPosts: numPostsSelected }}
              {...translations.dialogTitle}
            />
          </strong>
        </h2>
        <p style={styles.dialogSubtitleText}>
          <FormattedMessage {...translations.dialogSubtitle} />
        </p>
      </div>
    );
  }

  renderPostMenu() {
    const { forumTopicPostPacks } = this.props;

    if (forumTopicPostPacks == null || forumTopicPostPacks.length === 0) {
      return (
        <p style={styles.noPostsText}>
          <FormattedMessage {...translations.noPosts} />
        </p>
      );
    }

    return (
      <div style={styles.dialogContent}>
        {forumTopicPostPacks.map((forumTopicPostPack, index) => (
          <ForumCard
            forumTopicPostPack={forumTopicPostPack}
            selectedPostPacks={this.state.selectedPostPacks}
            onSelectPostPack={(postPack, isSelected) =>
              this.onSelectPostPack(postPack, isSelected)
            }
            isExpandedOnLoad={this.isForumExpandedOnFirstLoad(
              forumTopicPostPack,
            )}
            key={forumTopicPostPack.forum.id}
            style={
              index < forumTopicPostPacks.length - 1
                ? styles.nonLastForumCard
                : {}
            }
          />
        ))}
      </div>
    );
  }

  render() {
    const numPostsSelected = this.state.selectedPostPacks.length;
    const hasNoChanges =
      JSON.stringify(
        this.state.selectedPostPacks.map((pack) => pack.corePost.id).sort(),
      ) ===
      JSON.stringify(
        this.props.selectedPostPacks.map((pack) => pack.corePost.id).sort(),
      );

    const actions = [
      <FlatButton
        label={<FormattedMessage {...translations.cancelButton} />}
        secondary
        onClick={() => this.props.setIsVisible(false)}
        key="forum-post-dialog-cancel-button"
      />,
      <FlatButton
        label={
          <FormattedMessage
            values={{ numPosts: numPostsSelected }}
            {...translations.selectButton}
          />
        }
        primary
        onClick={() => this.saveChanges()}
        key="forum-post-dialog-select-button"
        disabled={hasNoChanges}
        className="select-posts-button"
      />,
    ];

    return (
      <Dialog
        title={this.renderDialogTitle()}
        actions={actions}
        modal={false}
        open={this.props.isVisible}
        onRequestClose={() => this.props.setIsVisible(false)}
        autoScrollBodyContent
        autoDetectWindowHeight
        contentStyle={styles.dialog}
      >
        {this.renderPostMenu()}
      </Dialog>
    );
  }
}

ForumPostSelectDialog.propTypes = {
  forumTopicPostPacks: PropTypes.arrayOf(forumTopicPostPackShape).isRequired,
  selectedPostPacks: PropTypes.arrayOf(postPackShape).isRequired,
  maxPosts: PropTypes.number.isRequired,
  updateSelectedPostPacks: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  handleNotificationMessage: PropTypes.func.isRequired,
};
