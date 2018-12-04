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


@folders @files @sharing @viewer 
Feature: Volume user 
    As a Peerio user, I have access to volume called "Test Volume". I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations available to all users (editors, and owners).
    This feature file contains volume operations specifically related to sharing and unsharing. 
    It also does not contain operations related specifically to moving files.  

Background: 
    Given I am any user of the file(s) in question

Scenario Outline: I am invited and accept the invite to a volume
    Given the owner or editor of the folder has invited me to share the folder
    Then  the pending invitation will be available in "Files" 
    When  I accept the invite
    Then  the volume will be added to my "Files" with the editor privileges applied

Scenario: I am invited and reject the invite to a volume
    Given the owner or editor of the folder has invited me
    Then  the pending invitation will be available in "Files"
    When  I reject the invite 
    Then  the volume will be removed from "Files"

Scenario: view contents of received volume from files tab
    Given I have navigated to the files tab 
    When  I tap on the received volume
    Then  I can view the contents of the volume 

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