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

@folders @files @delete @remove @viewer @editor 
Feature: Volume user 
    As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (editors and owners).
    This feature file contains volume operations specifically related to deleting / removing files 
    from the perspective of a user who is not the owner of the volume. 

Background: 
    Given I have navigated to the files tab
    And   I have selected the FileActions (...)
    And   I have selected Delete 

# TODO (Mona): Adjust for having a scenario outline with examples
Scenario Outline: I want to delete a file or folder (as an editor)
    Then  the folder is removed from "Files"
    But   the owner will retain access
    And   any other users will retain access
    And   the folder binaries will remain on Peerio servers (Azure)
    And   users in rooms or chats where the file has been shared will retain access 
    And   if I am in rooms or chats where the file has been shared
    Then  the folder will still be available to me in those rooms or chats 
Examples: 
    | file or folder | 
    | file           |
    | folder         |

Scenario Outline: I want to delete a file or folder (as an owner)
    Given I am the owner of the <file or folder>
    And   I delete the <file or folder>
    Then  the <file or folder> is removed from Peerio servers
    And   the <file or folder> is unshared and deleted for every user who ever received it
    And   I will have my storage freed for the capacity of the <file or folder>
Examples: 
    | file or folder | 
    | file           |
    | folder         |