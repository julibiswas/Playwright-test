Feature: Login Functionality

  Scenario: Successful login with valid credentials
    Given I open the login page
    When I enter username "juli@codelogicx.com"
    And I enter password "Juli@1998"
    And I click the login button
    Then I should be redirected to the dashboard

  # Scenario: Unsuccessful login with invalid credentials
  #   Given I open the login page
  #   When I enter username "invaliduser@example.com"
  #   And I enter password "WrongPassword!"
  #   And I click the login button
  #   Then I should see an error message "Invalid username or password."