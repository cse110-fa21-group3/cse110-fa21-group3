# TA Meeting Notes

# Attendance:
- Ayushi
- Nathan 
- Martin
- Zhenyi
- Lailah
- Sanat

# Notes
- Think about the type of users that can use the app
- Drop user personas (at least 5 personas) 
- Each user persona represents a different person
- Narrow down: 1 or group of users to target (target audience)
- What features included will be governed by users
- prioritizing features we already have
- based on target group, which features are MVP or add ons
- MVP features: CRUD*, at least two add  on (domain specific) can be calendar, timer, grocery list, -->  features
  - add on features: 
- Needs CRUD
- scale units: for desktop -> mobile --> etc
- make it responsive (RESPONSIVE DESIGN) 
- assign a Designer Role
- Keep in mind: keep all artifacts on mirro (mind maps) 
- designs are set up on figma for prototypes
- think about all of this (user center thinking) 
- ID features based on target audience
- construct wire frames 



# CRUD
- Create: 
  - how are we getting recipes:
  - do we want users to manually to enter recipes
  - or do we want integration with browser, (get recipes from web)
  - websites and APIs 
  - do we want just have browser window and import stuff or manual entry support as well?
  - team design decision
  - OCR: optical character recoginition: scans documents and extracts data (possible but hard)
  - 
- Read:
  - Retrieve recipes
  - search and filter
  - potentially sort
  - search: search bar, search by name
  - extending search: search by other than name, filtering (tags)
  - hard code set of tags, or allow users to input their own tags
  - need some way of tags and filtering
  - after retrieving recipes, try to prioritize media aspects (videos, pictures, visuals) 
  - ask ourselves: should tags be pre ordered, user specified, or both 
- Update:
  - not as heavy as create or read
  - any form of user modification = update 
  - scaling of ingredients based on number of people
  - favorite or unfavorite
  - number of times recipe has been made
  - last time to make recipe
- Delete
  - can either complete recipe from data base
  - or unfavorite: can not show recipe to particular user
  - like udpate but can be delete
  - depends on users, profiles, authentications, etc

# Data Format
- do diggin on recipes, especially most popular results
- most recipes follow structure or schema or format
- utilize schema for formatting the recipes
- Recipe schema markup
  - google structured data - JSON LD
- schema.org (for recipes)
- hRecipe
- unstructure: dont folllow any schema besides on the fly (recc: do not look at this one) 


# Add on Features
- timer
- focus mode: when on recipe, dont show anything before or after the current step 
- speech integration, voice integration, dont bring touch as much
- low touch interfacing: ties to above
- meal reflection: rate the recipes, users can store notes how they felt after making 
- grocery list and pantry
  - can store ingredients and integrate with list, can use when shjopping for ingredients
- unit convertors: mL to L, etc (should be on the project)
- multi linguagal support: spanish, korean, etc 

# Cool Ideas:
- Spotify: favoriting, discover now, discover today etc
- food tinder: give recipes that people can swipe right or left

# APIs
- will most likely be the best friend
- any APIs we use are at our own risk
- same with dependencies
- TAs do not help with API issues
- no debuggin issues with API (TAs will help with general issues and possibly databases) 
- APIs : Spoonacular, TheMealDB, FoodDataCentral, CalorieNinjas
