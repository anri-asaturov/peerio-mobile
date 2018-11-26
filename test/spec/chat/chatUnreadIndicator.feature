Feature: Chat view unread message indicator

    Background:
        Given a helper user signs up
        And   they sign out

    @noCacheReset
    Scenario: Use top unread message indicator to find chat in chat list
        Given I have signed up
        And   I start a DM with helper user
        And   I send several messages to the current chat
        And   I exit the current chat
        And   I sign out
        When  I log in as helper user
        And   I open the chat
        And   I scroll up the chat
        Then  I click the chat unread message indicator
        And   I can no longer see the unread message indicator
