Feature: Collect Training Data
  As a user

  Scenario: Collect Content For Training

    Given training content is extracted for the following websites
      | https://www.bbc.co.uk/sport/football	                                                    | safe    |
      | https://www.bbc.co.uk/sport/football/teams/stoke-city	                                    | safe    |
      | https://www.theguardian.com/football	                                                    | safe    |
      | https://www.theguardian.com/football	                                                    | safe    |
      | https://www.theguardian.com/uk/sport	                                                    | safe    |
      | https://www.dailymail.co.uk/sport/football/index.html	                                    | safe    |
      | https://talksport.com/football/page/2/	                                                    | safe    |
      | https://www.bbc.co.uk/news	                                                                | safe    |
      | https://www.bbc.co.uk/news/uk	                                                            | safe    |
      | https://www.bbc.co.uk/news/technology	                                                    | safe    |
      | https://www.bbc.co.uk/weather	                                                            | safe    |
      | https://www.google.com/	                                                                    | safe    |
      | https://twitter.com/explore	                                                                | safe    |
      | https://duckduckgo.com/	                                                                    | safe    |
      | https://www.youtube.com/results?search_query=game+of+thrones	                            | safe    |
      | https://www.express.co.uk/sport/football/1129109/Man-City-news-pundit-reveals-ONE-team-can-challenge-next-season-Pep-Guardiola-treble	| safe    |
      | https://yogawithadriene.com/	                                                            | safe    |
      | https://www.amazon.co.uk/	                                                                | safe    |
      | https://www.argos.co.uk/	                                                                | safe    |
      | https://www.argos.co.uk/features/delivery-collection-guide?tag=ar:propbar:samedaydelivery	| safe    |
      | https://www.tesco.com/groceries/	                                                        | safe    |
      | https://www.edp24.co.uk/home	                                                            | safe    |
      | https://www.meetup.com/phpcambridge/events/261757326/	                                    | safe    |
      | https://www.hippychick.com/	                                                                | safe    |
      | https://www.google.com/maps/place/Longjie+Inn/@28.3123828,109.6032004,12z/data=!4m12!1m6!3m5!1s0x3699e00bdd955bf3:0x18c3371b1c8afa9c!2sDehang+Restaurant!8m2!3d28.343135!4d109.587036!3m4!1s0x0:0xae7a8fdf6327e2cf!8m2!3d28.3445403!4d109.5887049	| safe    |
      | https://computationx.wordpress.com/2019/05/23/five-things-ive-learned-about-pair-programming/	| safe    |
      | http://www.ourburystedmunds.com/whitsunfayre/	                                            | safe    |
      | https://www.boohoo.com/womens/trousers	                                                    | safe    |
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
      | http://www.anglianwater.co.uk	                                                            | safe    |
      | http://www.argos.co.uk	                                                                    | safe    |
      | http://www.newsnow.co.uk/itfc	                                                            | safe    |
      | http://www.vodafone.co.uk/	                                                                | safe    |
      | https://www.vodafone.co.uk/broadband	                                                    | safe    |
      | https://www.tripadvisor.co.uk/	                                                            | safe    |
      | https://www.airbnb.co.uk/s/Lake-District-National-Park--Lakes--South-Lakeland-District/homes?refinement_paths%5B%5D=%2Fhomes&query=Lake%20District%20National%20Park%2C%20Lakes%2C%20South%20Lakeland%20District	| safe    |
      | https://www.booking.com/index.en-gb.html	                                                | safe    |

    And training content is extracted for the following websites
      | https://www.bbc.co.uk/sport/football/teams/manchester-united	                            | harmful |
      | https://www.theguardian.com/football/manchester-united	                                    | harmful |
      | https://www.manutd.com/	                                                                    | harmful |
      | https://twitter.com/ManUtd	                                                                | harmful |
      | https://en.wikipedia.org/wiki/Manchester_United_F.C.	                                    | harmful |
      | https://www.newsnow.co.uk/h/Sport/Football/Premier+League/Manchester+United	                | harmful |
      | https://www.youtube.com/results?search_query=manchester+united	                            | harmful |
      | https://www.google.com/search?q=manchester+united&rlz=1C1CHBF_enGB839GB839&oq=manchester+united&aqs=chrome..69i57j0l2j69i59j0l2.4223j0j4&sourceid=chrome&ie=UTF-8 | harmful |
      | https://talksport.com/football/545799/transfer-news-live-man-united-man-city-spurs-fekir-de-ligt/ | harmful |
      | https://talksport.com/football/548784/manchester-united-transfer-news-red-devils-out-of-the-race-to-sign-ajax-captain-matthijs-de-ligt-reports/ | harmful |
      | https://www.dailymail.co.uk/sport/football/article-7071895/Man-United-miss-Kalidou-Koulibaly-turn-attentions-Ruben-Dias.html | harmful |
      | https://www.transfermarkt.com/manchester-united/transfers/verein/985	                   | harmful |
      | https://www.caughtoffside.com/2019/06/15/manchester-united-could-use-use-clever-trick-to-meet-stars-60m-valuation/ | harmful |
      | https://www.premierleague.com/clubs/12/Manchester-United/overview	                       | harmful |
      | https://www.amazon.co.uk/s?k=manchester+united&i=kitchen&hvadid=80195697990945&hvbmt=be&hvdev=c&hvqmt=e&tag=mh0a9-21&ref=pd_sl_8xen9cnloj_e	| harmful |
      | https://store.manutd.com/stores/manutd/en/?CMP=PPC-ManUnitedDirectBrand&msclkid=d1f9b4d44e2a18626b24e9d11965128f&gclid=CLSkuYqs7OICFdKRGwod6GENFg&gclsrc=ds | harmful |
      | https://www.transfermarkt.com/manchester-united/startseite/verein/985	                    | harmful |
      | https://www.ranker.com/list/best-manchester-united-players-of-all-time/ranker-soccer	    | harmful |
      | https://en.wikipedia.org/wiki/List_of_Manchester_United_F.C._players_(25%E2%80%9399_appearances) | harmful |
      | https://www.ranker.com/list/best-manchester-united-players-of-all-time/ranker-soccer	    | harmful |
      | https://www.worldfootball.net/teams/manchester-united/10/	                                | harmful |
      | http://www.mufcinfo.com/manupag/a-z_player_archive/legegendsexunitedm.html	                | harmful |
      | https://en.wikipedia.org/wiki/Manchester_United_Premier_Cup	                                | harmful |
      | https://www.manutd.com/en/news/detail/epl-tournament-looking-for-man-utd-fifa-players	    | harmful |
      | http://www.mufoundation.org/PrimaryStarsTournament	                                        | harmful |
      | https://www.internationalchampionscup.com/en/teams/manchester-united#tab_team-stats=defence&tab_team-players-stats=general&tab_team=overview | harmful |
      | https://www.ea.com/en-gb/news/fifa-17-manchester-united-fc-player-tournament	             | harmful |
      | https://www.manutd.com/en/tickets-and-hospitality/match-tickets?t=y&int_source=muwebsite&int_medium=meganav&int_campaign=matchtickets&int_content=thnav&int_term=matchtickets | harmful |
      | https://www.livefootballtickets.com/english-premiership/manchester-united-tickets.html	     | harmful |
      | https://www.ticketmaster.co.uk/manchester-united-tickets/artist/862031	                     | harmful |
      | https://www.viagogo.co.uk/Sports-Tickets/Football/Barclays-Premier-League/Manchester-United-Tickets | harmful |


  Scenario: Collect Content For Testing

    Given testing content is extracted for the following websites
      | https://www.autotrader.co.uk	                                                             | safe    |
      | https://www.seat.co.uk/used-cars/overview.html	                                             | safe    |
      | https://www.msn.com/en-gb/	                                                                 | safe    |
      | https://www.visit-burystedmunds.co.uk/directory/things-to-do	                             | safe    |
      | https://www.dayoutwiththekids.co.uk/things-to-do/east/suffolk/ipswich/sports-and-activities/laser-tag | safe    |
      | https://www.itfc.co.uk/	                                                                     | safe    |
      | https://www.glastonburyfestivals.co.uk/line-up/line-up-2019/?stage	                         | safe    |
      | https://www.robinhobb.com/	                                                                 | safe    |
      | https://aux.avclub.com/10-female-fantasy-writers-to-read-after-game-of-thrones-1834653149	 | safe    |
      | https://www.freecodecamp.org/news/the-vue-handbook-a-thorough-introduction-to-vue-js-1e86835d8446/ | safe    |
      | https://www.lamborghini.com/en-en	                                                         | safe    |
      | https://www.independent.co.uk/arts-entertainment/films/amrish-puri-bollywood-actor-mogambo-punjab-google-doodle-a8970046.html | safe    |
      | https://rnli.org/	                                                                         | safe    |
      | https://www.johnlewis.com/electricals/headphones/c600002279	                                 | safe    |
      | https://www.forbes.com/sites/scottmendelson/2019/06/21/avengers-endgame-may-top-avatar-but-dont-underestimate-avatar-2/	| safe    |
      | https://www.globaljustice.org.uk/	                                                         | safe    |
      | https://www.wildlifetrusts.org/wildlife-explorer/mammals/european-hedgehog	                 | safe    |
      | https://www.argos.co.uk/browse/technology/home-audio/personal-cd-players-and-cassette-players/c:30139/ | safe    |
      | https://medium.com/swlh/anthony-davis-is-finally-a-laker-f121ff395860	                     | safe    |
      | https://www.aveeno.co.uk/	                                                                 | safe    |

    And testing content is extracted for the following websites
      | https://www.bing.com/search?q=Manchester+United+football&FORM=S00035	                     | harmful |
      | https://www.manchestereveningnews.co.uk/sport/football/transfer-news/manchester-united-transfers-pogba-live-16469668 | harmful |
      | https://metro.co.uk/tag/manchester-united-fc/	                                             | harmful |
      | https://www.amazon.co.uk/s?k=manchester+united&i=kitchen&hvadid=80195661011017&hvbmt=be&hvdev=c&hvqmt=e&tag=mh0a9-21&ref=pd_sl_8xen9cnloj_e | harmful |
      | https://metro.co.uk/2019/06/22/manchester-united-david-de-gea-new-contract-10028184/	     | harmful |
      | https://www.skysports.com/football/news/11667/11745402/paul-pogba-is-he-really-set-to-leave-manchester-united | harmful |
      | https://www.manutd.com/en/partners	                                                         | harmful |
      | https://www.footyheadlines.com/2018/06/the-full-list-of-manchester-united-50-official-sponsors.html | harmful |
      | https://www.statista.com/statistics/254566/manchester-united-revenue-from-kit-sponsorship/	 | harmful |
      | https://www.premierleague.com/clubs/12/Manchester-United/stadium	                         | harmful |


  Scenario: Collect Content For Validation

    Given validation content is extracted for the following websites
      | http://www.hdewcameras.co.uk/canon-ef-s-18-135mm-f35-56-is-usm-lens-nano-4665-p.asp          | safe |
      | https://www.pexels.com/search/forest/                                                        | safe |
      | https://www.nathab.com/traveler-resources/                                                   | safe |
      | https://www.ikea.com/gb/en/ikea/campaigns/homeware/                                          | safe |
      | https://www.bbc.co.uk/sport/formula1/48730691                                                | safe |
      | https://www.glasscubes.com/pricing/                                                          | safe |
      | https://www.topcashback.co.uk/offers/                                                        | safe |
      | http://www.tennis.com/pro-game/2019/06/top-5-photos-andy-murray-begins-comeback-queens-club-feliciano-lopez/82721/ | safe |
      | https://www.w3schools.com/w3css/w3css_templates.asp                                          | safe |
      | https://www.w3schools.com/w3css/tryw3css_templates_dark_portfolio.htm                        | safe |
      | https://www.sharpesgardeningservices.com/                                                    | safe |
      | https://www.etsy.com/uk/c/art-and-collectibles?ref=catnav-66                                 | safe |
      | https://www.microsoft.com/en-gb/p/night-in-the-woods/c501vqfw8fqg?cid=msft_web_chart&activetab=pivot%3Areviewstab | safe |
      | https://www.bbc.co.uk/news/newsbeat-48717840                                                 | safe |
      | https://www.bbc.com/bitesize/levels/z4kw2hv                                                  | safe |
      | https://designfootball.com/design-galleries/fantasy-football-shirts/dortmund-kit-concept-31706 | safe |
      | https://www.westsuffolk.gov.uk/visitors/parks_sport_and_leisure_centres/index.cfm?aud=visitor | safe |
      | https://www.whufc.com/teams/first-team/squad                                                 | safe |
      | https://personal.secure.scottishwidows.co.uk/terms/                                          | safe |
      | https://www.fox-and-sons.co.uk/houses-for-sale/property-details/SBX104013                    | safe |

    And validation content is extracted for the following websites
      | https://en.wikipedia.org/wiki/Ole_Gunnar_Solskjaer                                           | harmful |
      | https://www.planetfootball.com/quizzes/can-name-every-member-man-utds-treble-winning-squad/  | harmful |
      | http://www.thefootballramble.co.uk/forum/viewthread/5439/P3080/                              | harmful |
      | https://www.premierleague.com/players/2616/Robin-van-Persie/overview                         | harmful |
      | https://www.thesackrace.com/teams/manchester-united                                          | harmful |
      | https://sortitoutsi.net/football-manager-2015/team/680/man-utd                               | harmful |
      | https://www.bbc.co.uk/sport/football/48613872                                                | harmful |
      | https://designfootball.com/design-galleries/fantasy-football-shirts/manchester-united-home-kit-39132 | harmful |
      | https://www.cnbc.com/2018/08/24/the-12-highest-paid-soccer-players-in-the-premier-league.html | harmful                                                                   |
      | https://www.whufc.com/teams/first-team/squad/chicharito#Profile                              | harmful |

