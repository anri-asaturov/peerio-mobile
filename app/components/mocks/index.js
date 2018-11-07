import MockBeacon from './beacons/mock-beacon';
import MockChannelView from './mock-channel-view';
import MockChannelCreate from './mock-channel-create';
import MockChatList from './mock-chat-list';
import MockTwoFactorAuth from './mock-two-factor-auth';
import Mock2FAPopup from './mock-2fa-popup';
import MockPopups from './mock-popups';
import MockStyledTextInput from './mock-styled-text-input';
import MockImagePreview from './mock-image-preview';
import MockThumbnail from './mock-thumbnail';
import MockActionSheet from './mock-action-sheet';
import MockSignupContactInvite from './mock-signup-contact-import';
import MockPerfResults from './mock-perf-results';
import MockSqlTest from './mock-sql-test';
import MockContactList from './mock-contact-list';
import MockImageError from './mock-image-error';
import MockMigration from './mock-migration';
import MockTopDrawer from './mock-top-drawer';
import MockUpgrade from './mock-upgrade';

// we require all mocks to prevent them from being orphaned
// when checking for unused JS filex
const mocks = { // eslint-disable-line
    MockBeacon,
    MockChannelView,
    MockChannelCreate,
    MockChatList,
    MockTwoFactorAuth,
    Mock2FAPopup,
    MockPopups,
    MockStyledTextInput,
    MockImagePreview,
    MockThumbnail,
    MockActionSheet,
    MockSignupContactInvite,
    MockPerfResults,
    MockSqlTest,
    MockContactList,
    MockImageError,
    MockMigration,
    MockTopDrawer,
    MockUpgrade
};

// switch this to mocks item to test [TODO: replace with storybooks]
export default null;
