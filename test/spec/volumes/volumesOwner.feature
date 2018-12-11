@folders @sharing @owner
Feature: Volume owner
    As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations exclusively to volume owners.

Background:
    Given I am the owner of a file

Scenario Outline: I delete a <file or folder> as an owner
    Given I am the owner of the <file or folder>
    And   I delete the <file or folder>
    Then  the <file or folder> is removed from Peerio servers
    And   the <file or folder> is unshared and deleted for every user who ever received it
    And   I will have my storage freed for the capacity of the <file or folder>

Scenario Outline: unshare file as owner
    Given I am the owner of the file
    And   I am viewing the audit log of the file
    When  I select the file and click to unshare with a <chat or volume>
    Then  the <users> in the <chat or volume> will lose access to the file

Examples: 
    | chat or volume | users             |  
    | DM             | recipient         | 
    | volume         | volume recipients | 

Scenario: move file from volume into regular folder
    Given I have navigated to the file
    When  I click on the file options
    And   I click on move
    Then  I am prompted to move the folder 
    When  I choose a destination folder 
    Then  The file will be copied to the destination folder 
    And   The file will be deleted from the volume 
    And   The file will be unshared from users of the volume