Feature: Edit Profile Settings

    Scenario: I change my first and last name
        When I log in as new user
        And  I go to public profile settings
        Then I change my first name
        Then I change my last name

    Scenario: User uploads a new avatar
        When I log in as new user
        And  I go to public profile settings
        Then I upload a new avatar
        Then I change my existing avatar

    Scenario: View account key
        Given I log in as new user
        When  I go to security settings
        Then  I can see my account key