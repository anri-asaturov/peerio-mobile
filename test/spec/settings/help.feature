@mobile @help
Feature: Mobile Help page
    As a user confused and looking for help in Peerio, I want to be able to find 
    and view a help page that simply contains contact information for support and 
    support guides, so that I can find an answer to my problem. 

Background: I am on the help settings page
   Given I log in as new user
   And   I go to help settings  

Scenario: I want to visit the Peerio Help Center
    When  I tap Visit button in help settings
    Then  the Peerio Zendesk opens in browser  

Scenario: I want to chat with support
    When  I tap Chat button in help settings
    Then  A chat opens with the support user

Scenario: I want to send logs to Peerio Support
    When  I tap Send button in help settings 

    #Then  an e-mail opens in the native e-mail app

#   NATIVE E-MAIL CHECK TO BE DONE: 
#   And   all the logs are copied into the e-mail
#   And   the "to" field contains "support@peerio.com"
#   When  I tap send in the e-mail app
#   Then  I return to the "Help" screen