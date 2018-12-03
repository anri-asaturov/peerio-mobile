Feature: Room invites

    As a user, I can invite other users to rooms.
    If I get invited to a room, I can:
    - accept the invite and join the room
    - decline the invite
    - accept an invite and then leave the room and be navigated to chat list

    Background:
        Given a helper user signs up
        And   they sign out
        Given I have quickly signed up

    @noCacheReset
    Scenario: Decline a room invite
        When  I create a new room
        And   I exit the current chat
        When  I invite them to join the room
        And   I sign out
        Then  the helper user logs in
        And   they decline the room invite

