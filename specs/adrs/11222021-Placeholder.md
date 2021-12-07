# Using a placeholder image instead of allowing the user to upload their own when they create a recipe. We decided to user a placeholder image

* Status: Accepted
* Deciders: Whole team
* Date: 2021-11-22

## Context and Problem Statement

It's difficult to handle storing and accessing images uploaded by the user. We can use the logo of the team as a placeholder for images in any user-created recipes.
The problem is as follows: should we use a placeholder image for user-created recipes or allow the user to upload their own?

## Considered Options

1. Placeholder image
2. Storing the image

## Decision Outcome

Chose option 1. because it's significantly easier on our dev team and we were having issues implementing image storage. Storing the images also takes up client-side storage in the browser as well, which can become an issue.

## Pros and Cons

### Placeholder Image

* Good, because the same for every recipe
* Bad, because the same for every recipe
* Good, because it's easy to implement
* Good, because we'll only need to store a single image

### Storing the Image

* Good, because it allows the user to customize the recipe more
* Bad, because it takes up a lot of storage space
* Bad, because it's more difficult to implement (too much time)
