# Loading into LocalStorage or querying Spoonacular directly. Decided to load a finite amount of recipes into LocalStorage

* Status: Accepted
* Deciders: Ayushi, Parsia, Nathan, Martin
* Date: 2021-11-20

## Context and Problem Statement

Our recipe manager needs recipes, which we source from the Spoonacular API; however, we couldn't decide whether to preload LocalStorage with recipes from the site, using some user preferences, or to use Spoonacular directly.
The problem is as follows: should recipes be accessed on-demand from the API or from LocalStorage assuming they've been preloaded?

## Considered Options

1. LocalStorage
2. Not LocalStorage (Spoonacular)

## Decision Outcome

Chose option 1, because it's faster and less computationally intensive. Also, Spoonacular has a request limit which we may hit easily if we query Spoonacular directly without LocalStorage.

## Pros and Cons

### LocalStorage

* Good, because it's local (no need for additional servers)
* Good, because it's free
* Good, because it's fast
* Bad, because data is confined to the client-side
* Bad, because the user has access to it

### Not LocalStorage (Spoonacular)

* Good, because we'd have access to the entire library of recipes
* Good, because it's less work for the dev team
* Bad, because it's computationally expensive
* Bad, because we can reach the daily request limit
