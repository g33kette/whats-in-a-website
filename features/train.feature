Feature: Training the App
  As a user
  In order for the browser protect app to know what pages are safe
  It should learn from my browsing habits

  Scenario: BBC Football
    When I go to "https://www.bbc.co.uk/sport/football"
    Then I should see "Football"