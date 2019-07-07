Feature: Training the App
  As a user
  In order for the browser protect app to know what pages are safe
  It should learn from my browsing habits

  Scenario: Training BBC Football Using Training Overlay
    When I go to "https://www.bbc.co.uk/sport/football"
    Then I should see protection overlay
    When content analysis is complete
    Then I should see "This website cannot be classified." in protection overlay
    When I continue to website
    Then I should see protection training
    Then I mark page as "safe"

    When I go to "https://www.bbc.co.uk/sport/football/teams/manchester-united"
    Then I should see protection overlay
    When content analysis is complete
    Then I should see "This website cannot be classified." in protection overlay
    When I continue to website
    Then I should see protection training
    Then I mark page as "harmful"

    When I go to "https://www.bbc.co.uk/news"
    Then I should see protection overlay
    When content analysis is complete
    Then the classification result should be "safe"

  Scenario: Training BBC Football Directly From Protection Overlay
    When I go to "https://www.bbc.co.uk/sport/football"
    Then I should see protection overlay
    When content analysis is complete
    Then I should see "This website cannot be classified." in protection overlay
    Then I mark page as "safe" in protection overlay

    When I go to "https://www.bbc.co.uk/sport/football/teams/manchester-united"
    Then I should see protection overlay
    When content analysis is complete
    Then I should see "This website cannot be classified." in protection overlay
    Then I mark page as "harmful" in protection overlay

    When I go to "https://www.bbc.co.uk/news"
    Then I should see protection overlay
    When content analysis is complete
    Then the classification result should be "safe"