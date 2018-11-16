Feature: Room invites

    As a user, I can invite other users to rooms.
    If I get invited to a room, I can:
    - accept the invite and join the room
    - decline the invite
    - accept an invite and then leave the room and be navigated to chat list

    Scenario: Accept a room invite
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they accept the room invite

    @noCacheReset
    Scenario: Decline a room invite
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they decline the room invite

    @noCacheReset
    Scenario: Invite someone to join a room but cancel
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite someone to join the room
        And   I cancel the invite
        And   I sign out
    # TODO: this doesn't work currently
    # And   they do not have any room invites

    @noCacheReset
    Scenario: Invite someone to rejoin a room after leaving
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they accept the room invite
        And   they leave the room
        And   they sign out
        And   I log in as room_test user
        And   I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they accept the room invite

    @noCacheReset
    Scenario: Leave room and navigate to chat list
        Given I log in as leavechannelnav_inviter user
        And   I create a new room
        And   I exit the current chat
        When  I invite leavechannelnav_invitee to join the room
        And   I sign out
        Then  I log in as leavechannelnav_invitee user
        And   they accept the room invite
        And   they leave the room
        Then  I am in the chat list page
