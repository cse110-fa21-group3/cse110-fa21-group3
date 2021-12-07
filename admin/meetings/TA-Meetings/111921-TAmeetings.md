# Meeting with Sanat Week 7

## Attendance
- Nathan
- Martin
- Lailah
- Parsia

## Discussion
- Assignments to prepare for CI/CD Pipeline and Internal Documentation
- CI/CD Pipeline
  - First check point is 11/15
  - very big part of the project
  - basically a pipeline with a series of steps from where we push code til the code gets deployed for use
  - read the write-up
  - CI = continuous integration 
  - CD = deployment (not explicitly for our project, jsut publish to github)
  - mainly focusing on CI 
  - all these steps are required for the pipeline (on canvas)
  - linting = transrming code to follow convention 
  - linter = powell will talk about this and we can use this
  - measure code quality: manually (human review) or automate it to get a guage (tools = take our code and analyze it then grades it)
  - unit testing: very important, will be mostly automated, some manually, have to do unit testing, everyone does testing seriously
  - documentation generation: js docs, passes javascript code to structure documentation, important
  - additional: extentions to unit testing, pixel testing (UI/UX testing) 
  - each of the actions are Github actions: either one big action or a bunch of small actions sequentially (Lab 3) 
  - have to draw block diagram explaining description the pipeline
  - small demo video: local change and then show process of stageing, creating PR, pushing, showing what happens in repo
  - deadline is 30th: supposed to be done asap 
  - all steps in the repo
  - no concreate expectations at each checkpoint: but is looking for incremental development
  - first checkpoint: linting, code quality (PRs and Issues), and then other additonal stuff (code quality tools) --> bare minimum
  - second checkpoint can be the other things like testing etc
  - do not worry about the checkpoints but do enough incrementally
- ADR assignment: 
  - formal document of any important design project decision
  - contains link in writeup
  - mainly design decisions: examples: choosing local storage vs database (impacts significantly)
  - document all these decision in template format
  - can reuse the template (in canvas) and can change it up a bit
  - document all critical decision
  - put it in the repo
  - practicing it is very good 
  - very important
  - lighter than CI/CD 
  - only 3 ADRs but should have more (do more than bare minimum) 5-6 at least
  - first checkpoint: at least 1 14th
  - second checkpoint: at least 2 23rd

# Implementation:
- Front end team: finish templates ready
- back-end team: start working with javascript code into the created templates (dom, query recipes, etc)
- somehow get the data for the recipe from the api and then populating the recipes on the project
- no checkpoints but keep working and end of week 8 finish UI style, structure perfect, UI functional, javvascript code, visualize legit, demonstrate crud, overall some resemblance of a working protype
- this is the expecation and if dont hit MVP (minimal viable product: CRUD), then going to be very hard
- CRUD finished by week 8, and testing (at least some)
- week 9: finish additonal implementation 
- add testing to pipeline
- ideally do not development in week 11 -> wont have time to correct stuff
- week 11: documentation, github wiki, consolidating test case reports
- final: watch party, make 2 videos (small and long) small = shown to class 4 minutes, long = private to grade 15 minutes
- finish 80% of project by end of week 8
