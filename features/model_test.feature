Feature: Test Model Performance
  As a user
  In order for the browser protect app to know what pages are safe
  It should learn from my browsing

  Scenario: Training and Test Results
    Given the model is trained with the following classifications
      | https://www.bbc.co.uk/sport/football	                                                    | safe    |
      | https://www.bbc.co.uk/sport/football/teams/manchester-united	                            | harmful |
      | https://www.bbc.co.uk/sport/football/teams/stoke-city	                                    | safe    |
      | https://www.theguardian.com/football	                                                    | safe    |
      | https://www.theguardian.com/football/manchester-united	                                    | harmful |
      | https://www.theguardian.com/football	                                                    | safe    |
      | https://www.theguardian.com/uk/sport	                                                    | safe    |
      | https://www.dailymail.co.uk/sport/football/index.html	                                    | safe    |
      | https://www.manutd.com/	                                                                    | harmful |
      | https://twitter.com/ManUtd	                                                                | harmful |
      | https://www.tribalfootball.com/news	                                                        | safe    |
      | https://www.thesun.co.uk/sport/football/	                                                | safe    |
      | https://talksport.com/football/page/2/	                                                    | safe    |
      | https://www.express.co.uk/sport/football/1129109/Man-City-news-pundit-reveals-ONE-team-can-challenge-next-season-Pep-Guardiola-treble	| safe    |
      #| https://www.manchestereveningnews.co.uk/all-about/manchester-united-fc	                    | harmful |
      | https://en.wikipedia.org/wiki/Manchester_United_F.C.	                                    | harmful |
      #| https://www.mirror.co.uk/all-about/manchester-united-fc	                                    | harmful |
      | https://www.newsnow.co.uk/h/Sport/Football/Premier+League/Manchester+United	                | harmful |
      | https://www.bbc.co.uk/news	                                                                | safe    |
      | https://www.bbc.co.uk/news/uk	                                                            | safe    |
      | https://www.bbc.co.uk/news/technology	                                                    | safe    |
      | https://www.bbc.co.uk/weather	                                                            | safe    |
      | https://www.google.com/	                                                                    | safe    |
      | https://twitter.com/explore	                                                                | safe    |
      | https://duckduckgo.com/	                                                                    | safe    |
      | https://www.youtube.com/results?search_query=game+of+thrones	                            | safe    |
      | https://www.youtube.com/results?search_query=stoke+city	                                    | safe    |
      | https://www.youtube.com/results?search_query=manchester+united	                            | harmful |
      | https://yogawithadriene.com/	                                                            | safe    |
#      | https://www.nme.com/	                                                                    | safe    |
#      | https://www.nme.com/festivals/glastonbury-2019	                                            | safe    |
#      | https://www.nme.com/tag/game-of-thrones	                                                    | safe    |
      | https://www.amazon.co.uk/	                                                                | safe    |
      | https://www.amazon.co.uk/gp/deals?ref_=nav_cs_gb	                                        | safe    |
      | https://www.argos.co.uk/	                                                                | safe    |
      | https://www.argos.co.uk/features/delivery-collection-guide?tag=ar:propbar:samedaydelivery	| safe    |
      | https://www.tesco.com/groceries/	                                                        | safe    |
      | https://www.edp24.co.uk/home	                                                            | safe    |
      | https://www.edp24.co.uk/sport/local-football	                                            | safe    |

    Then the following classifications are tested
      | https://www.edp24.co.uk/sport/norwich-city	                                                | safe    |
      | https://www.buryfreepress.co.uk/news/	                                                    | safe    |
#      | https://www.buryfreepress.co.uk/sport/football/	                                            | safe    |
      | https://www.stokecityfc.com/	                                                            | safe    |
#      | https://www.gumtree.com/cats/manchester	                                                    | safe    |
      | https://www.bbc.co.uk/iplayer/episode/m00059lh/eurovision-song-contest-2019-4-grand-final	| safe    |
      | https://www.bbc.co.uk/programmes/b007t9y1	                                                | safe    |
      | https://www.manchestereveningnews.co.uk/sport/football/football-news/man-utd-transfer-news-woodward-16288463 | harmful    |
      | https://en.wikipedia.org/wiki/Manchester_United_F.C.	                                    | harmful    |
      | https://www.facebook.com/manchesterunited/	                                                | harmful    |
      | https://metro.co.uk/2019/05/18/ole-gunnar-solskjaer-dismayed-fitness-manchester-united-players-jose-mourinhos-exit-9596537/ | harmful    |

