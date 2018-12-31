Feature: Non-shared folders

    Background:
        Given I have quickly signed up

    Scenario: Create/delete folder
        Given the Files tab is empty
        When  I create a folder named "Holiday pictures"
        And   I open the "Holiday pictures" folder
        And   I upload a file
        When  I delete the folder named "Holiday pictures"
        Then  the Files tab is empty

    Scenario: Move file in folder
        Given the Files tab is empty
        And   I upload a file
        And   I create a folder named "Holiday pictures"
        When  I move the file in the folder named "Holiday pictures"
        And   I open the "Holiday pictures" folder
        Then  the file is present
        When  I delete the folder named "Holiday pictures"
        Then  the Files tab is empty

    Scenario: Create subfolders
        Given the Files tab is empty
        And   I create a folder named "Holiday pictures"
        And   I open the "Holiday pictures" folder
        When  I create a folder named "Summer 2018"
        And   I open the "Summer 2018" folder
        Then  I upload a file
        When  I delete the folder named "Holiday pictures"
        Then  the Files tab is empty

    Scenario: Move folders
        Given the Files tab is empty
        And   I create a folder named "Holiday pictures"
        When  I create a folder named "Summer 2018"
        When  I move the "Summer 2018" folder in the "Holiday pictures" folder
        And   I open the "Holiday pictures" folder
        Then  the "Summer 2018" folder is present
        When  I delete the folder named "Holiday pictures"
        Then  the Files tab is empty