@folders @files @sharing @move  
Feature: Volume moving 
     As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume-related move operations.

# TODO (Mona): Adjust Background to fit all scenarios in this file
Background: 
    Given I am any user, or viewer of the file_or_folder in question
    And   I have navigated to the file_or_folder
    When  I click on the file_or_folder options
    And   I click on move 
    Then  I am prompted to move the file_or_folder 

Scenario: move file from regular folder into volume
    Given I choose a destination volume
    Then  The file will be copied to the destination volume
    And   The users with whom that volume is shared will gain access to file 

Scenario: move file from volume into regular folder
    Given I am the editor or owner of the folder
    Given I have navigated to the file
    When  I select the file options
    And   I select move
    Then  I am prompted to move the file
    And   The file will be copied to the destination folder
    And   The file will be removed from the volume
    And   The file will be unshared from users of the volume except the file owner 