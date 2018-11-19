@mobile @help
Feature: Mobile Help page
    As a user confused and looking for help in Peerio, I want to be able to find 
    and view a help page that simply contains contact information for support and 
    support guides, so that I can find an answer to my problem.

Background: 
    Given I am using the mobile app
    And   I have tapped "Settings" 
    And   I have tapped "Help"
    Then  the help page opens

Scenario: I want to visit the Peerio Help Center
    When  I tap "Visit"
    Then  the Peerio Zendesk (https://peerio.zendesk.com/hc/en.us) opens in browser    

Scenario: I want to chat with support
    When  I tap "Chat"
    Then  a chat opens with the "@support" user

Scenario: I want to send logs to Peerio Support
    When  I tap "Send" 
    Then  an e-mail opens in the native e-mail app
    And   all the logs are copied into the e-mail
    And   the "to" field contains "support@peerio.com"
    When  I tap send in the e-mail app
    Then  I return to the "Help" screen
