@folders @files @sharing @viewer 
Feature: Volume user 
    As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (editors, and owners).
    This feature file contains volume operations specifically related to sharing and unsharing. 
    It also does not contain operations related specifically to moving files.  

Background:
    Given I have quickly signed up

Scenario: I recieve a volume and can view the contents
    When  I sign out
    Then  a helper user signs up
    Then  they navigate to files
    And   they create a folder named "testFolder"
    And   they upload a file
    # code style, use correct pronoun?
    And   I move the file in the folder named "testFolder"
    And   they invite recent user to share "testFolder"
    Then  they sign out
    When  I log in as recent user
    Then  I navigate to files
    When  I can see the "testFolder" folder in my files
    When  I open the "testFolder" folder
    Then  the file is present

Scenario: view contents of received volume from dm
    Given I have navigated to the chat 
    When  I tap on the recevied volume in the chat
    Then  I can view the contents of the received volume

Scenario: I can not share a folder to a room 
    Given I have navigated to the chat tab
    And   I have selected a room
    When  I select "Share to chat"
    Then  a menu pops up to share files 
    And   I do not have the option to select folders