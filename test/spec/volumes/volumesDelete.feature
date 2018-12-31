@folders @files @delete @remove @viewer @editor 
Feature: Volume user 
    As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (editors and owners).
    This feature file contains volume operations specifically related to deleting / removing files 
    from the perspective of a user who is not the owner of the volume. 

Background:
    Given I have quickly signed up
    When  I sign out
    Then  a helper user signs up
    Then  they navigate to files
    And   they create a folder named "testFolder"
    And   they upload a file
    And   I move the file in the folder named "testFolder"
    And   they invite recent user to share "testFolder"
    Then  they sign out
    When  I log in as recent user
    Then  I navigate to files
    Then  I delete the folder named "testFolder"

Scenario: I want to delete a volume (as an editor)
    Then  the folder is no longer available
    But   the owner will retain access
    And   any other users will retain access
    And   users in rooms or chats where the file has been shared will retain access 
    And   if I am in rooms or chats where the file has been shared
    Then  the folder will still be available to me in those rooms or chats 

Scenario: I want to delete a file or folder (as an owner)
    Given I am the owner of the <file or folder>
    And   I delete the <file or folder>
    Then  the <file or folder> is removed from Peerio servers
    And   the <file or folder> is unshared and deleted for every user who ever received it
    And   I will have my storage freed for the capacity of the <file or folder>