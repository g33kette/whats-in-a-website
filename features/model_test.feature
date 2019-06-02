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
      
      
      
      | https://www.meetup.com/phpcambridge/events/261757326/	                                    | safe    |
      | https://www.hippychick.com/	                                                                | safe    |
      | https://www.google.com/maps/place/Longjie+Inn/@28.3123828,109.6032004,12z/data=!4m12!1m6!3m5!1s0x3699e00bdd955bf3:0x18c3371b1c8afa9c!2sDehang+Restaurant!8m2!3d28.343135!4d109.587036!3m4!1s0x0:0xae7a8fdf6327e2cf!8m2!3d28.3445403!4d109.5887049	| safe    |
      | https://computationx.wordpress.com/2019/05/23/five-things-ive-learned-about-pair-programming/	| safe    |
      | http://www.ourburystedmunds.com/whitsunfayre/	                                            | safe    |
      #| https://www.houzz.com/discussions/leaves-brown-at-tips-on-rhododendron-dsvw-vd~4924655	    | safe    |
      | https://www.boohoo.com/womens/trousers	                                                    | safe    |
      | https://www.boohoo.com/teddy-fur-1%2F2-zip-high-neck-sweat/DZZ05437.html?color=105	        | safe    |
      | https://www.newlook.com/uk/c/black-woven-harem-trousers-/p/374021301	                    | safe    |
      | https://www.bbc.co.uk/news/newsbeat-48352581	                                            | safe    |
      | http://www.pivotaltracker.com	                                                            | safe    |
      | http://www.finnpathologists.co.uk	                                                        | safe    |
      | http://www.pexels.com	                                                                    | safe    |
      | http://www.topcashback.co.uk	                                                            | safe    |
      | http://www.nathab.com/traveler-resources/	                                                | safe    |
      | http://www.gamertagnation.com	                                                            | safe    |
      | http://www.westsuffolk.gov.uk/	                                                            | safe    |
      | http://www.sortitoutsi.net	                                                                | safe    |
      | http://www.axelos.com	                                                                    | safe    |
      | http://www.anglianwater.co.uk	                                                            | safe    |
      | http://www.argos.co.uk	                                                                    | safe    |
      | http://www.newsnow.co.uk/itfc	                                                            | safe    |
      | http://www.vodafone.co.uk/	                                                                | safe    |
      | https://www.vodafone.co.uk/broadband	                                                    | safe    |
      | https://www.tripadvisor.co.uk/	                                                            | safe    |
      | https://www.airbnb.co.uk/s/Lake-District-National-Park--Lakes--South-Lakeland-District/homes?refinement_paths%5B%5D=%2Fhomes&query=Lake%20District%20National%20Park%2C%20Lakes%2C%20South%20Lakeland%20District&place_id=ChIJF3A1IGLBfEgRhnpq6t17tRc&search_type=SECTION_NAVIGATION&allow_override%5B%5D=&s_tag=GmpfE3JY	| safe    |
      | https://www.booking.com/index.en-gb.html	                                                | safe    |
      | https://www.google.com/search?q=manchester+united&rlz=1C1CHBF_enGB839GB839&oq=manchester+united&aqs=chrome..69i57j0l2j69i59j0l2.4223j0j4&sourceid=chrome&ie=UTF-8	| harmful |
      | https://talksport.com/football/545799/transfer-news-live-man-united-man-city-spurs-fekir-de-ligt/	| harmful |
      | https://talksport.com/football/548784/manchester-united-transfer-news-red-devils-out-of-the-race-to-sign-ajax-captain-matthijs-de-ligt-reports/	| harmful |
      | https://www.dailymail.co.uk/sport/football/article-7071895/Man-United-miss-Kalidou-Koulibaly-turn-attentions-Ruben-Dias.html	| harmful |
      #| https://www.football365.com/manchester-united	                                            | harmful |
      | https://www.transfermarkt.com/manchester-united/transfers/verein/985	                    | harmful |
      #| https://www.skysports.com/manchester-united	                                                | harmful |

    
    
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

