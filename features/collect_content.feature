Feature: Collect Training Data
  As a user

  Scenario: Collect Safe Content
    Given content is extracted for the following websites
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

    And content is extracted for the following websites
##      | https://www.tribalfootball.com/news	                                                        | safe    |
##      | https://www.thesun.co.uk/sport/football/	                                                | safe    |
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
##      | https://www.youtube.com/results?search_query=stoke+city	                                    | safe    |
      | https://www.youtube.com/results?search_query=manchester+united	                            | harmful |
      | https://yogawithadriene.com/	                                                            | safe    |
#      | https://www.nme.com/	                                                                    | safe    |
#      | https://www.nme.com/festivals/glastonbury-2019	                                            | safe    |
#      | https://www.nme.com/tag/game-of-thrones	                                                    | safe    |
      | https://www.amazon.co.uk/	                                                                | safe    |
##      | https://www.amazon.co.uk/gp/deals?ref_=nav_cs_gb	                                        | safe    |
      | https://www.argos.co.uk/	                                                                | safe    |
      | https://www.argos.co.uk/features/delivery-collection-guide?tag=ar:propbar:samedaydelivery	| safe    |
      | https://www.tesco.com/groceries/	                                                        | safe    |
      | https://www.edp24.co.uk/home	                                                            | safe    |
#      | https://www.edp24.co.uk/sport/local-football	                                            | safe    |


    And content is extracted for the following websites
      | https://www.meetup.com/phpcambridge/events/261757326/	                                    | safe    |
      | https://www.hippychick.com/	                                                                | safe    |
      | https://www.google.com/maps/place/Longjie+Inn/@28.3123828,109.6032004,12z/data=!4m12!1m6!3m5!1s0x3699e00bdd955bf3:0x18c3371b1c8afa9c!2sDehang+Restaurant!8m2!3d28.343135!4d109.587036!3m4!1s0x0:0xae7a8fdf6327e2cf!8m2!3d28.3445403!4d109.5887049	| safe    |
      | https://computationx.wordpress.com/2019/05/23/five-things-ive-learned-about-pair-programming/	| safe    |
      | http://www.ourburystedmunds.com/whitsunfayre/	                                            | safe    |
      #| https://www.houzz.com/discussions/leaves-brown-at-tips-on-rhododendron-dsvw-vd~4924655	    | safe    |
      | https://www.boohoo.com/womens/trousers	                                                    | safe    |
##      | https://www.boohoo.com/teddy-fur-1%2F2-zip-high-neck-sweat/DZZ05437.html?color=105	        | safe    |
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
#      | http://www.axelos.com	                                                                    | safe    |

    And content is extracted for the following websites
      | http://www.anglianwater.co.uk	                                                            | safe    |
      | http://www.argos.co.uk	                                                                    | safe    |
      | http://www.newsnow.co.uk/itfc	                                                            | safe    |
      | http://www.vodafone.co.uk/	                                                                | safe    |
      | https://www.vodafone.co.uk/broadband	                                                    | safe    |
      | https://www.tripadvisor.co.uk/	                                                            | safe    |
      | https://www.airbnb.co.uk/s/Lake-District-National-Park--Lakes--South-Lakeland-District/homes?refinement_paths%5B%5D=%2Fhomes&query=Lake%20District%20National%20Park%2C%20Lakes%2C%20South%20Lakeland%20District	| safe    |
      | https://www.booking.com/index.en-gb.html	                                                | safe    |
      | https://www.google.com/search?q=manchester+united&rlz=1C1CHBF_enGB839GB839&oq=manchester+united&aqs=chrome..69i57j0l2j69i59j0l2.4223j0j4&sourceid=chrome&ie=UTF-8	| harmful |
      | https://talksport.com/football/545799/transfer-news-live-man-united-man-city-spurs-fekir-de-ligt/	| harmful |
      | https://talksport.com/football/548784/manchester-united-transfer-news-red-devils-out-of-the-race-to-sign-ajax-captain-matthijs-de-ligt-reports/	| harmful |
      | https://www.dailymail.co.uk/sport/football/article-7071895/Man-United-miss-Kalidou-Koulibaly-turn-attentions-Ruben-Dias.html	| harmful |
      #| https://www.football365.com/manchester-united	                                            | harmful |
      | https://www.transfermarkt.com/manchester-united/transfers/verein/985	                    | harmful |
      #| https://www.skysports.com/manchester-united	                                                | harmful |
#      | https://www.bing.com/search?q=manchester+united&go=Submit&qs=ds&form=QBLH	                                                | harmful |
      | https://www.caughtoffside.com/2019/06/15/manchester-united-could-use-use-clever-trick-to-meet-stars-60m-valuation/	                                                | harmful |
      | https://www.premierleague.com/clubs/12/Manchester-United/overview	                                                | harmful |
#      | https://www.independent.co.uk/topic/ManchesterUnited	                                                | harmful |
      | https://www.amazon.co.uk/s?k=manchester+united&i=kitchen&hvadid=80195697990945&hvbmt=be&hvdev=c&hvqmt=e&tag=mh0a9-21&ref=pd_sl_8xen9cnloj_e	                                                | harmful |
      | https://store.manutd.com/stores/manutd/en/?CMP=PPC-ManUnitedDirectBrand&msclkid=d1f9b4d44e2a18626b24e9d11965128f&gclid=CLSkuYqs7OICFdKRGwod6GENFg&gclsrc=ds	                                                | harmful |

    And content is extracted for the following websites
      #| https://www.manchestereveningnews.co.uk/sport/football/football-news/man-utd-transfers-van-gaal-16435902	                                                | harmful |
      #| https://www.manchestereveningnews.co.uk/sport/football/football-news/man-utd-transfers-van-gaal-16435902	                                                | harmful |
      #| https://www.manutd.com/en/players-and-staff	                                                | harmful |
      #| https://www.manchestereveningnews.co.uk/sport/football/football-news/man-utd-transfer-news-loans-16430266	                                                | harmful |
      | https://www.transfermarkt.com/manchester-united/startseite/verein/985	                                                | harmful |
      | https://www.ranker.com/list/best-manchester-united-players-of-all-time/ranker-soccer	                                                | harmful |
      | https://en.wikipedia.org/wiki/List_of_Manchester_United_F.C._players_(25%E2%80%9399_appearances)	                                                | harmful |
      #| https://www.manchestereveningnews.co.uk/sport/football/gallery/manchester-uniteds-top-50-players-15406175	                                                | harmful |
      | https://www.ranker.com/list/best-manchester-united-players-of-all-time/ranker-soccer	                                                | harmful |
      | https://www.worldfootball.net/teams/manchester-united/10/	                                                | harmful |
      | http://www.mufcinfo.com/manupag/a-z_player_archive/legegendsexunitedm.html	                                                | harmful |
      #| https://www.football365.com/news/liverpool-man-united-to-enter-tournament-for-first-time	                                                | harmful |
      #| https://www.manchestereveningnews.co.uk/sport/football/football-news/manchester-united-checkatrade-trophy-liverpool-16431031	                                                | harmful |
      | https://en.wikipedia.org/wiki/Manchester_United_Premier_Cup	                                                | harmful |
      | https://www.manutd.com/en/news/detail/epl-tournament-looking-for-man-utd-fifa-players	                                                | harmful |
      | http://www.mufoundation.org/PrimaryStarsTournament	                                                | harmful |
      | https://www.internationalchampionscup.com/en/teams/manchester-united#tab_team-stats=defence&tab_team-players-stats=general&tab_team=overview	                                                | harmful |
      | https://www.ea.com/en-gb/news/fifa-17-manchester-united-fc-player-tournament	                                                | harmful |
      | https://www.manutd.com/en/tickets-and-hospitality/match-tickets?t=y&int_source=muwebsite&int_medium=meganav&int_campaign=matchtickets&int_content=thnav&int_term=matchtickets	                                                | harmful |
      #| https://www.eticketing.co.uk/muticketsandmembership/	                                                | harmful |
      | https://www.livefootballtickets.com/english-premiership/manchester-united-tickets.html	                                                | harmful |
      | https://www.ticketmaster.co.uk/manchester-united-tickets/artist/862031	                                                | harmful |
      | https://www.viagogo.co.uk/Sports-Tickets/Football/Barclays-Premier-League/Manchester-United-Tickets	                                                | harmful |
      #| 	                                                | harmful |



