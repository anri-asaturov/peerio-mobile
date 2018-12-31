Feature: Chat list unread message indicator

    Background: Create helper user
        Given a helper user signs up
        And   they sign out

    Scenario: Use top unread message indicator to find chat in chat list
        When I log in as new user
        Then I create a new room named 0
        And  I exit the current chat
        Then I invite them to join the room
        And  I sign out
        When I log in as helper user
        And  I fill my chatlist
        Then I scroll down the chat list
        And  I press the top unread message indicator
        And  I can see the top unread chat

    Scenario: Use bottom unread message indicator to find chat in chat list
        When I log in as new user
        Then I create a new room named Z
        Then I exit the current chat
        Then I invite them to join the room
        And  I sign out
        When I log in as helper user
        And  I fill my chatlist
        Then I press the bottom unread message indicator
        And  I can see the bottom unread chat
