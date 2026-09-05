# Compendium of Techniques for Analysis and Splitting User Stories

| Field | Value |
| --- | --- |
| **Doc** | 819 · User Story · Other |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Splitting user stories.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Splitting%20user%20stories.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | user story · story splitting · vertical slice · workflow steps · acceptance criteria · conjunctions · vague terms |
| **Tools** | — |

## Summary

This document compiles various articles and reference guides on techniques for splitting user stories into smaller, manageable pieces. It covers concepts such as vertical slicing, splitting by vague terms, conjunctions, acceptance criteria, and workflow steps, as well as patterns and tips for effective story decomposition. The goal is to reduce risk, improve flow, and enhance team productivity in agile development.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.06 · same kind/folder <!-- rel:758 s=1.521 -->
- [LRS Identify in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-identify-in-local-scenes-in-pro.md>) — similar text 0.05 · same kind/folder <!-- rel:769 s=1.5 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update.md>) — similar text 0.05 · same kind/folder <!-- rel:746 s=1.497 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes.md>) — similar text 0.04 · same kind/folder <!-- rel:768 s=1.479 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp.md>) — similar text 0.04 · same kind/folder <!-- rel:765 s=1.479 -->
<!-- related:end -->

---

                                                                          April 2020

Compendium of techniques for analysis and splitting User Stories.

Attached are several articles and quick reference guides that describe various approaches to splitting user stories.

Articles and references sorted roughly by relevance, with links.

1. Article: Splitting stories into small, vertical slices by Peter Green, Adobe 2013

2. Simple quick reference: 4 user story splitting ideas by Laura Powers 2013

3. Article: Twenty ways to Split User Stories by Bill Wake 2005

4. Quick reference: Twenty ways to Split User Stories by Bill Wake 2009

5. Splitting user stories cheat sheet: Eight Techniques by Christiaan Verwijs 2013

6. Two good splitting tips from James Grenning 2009

7. Quick reference: 8 User Story Splitting Patterns (landscape)

   by Richard Lawrence 2012

“The primary purpose of breaking down features into small deliverable stories is to reduce risk, increase flow and increase the amount of working software that can be reviewed every sprint.”

Questions to answer about the impact of small user stories:

   1. How is risk reduced and why is this valuable?
   2. How is flow improved?
   3. How is team morale affected?
   4. How do small stories benefit the Product Owner?
Splitting stories into small, vertical slices.
Peter Green, Adobe 9/27/2013

One of the biggest challenges for teams that are new to an agile approach is the change from what we call horizontal splitting to a “vertical slice” approach. Teams often aren’t used to thinking about problem decomposition this way, and I’ll hear comments like
“well, our system is too complex”, or “we need to build really big features or our users won’t get what they need”. I always tell people that in the eight years I’ve been using this approach with hundreds of teams, I’ve only been stumped once to where we just couldn’t figure out how to slice something small enough to fit into a two week sprint.
Well, we could have split it, but it didn’t add any value. Below I’ll give a quick overview of why we prefer this approach and four simple strategies for splitting stories into small slices.

Horizontal vs. Vertical Slices
At its core, engineering is the art of decomposing really big problems into smaller ones so that we can start to tackle them.

Horizontal Slices
The traditional approach to building a big feature was to decompose in into the work that had to be done at architectural layers. For example, for a web service, we might break a feature down into the database components, the server components, and the client components. Often specialists in these areas would build their piece of the architecture separately, then we would have an integration phase at the end where we would put them all together and test them to make sure they worked as expected. While this makes sense logically, and allows us to develop high expertise in one of the architectural layers, it tended to have a very slow feedback loop depending on the size of the feature, since we’re waiting for everyone to be done with their separate piece to integrate and make sure it works. The term “horizontal slicing” refers to using this architectural layer approach as the primary method of decomposition of big features.
                                   Vertical Slices
In order to speed up the feedback loop, we can take a large feature and break it up into several small pieces that slice through each of the architectural layers. In my experience, we can break down almost any feature into slices that take a couple of days at most to get all of the pieces built, integrated, and tested. Each slice is comprised of any work needed to be done in an architectural layer as well as any testing and integration that may need to be done to make it ready to release. If you’re using a scrum approach, each vertical slice meets the definition of done within a day or two.

                                   Is a Vertical Slice a User Story?
It could be, and whenever we can find a vertical slice that is valuable to users, that’s the first preference.
However, at the day or two level of slicing, we are frequently getting into slices that are not providing really interesting things to users yet. Instead, we are now going for something that is useful to validate the system in some way. We focus on questions like whether integration works, or are there unexpected results when we build it, or does our design require any refactoring.
We often discover defects using this approach MUCH earlier than using a traditional horizontal slice approach. We’ll look at some examples of slices below that will give us an idea of a user story vertical slice vs something smaller that is still a vertical slice.

Four techniques for vertical slicing
Starting with a user story, I’ve found four filters to apply that often result in logical vertical slices: Vague Terms, Conjunctions, Acceptance Criteria, and Workflow Steps.

1. Vague Terms
Often we notice that user stories contain terms that are somewhat vague. That’s ok, user stories are supposed to be “Negotiable” (see Bill Wake’s INVEST acronym). Those vague terms often lead to possible vertical slices.

Example Story: As a frequent traveler, I want the weather application to store several days of weather data and display it while offline, so that I can see the forecast at my destination city when I don’t have cell service.

As a former tester, my first reaction to this story is “what do you mean by “several”? It’s a vague term. So is “display” – how will I know that I am using stored data vs. current data, etc.?. Both of these terms provide opportunities to slice by using an incremental approach. For example we might get the following slices from getting very specific about the display part:
1. Create a new UI element that displays a timestamp for the last known weather data snapshot (don’t need to actually have an offline mode yet).
2. When the phone has no service, add “Currently Offline” to the UI element.
3. Maintain the forecast data for the last known weather while offline.
For “several days” we might get something like:
1. Store the next day’s weather data
2. Store five day’s weather data

2. Conjunctions
Conjunction -junction, what’s your function?. Conjunctions are words that are connectors: AND, OR, WHEN, IF, for example, and when they’re present in a user story, they are often pretty obvious opportunities to create a vertical slice.
Example Story: “As a return user, I enter the option to save a credit card number and select it for future purposes, so that I don’t have to type in all of the data each time.”
Notice that the “I want” statement of this user story has two parts: save the number AND select it for future purposes. These are really easy to split into two slices:
1. Save a credit card number to my profile
2. Offer the option of using a saved credit card number on a purchase

3. Acceptance Criteria
The “T” in Bill Wake’s INVEST acronym stands for Testable. How will we know the user story is complete? Many teams, when they have this discussion, choose to document the answer to that question as Acceptance Criteria (also know as Acceptance Tests or
Conditions of Satisfaction). Let’s look at a sample User Story and the Acceptance
Criteria their team agreed on:
Example Story: As a non-english speaking user, I want the system to read my locale preferences from my profile and display the appropriately localized version of the website, so that I can read it without having to manually choose each time.
Hopefully you’ve noticed that this user story contains vague terms as well as a conjunction – our first two split opportunities. Let’s ignore those for now and just look at the acceptance criteria that the team building this story came up with:
1. The system will support all Locale Policies defined in the API
2. The system will use a URL switch to indicate the Locale Policy
3. The user will see the correct language without manually refreshing the system
Notice that each of these criteria could become its own vertical slice, or in some cases multiple slices. For example the first Acceptance Criteria could be split into two or three slices:
1. Support Japanese Locale Policy
2. Support the most common Locale Policies for our site: English, French, German,
    Japanese.
3. Support all specified Locale Policies
The second Acceptance Criteria coule be broken down as:
1. Don’t fail when a URL contains a Locale Policy (in other words, don’t localize but don’t give a Not Found error either).
2. When a URL contains a Locale Policy, pop up a page that indicates “we noticed you want to display the page for “Language”, is that correct? (validation step)
3. When the URL contains a Locale Policy, display the page for that policy.
The third step could be broken down as well – make the refresh manual as an interim step, then make it automatic.
4. Workflow Steps
The final way to split stories is by thinking about how a user will interact with the system, and building one little piece of that interaction at a time.
Very non-agile Example Story: As a manager, I want to assign tasks to workers so that workers know what to work on next.
In this work assignment system, we can break this user story into several workflow steps, each of which could be developed one at a time all the way through releasable:
1. Manager assigns task to worker
2. Worker sees message that a new task is assigned to them
3. Worker can choose to Accept task or Decline task
4. If Accept, task is added to their work queue
5. If Declined, worker is prompted to provide reason for declining
6. Manager receives message that worker accepted or declined, with reason if decline
Once we’ve broken this down into workflow steps, we see potentials in all four categories of slicing opportunities: vague terms, conjunctions, acceptance criteria (that we still need to define), and the workflow steps.

The advantages of vertical slices
When we take the time to slice our stories into very small pieces, a lot of cool agile magic happens.
! The smaller slices are much easier to understand, so there is less likelihood of a lack of consensus between team members.
! The small size also tends to make estimates more accurate, if your team is estimating these slices.
! When we decompose into small pieces, we often realize that not every single piece is really required by the user, so we can take advantage of the Pareto Principle and eliminate from our plan some of the “nice to haves” until we get validation from users that they won’t those pieces.
! Smaller slices give us a faster feedback loop – we find defects in design, usability, code, and integration faster. We can get them to users sooner for their feedback.
! If your team has specialized people on it (testers, DB people, etc.), they’re not sitting around waiting while a bunch of work is done in a previous step – since the slices are small, little pieces of work are flowing through the system quickly.
! According to Teresa Amabile’s awesome book “The Progress Principle” the single biggest factor (by far) in engagement at work is small progress every day. Small slices allow the team to get small wins on an almost daily basis, leading to greater engagement.
! Your daily scrums become far more interesting and useful. Instead of “yeah, I’m 20% done adding all of the new schema to the DB”, you get “we got the time stamps working in the UI, and today we’re going to make the data persist when we go offline”.
We can certainly go too far in our desire to split smaller. If you’re getting things down to a day or two, you’re in the sweet spot. We would typically do this level of splitting in the backlog refinement sessions leading up to the sprint in which the story is likely to be built.

!
                                      Splitting User Stories
Start                             As a <user> with the classic user          I want <something> story form:                      so that <value>

1.                                                   2.
            Conjunctions                                  Generic Words
Look for connector words                        Look for generic words that could be replaced with more and, or, if, when,                           specific terms but, then, as-well-as,                         (nouns, verbs, adjectives,
            & comma’s.                               adverbs can all be generic.)

3.              Acceptance                           4.             Timeline
                 Criteria                                           Analysis
 Acceptance criteria are
Pretend the user story is pass/fail conditions proving done. What happens when a story is done. Acceptance the functionality is used?
 criteria for the larger story
This sequence of events can can become a new, smaller lead to a series of smaller user stories with their own stories.
 acceptance criteria.

                      For more details & examples - visit SmallerStories.com

                                                                               By Laura Powers
                                                                               5/2013
    1
                                                                                 HOW TO SPLIT A USER STORY                                                                                                                                                        3
                                                                                                                                                                                                                                                                      EVALUATE
        PREPARE THE                                                                                                                                                                                                                                                   THE SPLIT
INPUT STORY                                                             WORKFLOW STEPS                         Can you take a thin slice through the workflow first and enhance it with more stories later?                                                                                                                  Are the new stories
        Does the big story satisfy                                     Can you split the story so you do                                                                                                                                                               roughly equal in size?
     INVEST* (except, perhaps, small)?                               the beginning and end of the work-
YES flow first and enhance with stories
                               NO                                      from the middle of the workflow?                                                OPERATIONS                                                                                      Is each story about               NO

                                                                                                                                                  Can you split the operations
                                                                                                                                                                                                BUSINESS RULE                                      1⁄10 to 1⁄6 of your velocity?
           YES
Combine it with another story or otherwise reformulate it to get                                                                                                into separate stories?                      VARIATIONS                                                                        Try another pattern on the a good, if large, starting story.                                                                                                                                   Can you split the story so you                                                            original story or the larger
DEFER                              Does the story describe do a subset of the rules first and enhance with additional rules later?
                                                                                                                                                                                                                                                          Do each of the                post-split stories.
                                                                                                                                                                                                                                                       stories satisfy INVEST?
        Is the story size 1⁄10 to
                                                                PERFORMANCE                                 a workflow?
                                                                                                                                      Does the story include multiple
          1⁄6 of your velocity?                                 Could you split the story                                                                                                                                                                                             Try another pattern.
operations? (e.g. is it about "managing" to just make it work first and or "configuring" something?)                                                                                Are there stories you then enhance it to satisfy the                                                                                      Does the story have a variety of                                can deprioritize or delete?

sta non-functional requirement?                                                                                     business rules? (e.g. is there a domain
  You’re done.             Continue. You

rt term in the story like "flexible dates"

he need to split it.                                                                                                                                                                                                                                           Try another pattern.

                                                                                                                                re
Does the story get much of its                                                                 that suggests several variations?)                                                                  You probably have waste complexity from satisfying               2                                                                                                                                                         in each of your stories.
non-functional requirements like performance?                             APPLY THE                                                                   VARIATIONS
Is there an obvious story to start with that gets you
SPLITTING                            Does the story do the same               IN DATA                           early value, learning, risk mitigation, etc.?

                                    Could you split the story to                    Does the story have a simple
PATTERNS                           thing to different kinds of data?      Can you split the story to process one kind of data                                                  Try another pattern to core that provides most of the                                                                                           first and enhance with the                                                 see if you can get this.
do that simple core first and                                                                                                               last value and/or learning?                                                                        reso                         other kinds later?               You’re done, though you enhance it with later stories?                                                                                                                        rt                                                       could try another pattern to see if it works better.
                                    SIMPLE/COMPLEX                                                        When you apply the obvious
Does the story have a complex interface?
split, is whichever story you do first the most difficult?
Could you group the later                                                                                                                  BREAK OUT A SPIKE stories and defer the decision                                                                                                                 Are you still baffled about
Does the story get the same about which story comes first?                                                                                                                   how to split the story?
                                                                                                                                  kind of data via multiple interfaces?
- INVEST - Stories should be:
  Independent                                                   MAJOR EFFORT                                                                                          Is there a simple version
  Negotiable                                                                                                                                                              you could do first?                               Can you find a small
  Valuable                                                                                                           Can you split the story to                                                                            piece you understand
  Estimable                                                                                                            handle data from one          INTERFACE                                                             well enough to start?
  Small
Testable interface first and enhance      VARIATIONS                                                                                           Can you define the 1-3 with the others later?                                                                                                             questions most holding you back?
Write that story first,                                              Take a break build it, and start again                                             and try again.
at the top of this process.              Write a spike with those questions, do the minimum to answer them, and start again at the top of this process

Visit http://www.richardlawrence.info/splitting-user-stories/ for more info on the story splitting patterns www.agileforall.com                                                                                                    Copyright © 2011-2013 Agile For All. All rights reserved.                                                                                                    Last updated 3/26/2013
                     Twenty Ways to Split Stories
The Big Picture

Research                 Implement             What have others done?

Spike                    Implement             Explore a quick solution

Manual                   Automated             Often have to retain manual solution anyway

Buy                      Build                 Can go either way; trade cost of customizing

Build                    Buy                     ..versus cost of implementing yourself

Single-User              Multi-User            Fewer worries about scale, user accounts

API only                 User Interface        Tests may function without user interfaces

Character or Script UI GUI                     Simple interface can prove out ideas

Generic UI               Custom UI             “Naked Objects” approach can be cheaper

Ilities

Static                   Dynamic               Do once and ignore updates

Ignore Errors            Handle Errors         Minimize error code (donʼt ignore exceptions)

Transient                Persistent            Focus on behavior over persistence

Low Fidelity             High Fidelity         Quality of result (e.g., pixel depth)

Unreliable               Reliable              “Perfect uptime is very expensive.”–Wm. Pietri

Small Scale              Large Scale           Build load capacity over time

Less “ilities”           More “ilities”        Address non-functional requirements later

Features

Few Features             Many Features         Easier to do fewer features

Main Flow                Alternative Flows Happy path vs. all possible paths

0                        1                     Nothing is easier than something

1                        Many                  One is easier than a bunch

One Level                All Levels            One level is the base case for all levels

Base Case                General Case          Base case must be done; others neednʼt

      See full article, “Twenty Ways to Split Stories,” http://xp123.com/xplor/xp0512

                          Copyright 2009, William C. Wake, xp123.com
Twenty Ways to Split Stories
Posted on September 30, 2005 by Bill Wake

Splitting stories lets us separate the parts that are of high value from those of low value, so we can spend our time on the valuable parts of a feature. (Occasionally, we have to go the other way as well, combining stories so they become big enough to be interesting.) There's usually a lot of value in getting a minimal, end-to-end solution present, then filling in the rest of the solution. These "splits" are intended to help you do that.

The Big Picture
    Easier                    Harder                                Why

It's easier to research how to do something than to do it (where the latter has to include whatever research is needed to get the job done). So, if a story is too hard, one split is to spend some
Research               Action                time researching solutions to it.

Developers may not have a good feeling for how to do something, or for the key dimensions on which you might split a story. You can buy learning for the price of a spike (a focused, hands-on experiment on some aspect of the system). A spike might last an hour, or a
Spike                  Implementation        day, rarely longer.

If there's a manual process in place, it's easier to just use that. (It may not bebetter but it's less automation work.)
For example, a sales system required a credit check. The initial implementation funneled such requests to a group that did the work manually. This let the system be released earlier; the automated credit check system was developed later.
                                             And it was not really throw-away work
Manual                 Automated             either – there was always going to be a manual process for borderline scores.

Sometimes, what you want already exists, and you can just buy it. For example, you might find a custom widget that costs a few hundred dollars. It might cost you
Buy            Build            many times that to develop yourself.

Other times, the "off-the-shelf" solution is a poor match for your reality, and the time you spent customizing it might have been better spent developing your own
Build          Buy              solution.

User Experience
      Easier         Harder                           Why

                                A batch system doesn't have to interact
Batch          Online           directly with the user.

You don't face issues of "what happens when two users try to do the same thing at the same time." You also may not have to worry about user accounts and keeping
Single-User    Multi-User       track of the users.

It's easier to not have a user interface at all. For example, if you're testing your ability to connect to another system, the first cut might settle for a unit test calling
API only       User Interface   the connection objects.

Character UI                    A simple interface can suffice to prove out or Script UI   GUI              critical areas.

At one level, you can use basic widgets before you get fancy with their styles. To go even further, something likeNaked
                                Objects infers a default user interface
Generic UI     Custom UI        from a set of objects.
!

"Ilities"
    Easier             Harder                          Why

It's easier to calculate something once than ensure it has the correct value every time its antecedents change. Sometimes, you can use a halfway approach:
                                   periodically check for a needed update,
Static            Dynamic          but don't do it until the user requests it.

While it's less work to ignore errors, that doesn't mean you should swallow
Ignore                             exceptions. Rather, the recovery code can errors            Handle errors    be minimized.

Let's you get the objects right without the worries about changing the mapping of
Transient         Persistent       persisted data.

You can break some features down by quality of result. E.g., a digital camera could start as a 1-pixel black-and-white camera, then improve along several axes:
9 pixels, 256 pixels, 10,000 pixels; 3-bit color, 12-bit color, 24-bit color; 75% color accuracy, 90% color accuracy, 95% color
Low fidelity      High fidelity    accuracy." (William Pietri)

                                   "Perfect uptime is very expensive.
                                   Approach it incrementally, measuring as
Unreliable        Reliable         you go." (William Pietri)

"A system that works for a few people for moderate data sets is a given. After that, each step is a new story. Don't forget the
Small scale       Large scale      load tests!" (William Pietri)

                                   It's easier to defer non-functional
Less "ilities,"                    requirements. (A common strategy is to e.g., slower      More "ilities"   set up spikes as side projects to prove out architectural strategies.)

Features
    Easier                Harder                                  Why

Few features         Many features           Fewer is easier.

(Use case terminology.) The main flow – the basic happy path – is usually the one with the most value. (If you can't complete the most trivial transaction, who cares that you have great recovery if
Main flow            Alternate flows         step 3 goes bad?)

Hardware architects have a "0, 1, infinity" rule – these are the easiest three values to handle. Special cases bring in issues of
0                    1                       resource management.

                                             It's usually easiest to get one right and
1                    Many                    then move to a collection.

Treat "and," "or," and "then" and other connector words as opportunities to split.
Split                                        Simplify a condition, or do only one part condition            Full condition          of a multi-step sequence.

                                             One level is the base case for a multi-level
One level            All levels              problem.

In general, you have to do a base case first (to have any assurance that recursive
Base case            General case            solutions will terminate).

Summary
These "splits" may help give you ideas when you're looking for a way to move forward in small steps. While it's important to be able to split stories, don't forget that you have to reassemble them to get the full functionality. But you'll usually find that there is a narrow but high-value path through your system.

!
Two good splitting tips from James Grenning
2009

TIME BOX
Sometimes you need to try things out. I am working with a game company, and they have the fun factor. They ask “How do you schedule making a game fun?”
5 points allocated to fun as the budget we are allowed to spend on fun in this iteration. That’s about 20% of the overall effort. If its not fun when we have spent the 20%, the product owner will schedule some more fun for an upcoming iteration. If it is really critical that it be fun now, the product owner could decide to push something out of the iteration in favor of improving the fun-factor. Either way we are trying to manage and keep visible, what would otherwise be an openended activity.
Generalizing this idea, the customer knows they need something, but until they get it they can’t be sure if it is right. This problem is as old as software development, even older. Probably as old as the first customer/supplier relationship.

STUB
Sometimes part of a story is known and part is a mystery. Can we make progress on light scheduling when we have no idea of how to turn on or off an X10 device?
In a word: yes.
It’s time to fake-it and use a stub implementation of the light-controlling code
When you choose to fake it with a stub, you are splitting the story. So, add a story to the backlog to keep track of the integration work. For example: Control
X10 light.
Oh yeah, once the scheduler is well along, the stub and its interface will provide a specification of what is needed from the X10 device driver. A nice side effect is that you can also insulate your core application from having specific knowledge of X10 when you keep the interface intention revealing (and avoid implementation revealing); that will be a plus when a WiFi (or whatever) light controlling device is added to the system.
Split, spike, stub and time box are helpful tools to cut big stories down to size. Use them together. Our light scheduling story illustrates the idea of a big story that has well understood parts (when lights should go on and off)
and mysterious parts (how the heck does X10 work?).
NOTES
    1
                                                                                 HOW TO SPLIT A USER STORY                                                                                                                                                        3
                                                                                                                                                                                                                                                                      EVALUATE
        PREPARE THE                                                                                                                                                                                                                                                   THE SPLIT
INPUT STORY                                                             WORKFLOW STEPS                         Can you take a thin slice through the workflow first and enhance it with more stories later?                                                                                                                  Are the new stories
        Does the big story satisfy                                     Can you split the story so you do                                                                                                                                                               roughly equal in size?
     INVEST* (except, perhaps, small)?                               the beginning and end of the work-
YES flow first and enhance with stories
                               NO                                      from the middle of the workflow?                                                OPERATIONS                                                                                      Is each story about               NO

                                                                                                                                                  Can you split the operations
                                                                                                                                                                                                BUSINESS RULE                                      1⁄10 to 1⁄6 of your velocity?
           YES
Combine it with another story or otherwise reformulate it to get                                                                                                into separate stories?                      VARIATIONS                                                                        Try another pattern on the a good, if large, starting story.                                                                                                                                   Can you split the story so you                                                            original story or the larger
DEFER                              Does the story describe do a subset of the rules first and enhance with additional rules later?
                                                                                                                                                                                                                                                          Do each of the                post-split stories.
                                                                                                                                                                                                                                                       stories satisfy INVEST?
        Is the story size 1⁄10 to
                                                                PERFORMANCE                                 a workflow?
                                                                                                                                      Does the story include multiple
          1⁄6 of your velocity?                                 Could you split the story                                                                                                                                                                                             Try another pattern.
operations? (e.g. is it about "managing" to just make it work first and or "configuring" something?)                                                                                Are there stories you then enhance it to satisfy the                                                                                      Does the story have a variety of                                can deprioritize or delete?

sta non-functional requirement?                                                                                     business rules? (e.g. is there a domain
  You’re done.             Continue. You

rt term in the story like "flexible dates"

he need to split it.                                                                                                                                                                                                                                           Try another pattern.

                                                                                                                                re
Does the story get much of its                                                                 that suggests several variations?)                                                                  You probably have waste complexity from satisfying               2                                                                                                                                                         in each of your stories.
non-functional requirements like performance?                             APPLY THE                                                                   VARIATIONS
Is there an obvious story to start with that gets you
SPLITTING                            Does the story do the same               IN DATA                           early value, learning, risk mitigation, etc.?

                                    Could you split the story to                    Does the story have a simple
PATTERNS                           thing to different kinds of data?      Can you split the story to process one kind of data                                                  Try another pattern to core that provides most of the                                                                                           first and enhance with the                                                 see if you can get this.
do that simple core first and                                                                                                               last value and/or learning?                                                                        reso                         other kinds later?               You’re done, though you enhance it with later stories?                                                                                                                        rt                                                       could try another pattern to see if it works better.
                                    SIMPLE/COMPLEX                                                        When you apply the obvious
Does the story have a complex interface?
split, is whichever story you do first the most difficult?
Could you group the later                                                                                                                  BREAK OUT A SPIKE stories and defer the decision                                                                                                                 Are you still baffled about
Does the story get the same about which story comes first?                                                                                                                   how to split the story?
                                                                                                                                  kind of data via multiple interfaces?
- INVEST - Stories should be:
  Independent                                                   MAJOR EFFORT                                                                                          Is there a simple version
  Negotiable                                                                                                                                                              you could do first?                               Can you find a small
  Valuable                                                                                                           Can you split the story to                                                                            piece you understand
  Estimable                                                                                                            handle data from one          INTERFACE                                                             well enough to start?
  Small
Testable interface first and enhance      VARIATIONS                                                                                           Can you define the 1-3 with the others later?                                                                                                             questions most holding you back?
Write that story first,                                              Take a break build it, and start again                                             and try again.
at the top of this process.              Write a spike with those questions, do the minimum to answer them, and start again at the top of this process

Visit http://www.richardlawrence.info/splitting-user-stories/ for more info on the story splitting patterns www.agileforall.com                                                                                                    Copyright © 2011-2013 Agile For All. All rights reserved.                                                                                                    Last updated 3/26/2013
