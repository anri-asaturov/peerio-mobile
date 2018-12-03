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


@folders @files
Feature: Files and Folders General
         As a Peerio user, I have access to a file directory in my Peerio application.
         The file system has certain valid and invalid operations. This feature details 
         aspects of the file directory system not including sharing functionality.

Background: 
    Given I am using the peerio mobile app and have navigated to the file section

Scenari Outline: I want to add a file from my device <origin> to a folder (including the root directory)
    Given I have navigated to the folder where I want to add the file
    And   I tap on "+"
    Then  a dialog opens prompting me to choose the file origin
    Then  I choose the <origin>
    When  I choose a file and tap "ok"
    Then  the file uploads to Peerio and is added to the folder to which I had navigated
    And   the file is visible in "All Files"
    And   I become the owner of the file
    | origin  |
    | camera  | 
    | gallery |
    | files   | 

Scenario: I want to create a folder in Peerio
    When  I tap "+"
    And   I tap "Create a folder"
    Then  A dialog opens asking me for the folder name
    When  I type a folder name
    And   I tap "ok"
    Then  a folder is created with the name I specified
    And   the folder is added to "All Files"
    # IS THIS LAST LINE NECESSARY IN THE CURRENT IMPLEMENTATION? 
    And   I become the owner of the folder

#this should be implemented for "/" and probably (possibly?) for other files too
# THIS SHOULD STAY HERE BECAUSE IT IS A GOOD CHECK TO HAVE
Scenario: Invalid folder name 
    When  I tap "+"
    And   I tap "Create a folder"
    Then  A dialog opens asking me for the folder name
    When  I enter an invalid folder name
    Then  A dialog appears telling me "invalid folder name"
    And   The folder is not created 

Scenario: I want to move a file into a folder
    Given I have created the folder
    And   I have uploaded the file 
    When  I tap the file options 
    And   I tap "Move"
    Then  A dialog shows prompting me to choose a folder
    When  I select the folder 
    And   I tap "Move"
    Then  the file is moved into the folder   

#current mobile implementation allows user to see / select same folder as destination (move fails)
Scenario: I cannot move a folder into its own child
    Given I have created at least one folder
    And   I tap on the options for this folder
    And   I tap "Move"
    Then  A dialog shows prompting me to choose a folder into which to move 
    And   The folder I have selected is not an available option
    And   Children of the folder I have selected are not available options