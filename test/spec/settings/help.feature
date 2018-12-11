@mobile @help
Feature: Mobile Help page
    As a user confused and looking for help in Peerio, I want to be able to find 
    and view a help page that simply contains contact information for support and 
    support guides, so that I can find an answer to my problem. 

 Scenario: I want to chat with support
    Given I log in as new user
    Then  I go to help settings
    When  I tap Chat button in help settings
    Then  A chat opens with the support user