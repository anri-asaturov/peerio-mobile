Feature: Listener

    Scenario: Automation listener starts and connects
        When I see the app
        And I send a number to the app
        Then I receive the same number back
