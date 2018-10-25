Feature: Create new chat

    Scenario Outline: Create DM successfully
        When I log in as <new or existing> user
        And  I start a DM with <user> user
        And  I can send a message to the current chat
        And  I exit the current chat
        And  they are in my contacts
    Examples:
    | new or existing | user       |
    | new             | test_karim |
    | create_dm_test  | test_karim |

    Scenario Outline: Create room successfully
        When I log in as <new or existing> user
        And  I create a new room
        Then I can send a message to the current chat
    Examples:
    | new or existing |
    | new             |
    | room_test       |
