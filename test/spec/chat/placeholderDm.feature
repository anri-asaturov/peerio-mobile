Feature: Placeholder DM
    Background:
        Given I have quickly signed up
        And  I invite someone to join Peerio
        And  I sign out
        Then Invited user signs up
        And  User confirms their email

    Scenario: I invite someone to Peerio and User accepts placeholder DM
        When they sign out
        Then I log in as recent user
        And  I receive placeholder DM
        And  User accepts placeholder DM
        And  I can send a message to the current chat

    Scenario: I invite someone to Peerio and User dismisses placeholder DM
        When they sign out
        Then I log in as recent user
        And  I receive placeholder DM
        And  User dismisses placeholder DM
        And  I cannot see their DM

    Scenario: I invite someone to Peerio and User accepts placeholder DM
        When They receive placeholder DM
        And  User accepts placeholder DM
        And  They can send a message to the current chat

    Scenario: I invite someone to Peerio and they decline placeholder DM
        When They receive placeholder DM
        And  User dismisses placeholder DM
        And  They cannot see my DM
