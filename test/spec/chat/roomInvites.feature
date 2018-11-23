Feature: Room invites

    As a user, I can invite other users to rooms.
    If I get invited to a room, I can:
    - accept the invite and join the room
    - decline the invite
    - accept an invite and then leave the room and be navigated to chat list

    Background:
        Given a helper user signs up
        And   they sign out

    @noCacheReset
    Scenario: Accept a room invite
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite them to join the room
        And   I sign out
        Then  the helper user logs in
        And   they accept the room invite

    @noCacheReset
    Scenario: Decline a room invite
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite them to join the room
        And   I sign out
        Then  the helper user logs in
        And   they decline the room invite

    @noCacheReset
    Scenario: Invite user to join a room but cancel
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite them to join the room
        And   I cancel the invite
        And   I sign out
        Then  the helper user logs in
        And   they do not have any room invites

    @noCacheReset
    Scenario: Invite user to rejoin a room after leaving
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite them to join the room
        And   I sign out
        Then  the helper user logs in
        And   they accept the room invite
        And   they leave the room
        And   they sign out
        And   I log in as room_test user
        And   I invite them to join the room
        And   I sign out
        Then  the helper user logs in
        And   they accept the room invite

    @noCacheReset
    Scenario: Leave room and navigate to chat list
        Given I log in as room_test user
        And   I create a new room
        And   I exit the current chat
        When  I invite them to join the room
        And   I sign out
        Then  the helper user logs in
        And   they accept the room invite
        And   they leave the room
        Then  they are in the chat list page
