################################################################################
#
# This .feature file has been written by Mona Ghassemi for use by Peerio.
# It is part of a set of .feature files located in the mobile repository, 
# tests-folder-scenarios
# 
# If you have any questions, comments, or concerns regarding the contents 
# of this file, please contact Mona Ghassemi, @bluemona, on Peerio. 
#
# Thanks! 
#
################################################################################

@folders @sharing @editor
Feature: Volume editor
     As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume.
    This feature contains volume operations available both to editors and owners. 
    It does not contain operations available exclusively to volume owners. 

Background: 
    Given I am the editor or owner of the folder

Scenario: I want to share a folder from files tab
    Given I have navigated to the files tab
    When  I select the FileActions (...)
    And   I select "Share"
    And   I select a user to share with
    Then  the selected user will be sent the file as a message
    And   the folder will appear in the user's "Files"

Scenario: I want to share a folder via chat
    Given I have navigated to the chat tab
    And   I have selected a direct message
    When  I select "Share to chat"
    Then  a menu pops up to share files 
    When  I select "Share from Peerio files"
    Then  A dialog pops up prompting me to select a file or folder
    When  I select a folder 
    Then  The folder will become a volume
    Then  The volume will appear in the chat
    And   The volume will be added to the recipient(s) "Files"
    And   The recipient(s) will be able to navigate to the volume by clicking on the volume's icon in the chat

# TODO (Mona): See if this needs to be implemented now
#Not implemented
#Scenario: add a user (as the owner)
#    Given I am the owner of the folder
#    When  I share a folder in a chat (DM or room)
#    Then  I will be prompted to specify what permissions to grant recipients
#    And the users in the DM or room will receive an invitation to accept or decline with permissions specified
    #When the recipient accepts the invite
    #Then the volume will be added to their "Your Drive" with the specified role applied

Scenario Outline: remove a user from file tab 
    Given I have navigated to the files tab
    And   I select the volume options (...)
    And   I select share
    And   I select "View Shared With"
    And   I select the "-" next to a user EXCEPT THE OWNER
    Then  The app will show "removed" next to the user's name
    When  I select "Save"
    And   The user's privileges to the volume will be revoked
    And   The file volume will be removed from the user's "Files"
    And   Any chats in which the folder was shared will show "Folder was unshared" instead
    And   My chat messages where I have shared the folder will have an option "Reshare"

Scenario Outline: Reshare a folder
    Given I have revoked access to a folder that was shared in a chat
    And   I select "Reshare"
    Then  The recipient receives a new chat message in which the folder is shared

Scenario Outline: I begin to remove a user from file tab but I change my mind (as editor)
    Given I have navigated to the files tab
    And   I select the volume options
    And   I select share
    And   I select "View Shared With"
    And   I select the "-" next to a user 
    Then  The app will show "removed" next to the user's name
    When  I select "Undo"
    And   The user's privileges to the volume will NOT be revoked
    And   The file volume will be NOT removed from the user's "Files"